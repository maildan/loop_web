import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/DropdownMenu';
import { ChevronDown, FileText, Folder, Clock, TrendingUp } from 'lucide-react';

export interface Document {
  id: string;
  name: string;
  type: 'google-docs' | 'notion' | 'slack' | 'other';
  lastModified: Date;
  wordCount: number;
  readingTime: number;
}

interface DocumentSelectorProps {
  documents: Document[];
  selectedDocument: Document | null;
  onDocumentSelect: (document: Document) => void;
}

export function DocumentSelector({ 
  documents, 
  selectedDocument, 
  onDocumentSelect 
}: DocumentSelectorProps) {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredDocuments = documents.filter(doc => 
    filterType === 'all' || doc.type === filterType
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'google-docs':
        return '📄';
      case 'notion':
        return '📝';
      case 'slack':
        return '💬';
      default:
        return '📋';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'google-docs':
        return 'Google Docs';
      case 'notion':
        return 'Notion';
      case 'slack':
        return 'Slack';
      default:
        return '기타';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">문서 선택</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {filterType === 'all' ? '전체' : getTypeLabel(filterType)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterType('all')}>
              전체
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType('google-docs')}>
              Google Docs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType('notion')}>
              Notion
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType('slack')}>
              Slack
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
              selectedDocument?.id === document.id 
                ? 'border-primary bg-accent' 
                : 'border-border'
            }`}
            onClick={() => onDocumentSelect(document)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-xl">{getTypeIcon(document.type)}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {document.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {document.lastModified.toLocaleDateString('ko-KR')}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {document.wordCount.toLocaleString()}자
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {document.readingTime}분
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>선택한 필터에 해당하는 문서가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
