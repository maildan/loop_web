import React from 'react';

interface MemoEditorProps {
  memoId: string;
}

const MemoEditor: React.FC<MemoEditorProps> = ({ memoId }) => {
  // In a real app, you'd fetch memo data based on the ID
  const memo = { id: memoId, title: `메모 ${memoId}`, content: '' };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">메모: {memo.title}</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">제목</label>
          <input type="text" id="title" defaultValue={memo.title} className="mt-1 block w-full rounded-md border-input bg-background p-2" />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-muted-foreground">내용</label>
          <textarea id="content" rows={15} className="mt-1 block w-full rounded-md border-input bg-background p-2" placeholder="메모 내용을 입력하세요..."></textarea>
        </div>
      </form>
    </div>
  );
};

export default MemoEditor;
