import React from 'react';

interface ProjectInspectorProps {
  selectedItem: string | null;
}

const ProjectInspector: React.FC<ProjectInspectorProps> = ({ selectedItem }) => {
  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">인스펙터</h2>
      {selectedItem ? (
        <div>
          <p className="text-sm text-muted-foreground">선택된 항목 정보:</p>
          <p className="text-sm font-mono mt-2 p-2 bg-muted rounded-md break-all">{selectedItem}</p>
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold text-sm">속성</h3>
            <p className="text-xs text-muted-foreground mt-2">메타데이터 및 관련 도구가 여기에 표시됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-muted-foreground">항목을 선택하여<br/>세부 정보를 확인하세요.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectInspector;
