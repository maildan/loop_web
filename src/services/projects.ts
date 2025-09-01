import api from './api';

// 나중에 실제 데이터 모델에 맞게 더 상세한 타입을 정의해야 합니다.
export interface ProjectStructure {
  id: string;
  name: string;
  characters: { id: string; name: string }[];
  memos: { id: string; title: string }[];
  synopses: { id: string; title: string; type: string }[];
  chapters: { id: string; title: string; order: number }[];
}

export const getProjects = async (): Promise<ProjectStructure[]> => {
  try {
    const response = await api.get<ProjectStructure[]>('/projects');
    return response;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
};

export const getProjectDetails = async (projectId?: string): Promise<ProjectStructure | null> => {
  try {
    let id = projectId;
    if (!id) {
      const projects = await getProjects();
      if (projects.length > 0) {
        id = projects[0].id;
      } else {
        // 프로젝트가 없으면 목업 데이터를 사용합니다.
        console.warn('No projects found, returning mock data.');
        return getMockProjectDetails('mock-project-id');
      }
    }
    const response = await api.get<ProjectStructure>(`/projects/${id}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch project details for ID: ${projectId}`, error);
    return getMockProjectDetails(projectId || 'mock-project-id');
  }
};


// 백엔드 연동 전/실패 시 사용할 목업 데이터
const getMockProjectDetails = (projectId: string): ProjectStructure => {
  console.warn(`[Mock Data] Returning mock data for project ${projectId}`);
  return {
    id: projectId,
    name: '나의 위대한 소설',
    characters: [
      { id: 'char-1', name: '주인공 A' },
      { id: 'char-2', name: '라이벌 B' },
    ],
    memos: [
      { id: 'memo-1', title: '플롯 아이디어' },
      { id: 'memo-2', title: '장소 설정' },
    ],
    synopses: [
      { id: 'syn-outline-1', title: '전체 줄거리', type: 'outline' },
      { id: 'syn-timeline-1', title: '사건 연대기', type: 'timeline' },
      { id: 'syn-mindmap-1', title: '인물 관계도', type: 'mindmap' },
    ],
    chapters: [
      { id: 'ch-1', title: '1장: 새로운 시작', order: 1 },
      { id: 'ch-2', title: '2장: 위기', order: 2 },
    ],
  };
};
