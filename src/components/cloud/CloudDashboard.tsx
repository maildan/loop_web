import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ProjectCard } from './ProjectCard';
import { useAuth } from '@/contexts/AuthContext';
import { getProjects, Project } from '@/services/projects';
import { Skeleton } from '@/components/ui/skeleton';

export function CloudDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        toast.error('프로젝트를 불러오는 데 실패했습니다.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = projects[dragIndex];
    setProjects(prevProjects => {
      const newProjects = [...prevProjects];
      newProjects.splice(dragIndex, 1);
      newProjects.splice(hoverIndex, 0, dragCard);
      return newProjects;
    });
  };

  const handleCardClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">내 프로젝트</h1>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 sm:p-6 md:p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">내 프로젝트</h1>
        </header>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              index={index}
              id={project.id}
              name={project.name}
              lastModified={new Date(project.updatedAt).toLocaleDateString('ko-KR')}
              moveCard={moveCard}
              onClick={() => handleCardClick(project.id)}
            />
          ))}
        </motion.div>

        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">아직 참여중인 프로젝트가 없습니다.</p>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
