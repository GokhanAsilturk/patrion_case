import axiosInstance from './axios';
import { Company } from '../types/company';

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const response = await axiosInstance.get('/companies');
    console.log('API Cevabı:', response.data); // Debug için API cevabını logluyoruz
    
    // API'den gelen şirket verilerini doğru formatta dönüştürelim
    if (response.data.data && response.data.data.companies) {
      return response.data.data.companies.map((company: any) => ({
        id: String(company.id), // ID'yi string'e dönüştürüyoruz
        name: company.name,
        description: company.description,
        status: company.status
      }));
    }
    return [];
  } catch (error) {
    console.error('Şirket verilerini alırken hata oluştu:', error);
    throw error;
  }
};

export const createCompany = async (company: Partial<Company>): Promise<Company> => {
  try {
    const response = await axiosInstance.post('/companies', company);
    
    // API'den dönen şirket verisini doğru formatta dönüştürelim
    const companyData = response.data.data;
    return {
      id: String(companyData.id),
      name: companyData.name,
      description: companyData.description,
      status: companyData.status
    };
  } catch (error) {
    console.error('Şirket oluşturulurken hata oluştu:', error);
    throw error;
  }
};

export const updateCompany = async (id: string, company: Partial<Company>): Promise<Company> => {
  try {
    const response = await axiosInstance.put(`/companies/${id}`, company);
    
    // API'den dönen şirket verisini doğru formatta dönüştürelim
    const companyData = response.data.data;
    return {
      id: String(companyData.id),
      name: companyData.name,
      description: companyData.description,
      status: companyData.status
    };
  } catch (error) {
    console.error('Şirket güncellenirken hata oluştu:', error);
    throw error;
  }
};

export const fetchCompanySensors = async (id: string): Promise<any[]> => {
  const response = await axiosInstance.get(`/companies/${id}/sensors`);
  return response.data.data;
};
