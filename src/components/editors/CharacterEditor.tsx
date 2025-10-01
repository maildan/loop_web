import React from 'react';

interface CharacterEditorProps {
  characterId: string;
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({ characterId }) => {
  // In a real app, you'd fetch character data based on the ID
  const character = { id: characterId, name: `캐릭터 ${characterId}` };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">캐릭터 설정: {character.name}</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">이름</label>
          <input type="text" id="name" defaultValue={character.name} className="mt-1 block w-full rounded-md border-input bg-background p-2" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">설명</label>
          <textarea id="description" rows={5} className="mt-1 block w-full rounded-md border-input bg-background p-2" placeholder="캐릭터에 대한 설명을 입력하세요..."></textarea>
        </div>
      </form>
    </div>
  );
};

export default CharacterEditor;
