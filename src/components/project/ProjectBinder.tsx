import React from 'react';
import { Users, StickyNote, Book, FileText, Map, Clock, BrainCircuit, ChevronDown, Loader2 } from 'lucide-react';
import { ProjectStructure } from '../../services/projects';

interface BinderSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const BinderSection: React.FC<BinderSectionProps> = ({ title, icon: Icon, children }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div>
      <h3
        className="flex items-center font-semibold text-sm text-muted-foreground px-2 py-1 cursor-pointer hover:bg-muted rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="h-4 w-4 mr-2" />
        <span className="flex-grow">{title}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </h3>
      {isOpen && (
        <ul className="pl-4 mt-1 space-y-1 border-l border-muted-foreground/20 ml-4">
          {children}
        </ul>
      )}
    </div>
  );
};

interface BinderItemProps {
  children: React.ReactNode;
  icon?: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
}

const BinderItem: React.FC<BinderItemProps> = ({ children, icon: Icon, isSelected, onClick }) => (
  <li 
    className={`flex items-center text-sm cursor-pointer hover:bg-accent px-2 py-1 rounded-md text-foreground ${isSelected ? 'bg-accent font-semibold' : ''}`}
    onClick={onClick}
  >
    {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground" />}
    <span>{children}</span>
  </li>
);

interface ProjectBinderProps {
  projectName: string;
  projectData: ProjectStructure | null;
  selectedItem: string | null;
  onSelectItem: (id: string) => void;
}

export const ProjectBinder: React.FC<ProjectBinderProps> = ({ projectName, projectData, selectedItem, onSelectItem }) => {
  const synopsisIcons: { [key: string]: React.ElementType } = {
    outline: FileText,
    timeline: Clock,
    mindmap: BrainCircuit,
  };
  return (
    <div className="p-2 h-full">
      <h2 className="text-lg font-bold p-2 mb-2">{projectName || '프로젝트'}</h2>
            {!projectData ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <nav className="space-y-2">
          <BinderSection title="캐릭터" icon={Users}>
            {projectData.characters.map((char: any) => (
              <BinderItem 
                key={char.id}
                isSelected={selectedItem === char.id}
                onClick={() => onSelectItem(char.id)}
              >
                {char.name}
              </BinderItem>
            ))}
          </BinderSection>
          <BinderSection title="메모" icon={StickyNote}>
            {projectData.memos.map((memo: any) => (
              <BinderItem 
                key={memo.id}
                isSelected={selectedItem === memo.id}
                onClick={() => onSelectItem(memo.id)}
              >
                {memo.title}
              </BinderItem>
            ))}
          </BinderSection>
          <BinderSection title="시놉시스" icon={Map}>
            {projectData.synopses.map((item: any) => (
              <BinderItem 
                key={item.id} 
                icon={synopsisIcons[item.type]}
                isSelected={selectedItem === item.id}
                onClick={() => onSelectItem(item.id)}
              >
                {item.title}
              </BinderItem>
            ))}
          </BinderSection>
          <BinderSection title="챕터" icon={Book}>
            {projectData.chapters.map((chapter: any) => (
              <BinderItem 
                key={chapter.id}
                isSelected={selectedItem === chapter.id}
                onClick={() => onSelectItem(chapter.id)}
              >
                {chapter.title}
              </BinderItem>
            ))}
          </BinderSection>
        </nav>
      )}
    </div>
  );
};
