import apiService from './api';
import { Document } from '../components/cloud/DocumentSelector';

export const fetchDocuments = () => {
  return apiService.get<Document[]>('/documents');
};

export const fetchDashboardStats = () => {
  // Stats에 대한 타입 정의가 필요합니다.
  return apiService.get<any>('/stats');
};

export const createDocument = (title: string) => {
  return apiService.post<Document>('/documents', { title });
};
