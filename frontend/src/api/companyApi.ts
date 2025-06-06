import axiosInstance from './axios';
import { Company } from '../types/company';

export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await axiosInstance.get('/companies');
  return response.data;
};

export const createCompany = async (company: Partial<Company>): Promise<Company> => {
  const response = await axiosInstance.post('/companies', company);
  return response.data;
};

export const updateCompany = async (id: string, company: Partial<Company>): Promise<Company> => {
  const response = await axiosInstance.put(`/companies/${id}`, company);
  return response.data;
};

export const fetchCompanySensors = async (id: string): Promise<any[]> => {
  const response = await axiosInstance.get(`/companies/${id}/sensors`);
  return response.data;
};
