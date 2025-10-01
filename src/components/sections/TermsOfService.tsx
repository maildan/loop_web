import React from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export const TermsOfService: React.FC = () => {
  return (
    <Section id="terms-of-service" padding="xl">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">서비스 이용 약관</h1>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">제1조 (목적)</h2>
            <p className="text-muted-foreground">
              이 약관은 [회사명]('이하 '회사')이 제공하는 [서비스명] 관련 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
            <h2 className="text-2xl font-semibold">제2조 (정의)</h2>
            <p className="text-muted-foreground">
              이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              1. "서비스"라 함은 구현되는 단말기(PC, TV, 휴대형단말기 등의 각종 유무선 장치를 포함)와 상관없이 "회원"이 이용할 수 있는 [서비스명] 관련 제반 서비스를 의미합니다.
            </p>
            {/* Add more content as needed */}
          </div>
        </div>
      </Container>
    </Section>
  );
};
