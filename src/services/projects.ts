import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface ProjectStructure {
  name: string;
  characters: any[];
  memos: any[];
  synopses: any[];
  chapters: any[];
}

export interface Project {
  id: string;
  name: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export const getProjectDetails = async (projectId: string): Promise<ProjectStructure> => {
  try {
    const response = await api.get<ProjectStructure>(`/projects/${projectId}/details`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch project details:', error);
    // In case of error, return a default empty structure
    return { name: '', characters: [], memos: [], synopses: [], chapters: [] };
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};

