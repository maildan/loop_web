import React from 'react';

interface SynopsisEditorProps {
  synopsisId: string;
}

const SynopsisEditor: React.FC<SynopsisEditorProps> = ({ synopsisId }) => {
  // In a real app, you'd fetch synopsis data based on the ID
  const type = synopsisId.split('-')[1] || '항목';
  const title = {
    'outline': '아웃라인',
    'timeline': '타임라인',
    'mindmap': '마인드맵'
  }[type] || '시놉시스';

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">시놉시스: {title}</h2>
      <div className="mt-4 p-4 border rounded-md bg-muted/20 h-96 flex items-center justify-center">
        <p className="text-muted-foreground">{title} 에디터 구현 영역</p>
      </div>
    </div>
  );
};

export default SynopsisEditor;
