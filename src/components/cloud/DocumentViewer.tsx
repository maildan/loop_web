import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Share, Download, Edit, Copy, FileText, Clock, TrendingUp } from 'lucide-react';
import { Document } from './DocumentSelector';

interface DocumentViewerProps {
  document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
  // 문서 유형에 따른 가상 내용 생성
  const generateDocumentContent = (doc: Document) => {
    switch(doc.type) {
      case 'google-docs':
        return `# ${doc.name}\n\n## 개요\n\nLoop는 혁신적인 협업 도구로, 다양한 메신저와 협업 도구를 통합하여 효율적인 업무 환경을 제공합니다.\n\n## 주요 기능\n\n1. 메신저 통합\n2. 클라우드 저장소 연동\n3. 작업 관리 도구\n4. 일정 관리\n\n## 목표 및 전략\n\n* 사용자 경험 개선\n* 기능 확장\n* 시장 점유율 증가\n* 글로벌 시장 진출`;
      case 'notion':
        return `# ${doc.name}\n\n**팀원들과 공유할 내용:**\n\n- [ ] 개발 로드맵 검토\n- [ ] 사용자 피드백 분석\n- [ ] 다음 버전 기능 계획\n\n> 중요: 다음 미팅 전까지 완료해주세요!\n\n## 개발 일정\n\n| 항목 | 담당자 | 마감일 |\n| --- | --- | --- |\n| UI 개선 | 디자인팀 | 6월 10일 |\n| 백엔드 API | 서버팀 | 6월 15일 |\n| 테스트 | QA팀 | 6월 20일 |`;
      case 'slack':
        return `# ${doc.name}\n\n**@개발팀** 오늘 진행된 회의 내용 공유드립니다.\n\n@사용자1: 지난번 피드백 반영 상황은 어떤가요?\n@사용자2: UI 부분은 80% 완료되었고, 백엔드 연동 작업 진행 중입니다.\n@사용자3: 테스트 계획은 언제쯤 공유되나요?\n@사용자1: 이번 주 금요일까지 공유하겠습니다.\n\n**결정사항:**\n1. 다음 릴리스는 6월 말로 연기\n2. 베타 테스트 2주간 진행\n3. 우선순위 기능: 알림 개선, 동기화 속도 향상`;
      default:
        return `# ${doc.name}\n\n이 문서는 Loop 플랫폼에서 생성된 ${doc.type} 유형의 문서입니다.\n\n총 ${doc.wordCount}자로 구성되어 있으며, 읽는데 약 ${doc.readingTime}분이 소요됩니다.\n\n최종 수정일: ${doc.lastModified.toLocaleDateString('ko-KR')}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{document.name}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              공유
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              편집
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold">{document.wordCount.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">단어 수</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold">{document.readingTime}분</div>
            <div className="text-sm text-muted-foreground">읽기 시간</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold">
              {document.lastModified.toLocaleDateString('ko-KR')}
            </div>
            <div className="text-sm text-muted-foreground">최종 수정</div>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">문서 내용</h3>
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              복사
            </Button>
          </div>
          <div className="prose max-w-none">
            {generateDocumentContent(document).split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold mb-4">{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-semibold mb-3 mt-6">{line.substring(3)}</h2>;
              } else if (line.startsWith('* ')) {
                return <li key={index} className="ml-6">{line.substring(2)}</li>;
              } else if (line.startsWith('- [ ] ')) {
                return (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input type="checkbox" className="rounded" />
                    <span>{line.substring(6)}</span>
                  </div>
                );
              } else if (line.startsWith('> ')) {
                return <blockquote key={index} className="pl-4 border-l-4 border-primary/20 italic my-4">{line.substring(2)}</blockquote>;
              } else if (line.startsWith('|')) {
                // 간단한 테이블 처리
                return <div key={index} className="font-mono text-sm my-1">{line}</div>;
              } else if (line.startsWith('@')) {
                return <p key={index} className="mb-2"><strong>{line.split(':')[0]}</strong>: {line.split(':')[1]}</p>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                return <li key={index} className="ml-6 list-decimal">{line.substring(3)}</li>;
              } else {
                return <p key={index} className="mb-2">{line}</p>;
              }
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
