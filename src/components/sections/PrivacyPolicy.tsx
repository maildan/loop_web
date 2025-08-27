import React from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export const PrivacyPolicy: React.FC = () => {
  return (
    <Section id="privacy-policy" padding="xl">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">개인정보처리방침</h1>
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">제1조 (총칙)</h2>
            <p className="text-muted-foreground">
              [회사명]('이하 '회사')은(는) 이용자의 개인정보를 중요시하며, "정보통신망 이용촉진 및 정보보호"에 관한 법률을 준수하고 있습니다.
              회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>
            <h2 className="text-2xl font-semibold">제2조 (개인정보의 수집 및 이용 목적)</h2>
            <p className="text-muted-foreground">
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            {/* Add more content as needed */}
          </div>
        </div>
      </Container>
    </Section>
  );
};
