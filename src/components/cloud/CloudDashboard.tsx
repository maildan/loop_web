import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../ui/Container';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Define the Project type
interface Project {
  id: string;
  name: string;
  lastModified: string;
  description: string;
}

// Mock data for projects
const mockProjects: Project[] = [
  { id: 'proj-1', name: '나의 첫 소설: 시간 여행자', lastModified: '2024-08-15', description: '시간을 넘나드는 한 과학자의 모험을 다룬 SF 소설입니다.' },
  { id: 'proj-2', name: '판타지 세계관 설정집', lastModified: '2024-08-10', description: '드래곤과 마법이 공존하는 새로운 세계, 아르카디아의 모든 것.' },
  { id: 'proj-3', name: '단편 시나리오: 여름밤의 꿈', lastModified: '2024-07-22', description: '한여름 밤, 두 남녀의 엇갈린 사랑 이야기를 담은 단편 영화 시나리오.' },
];

export function CloudDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would fetch projects from an API
    // For now, we use mock data
    setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateNewProject = () => {
    // Logic to create a new project will be implemented later
    toast.info('새 프로젝트 만들기 기능은 곧 추가될 예정입니다.');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">내 프로젝트</h1>
          <Button onClick={handleCreateNewProject}>
            <PlusCircle className="mr-2 h-4 w-4" />
            새 프로젝트 만들기
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{project.description}</p>
              </CardContent>
              <div className="p-6 pt-0 text-xs text-muted-foreground">
                마지막 수정: {project.lastModified}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
