import React from 'react';

interface ChapterEditorProps {
  chapterId: string;
}

const ChapterEditor: React.FC<ChapterEditorProps> = ({ chapterId }) => {
  // In a real app, you'd fetch chapter data based on the ID
  const chapter = { id: chapterId, title: `챕터 ${chapterId.split('-')[1]}`, content: '' };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{chapter.title}</h2>
      <div className="mt-4 p-4 border rounded-md bg-muted/20 h-[calc(100vh-150px)]">
        <textarea 
          className="w-full h-full bg-transparent border-none resize-none focus:outline-none"
          placeholder="이야기를 시작하세요..."
        />
      </div>
    </div>
  );
};

export default ChapterEditor;
