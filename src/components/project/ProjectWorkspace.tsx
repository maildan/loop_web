import React from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels';
import { ProjectBinder, ProjectEditor, ProjectInspector } from './';
import { getProjectDetails, ProjectStructure } from '../../services/projects';

const ProjectWorkspace: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [projectData, setProjectData] = React.useState<ProjectStructure | null>(null);

  React.useEffect(() => {
    const fetchProjectData = async () => {
      if (projectId) {
        const data = await getProjectDetails(projectId);
        setProjectData(data);
      }
    };
    fetchProjectData();
  }, [projectId]);

  const handleSelectItem = (id: string) => {
    setSelectedItem(id);
  };

  return (
    <div className="h-screen w-screen bg-background text-foreground">
      <PanelGroup direction="horizontal">
        {/* Left Panel (Binder) */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-r overflow-y-auto">
            <ProjectBinder 
              projectName={projectData?.name || ''}
              projectData={projectData}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
        {/* Center Panel (Editor) */}
        <Panel defaultSize={55} minSize={30}>
          <ProjectEditor selectedItem={selectedItem} />
        </Panel>
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary transition-colors" />
        {/* Right Panel (Inspector) */}
        <Panel defaultSize={25} minSize={15} maxSize={35}>
          <div className="h-full border-l overflow-y-auto">
            <ProjectInspector selectedItem={selectedItem} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default ProjectWorkspace;
