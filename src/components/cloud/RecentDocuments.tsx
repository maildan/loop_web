import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Document } from './DocumentSelector';
import { FileText, Edit } from 'lucide-react';

interface RecentDocumentsProps {
  documents: Document[];
  onDocumentSelect: (doc: Document) => void;
}

const getDocumentIcon = (type: string) => {
  // In a real app, you'd have more icons
  return <FileText className="h-6 w-6 text-muted-foreground" />;
};

export const RecentDocuments: React.FC<RecentDocumentsProps> = ({ documents, onDocumentSelect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 문서</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.slice(0, 3).map((doc) => (
            <div 
              key={doc.id} 
              onClick={() => onDocumentSelect(doc)}
              className="cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm p-4 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="mt-1">{getDocumentIcon(doc.type)}</div>
                <div className="flex-1">
                  <p className="font-semibold truncate">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    수정일: {doc.lastModified.toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDocumentSelect(doc);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
