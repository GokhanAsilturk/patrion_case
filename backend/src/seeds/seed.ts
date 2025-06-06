import * as companyModel from '../models/company.model';
import * as userModel from '../models/user.model';
import { UserInput,UserRole } from '../types/user';
import bcrypt from 'bcrypt';
import { log } from '../utils/logger';

const seedDatabase = async () => {
  try {
    console.log('Seed işlemi başlatılıyor...');
    // Varsayılan şirket verisi
    const company = {
      id: 1,
      name: 'Patrion',
      description: 'test',
      status: 'active' as 'active' | 'inactive'
    };

    // Varsayılan kullanıcı verisi
    const user: UserInput = {
      username: 'systemadmin',
      email: 'admin@system.com',
      password: 'admin123', 
      fullName: 'System Admin',
      company_id: 1,
      role: UserRole.SYSTEM_ADMIN
    };

    // Veritabanı bağlantısını test et
    try {
      // Bağlantı testi yap
      await new Promise<void>((resolve, reject) => {
        const testQuery = 'SELECT 1';
        const timeout = setTimeout(() => {
          reject(new Error('Veritabanı bağlantı zaman aşımı'));
        }, 5000);
        
        import('../config/database').then(async (db) => {
          try {
            const result = await db.default.query(testQuery);
            if (result.rows && result.rows.length > 0) {
              console.log('Seed veritabanı bağlantı kontrolü başarılı');
              clearTimeout(timeout);
              resolve();
            } else {
              reject(new Error('Veritabanı sorgu sonuç döndürmedi'));
            }
          } catch (err) {
            clearTimeout(timeout);
            reject(err);
          }
        }).catch(err => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log.error('Seed veritabanı bağlantı kontrolü başarısız', { error: errorMessage });
      throw new Error(`Veritabanı bağlantı hatası: ${errorMessage}`);
    }

    // Veritabanında şirketi kontrol et ve ekle
    try {
      console.log('Şirket kontrolü yapılıyor...');
      const existingCompany = await companyModel.getCompanyById(company.id);
      if (!existingCompany) {
        console.log('Şirket kaydı bulunamadı, oluşturuluyor...');
        await companyModel.createCompany(company);
        log.info('Şirket eklendi', { company: { ...company } });
        console.log('Şirket başarıyla oluşturuldu:', company.name);
      } else {
        log.info('Şirket zaten mevcut', { companyId: company.id });
        console.log('Şirket zaten mevcut:', existingCompany.name);
      }
    } catch (companyError) {
      const errorMessage = companyError instanceof Error ? companyError.message : 'Bilinmeyen hata';
      log.error('Şirket seed işlemi sırasında hata', { error: errorMessage });
      console.error('Şirket seed hatası:', errorMessage);
      throw companyError; // Hatayı üst düzeye ilet
    }

    // Veritabanında kullanıcıyı kontrol et ve ekle
    try {
      console.log('Kullanıcı kontrolü yapılıyor...');
      const existingUser = await userModel.findUserByEmail(user.email);
      if (!existingUser) {
        console.log('Kullanıcı bulunamadı, oluşturuluyor...');
        // Şifreyi hash'le
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        
        // Hash'lenmiş şifre ile kullanıcı oluştur
        await userModel.createUser({
          ...user,
          password: hashedPassword
        });
        
        log.info('Kullanıcı eklendi', { user: { ...user, password: '[GIZLI]' } });
        console.log('Kullanıcı başarıyla oluşturuldu:', user.username);
      } else {
        log.info('Kullanıcı zaten mevcut', { email: user.email });
        console.log('Kullanıcı zaten mevcut:', existingUser.username);
      }
    } catch (userError) {
      const errorMessage = userError instanceof Error ? userError.message : 'Bilinmeyen hata';
      log.error('Kullanıcı seed işlemi sırasında hata', { error: errorMessage });
      console.error('Kullanıcı seed hatası:', errorMessage);
      throw userError; // Hatayı üst düzeye ilet
    }

  } catch (error) {
    log.error('Seed işlemi sırasında genel hata', { error: error instanceof Error ? error.message : 'Bilinmeyen hata' });
  }
};

export default seedDatabase;