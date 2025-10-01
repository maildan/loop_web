import React from 'react';
import { CharacterEditor, MemoEditor, SynopsisEditor, ChapterEditor } from '../editors';

interface ProjectEditorProps {
  selectedItem: string | null;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ selectedItem }) => {
  const renderEditor = () => {
    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">왼쪽 바인더에서 항목을 선택하세요.</p>
        </div>
      );
    }

    if (selectedItem.startsWith('char-')) {
      return <CharacterEditor characterId={selectedItem} />;
    }

    if (selectedItem.startsWith('memo-')) {
      return <MemoEditor memoId={selectedItem} />;
    }

    if (selectedItem.startsWith('syn-')) {
      return <SynopsisEditor synopsisId={selectedItem} />;
    }

    if (selectedItem.startsWith('ch-')) {
      return <ChapterEditor chapterId={selectedItem} />;
    }

    // Add other editors here based on prefix (memo-, syn-, ch-)
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">에디터</h2>
        <div>
          <p className="text-sm text-muted-foreground">현재 선택된 항목:</p>
          <p className="text-xl font-bold">{selectedItem}</p>
          <div className="mt-4 p-4 border rounded-md bg-muted/20">
            <p>이 항목에 대한 에디터가 아직 구현되지 않았습니다.</p>
          </div>
        </div>
      </div>
    );
  };

  return <div className="h-full overflow-y-auto">{renderEditor()}</div>;
};

export default ProjectEditor;
