import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Company } from '../../types/company';
import { fetchCompanies, createCompany, updateCompany } from '../../api/companyApi';

interface CompanyState {
  companies: Company[];
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  companies: [],
  loading: false,
  error: null,
};

export const getCompanies = createAsyncThunk('companies/getCompanies', async () => {
  return await fetchCompanies();
});

export const createCompanyAsync = createAsyncThunk('companies/createCompany', async (company: Partial<Company>) => {
  return await createCompany(company);
});

export const updateCompanyAsync = createAsyncThunk('companies/updateCompany', async ({ id, company }: { id: string, company: Partial<Company> }) => {
  return await updateCompany(id, company);
});

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Şirketler alınamadı';
      })
      .addCase(createCompanyAsync.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateCompanyAsync.fulfilled, (state, action) => {
        const idx = state.companies.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.companies[idx] = action.payload;
      });
  },
});

export default companySlice.reducer;