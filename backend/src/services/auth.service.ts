import { UserInput, UserLogin, UserResponse } from '../types/user';
import * as userModel from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import bcrypt from 'bcrypt';
import { DatabaseError, AuthenticationError, ValidationError } from '../utils/error';
import { ErrorCode } from '../types/error';
import { log } from '../utils/logger';

export const register = async (userData: UserInput): Promise<UserResponse> => {
  try {
    const existingUser = await userModel.findUserByEmail(userData.email);
    if (existingUser) {
      throw new DatabaseError('Bu email adresi zaten kayıtlı', ErrorCode.USER_ALREADY_EXISTS);
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const { full_name, ...rest } = userData as any;
    const userDataWithCorrectFields = {
      ...rest,
      fullName: full_name ?? userData.fullName,
      password: hashedPassword
    };
    
    const user = await userModel.createUser(userDataWithCorrectFields)
      .catch(err => {
        throw new DatabaseError(`Kullanıcı oluşturulurken veritabanı hatası: ${err.message}`, ErrorCode.DB_QUERY_ERROR);
      });

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword
    };
  } catch (error) {
    // Özel hataları tekrar fırlat
    if (error instanceof DatabaseError || error instanceof ValidationError) {
      throw error;
    }
    
    // Tanımlanmamış hatalar için logla ve DatabaseError oluştur
    log.error('Kullanıcı kaydı sırasında tanımlanmamış hata:', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    throw new DatabaseError(
      'Kullanıcı kaydı sırasında bir hata oluştu', 
      ErrorCode.OPERATION_FAILED, 
      { originalError: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    );
  }
};

export const login = async (credentials: UserLogin): Promise<UserResponse> => {
  try {
    log.info('Giriş deneme başlatıldı', { email: credentials.email });
    
    const user = await userModel.findUserByEmail(credentials.email)
      .catch(err => {
        log.error('Kullanıcı arama hatası', { error: err.message });
        throw new DatabaseError(`Kullanıcı aranırken veritabanı hatası: ${err.message}`, ErrorCode.DB_QUERY_ERROR);
      });
    
    if (!user) {
      log.warn('Kullanıcı bulunamadı', { email: credentials.email });
      throw new AuthenticationError('Geçersiz kullanıcı adı veya şifre', ErrorCode.INVALID_CREDENTIALS);
    }

    log.info('Kullanıcı bulundu, şifre kontrolü yapılıyor', { 
      userId: user.id, 
      hashedPasswordLength: user.password?.length,
      providedPasswordLength: credentials.password?.length 
    });

    const isValidPassword = await bcrypt.compare(credentials.password, user.password)
      .catch(err => {
        log.error('Şifre karşılaştırma hatası', { error: err.message });
        throw new AuthenticationError(`Şifre doğrulama hatası: ${err.message}`, ErrorCode.INVALID_CREDENTIALS);
      });
    
    log.info('Şifre kontrolü tamamlandı', { isValid: isValidPassword });
    
    if (!isValidPassword) {
      log.warn('Geçersiz şifre', { userId: user.id });
      throw new AuthenticationError('Geçersiz kullanıcı adı veya şifre', ErrorCode.INVALID_CREDENTIALS);
    }

    const token = generateToken(user);
    log.info('Giriş başarılı', { userId: user.id });

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token
    };
  } catch (error) {
    // Özel hataları tekrar fırlat
    if (error instanceof AuthenticationError || error instanceof DatabaseError) {
      throw error;
    }
    
    // Tanımlanmamış hatalar için logla ve AuthenticationError oluştur
    log.error('Giriş sırasında tanımlanmamış hata:', {
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    throw new AuthenticationError(
      'Giriş yapılırken bir hata oluştu', 
      ErrorCode.INVALID_CREDENTIALS, 
      { originalError: error instanceof Error ? error.message : 'Bilinmeyen hata' }
    );
  }
};