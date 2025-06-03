import React from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Web Development',
      description: 'Custom websites built with modern technologies and best practices.',
      features: ['React/Next.js', 'TypeScript', 'Responsive Design', 'Performance Optimization'],
      icon: '💻',
    },
    {
      title: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      features: ['React Native', 'Flutter', 'iOS/Android', 'App Store Deployment'],
      icon: '📱',
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive designs that enhance user experience.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
      icon: '🎨',
    },
    {
      title: 'E-commerce',
      description: 'Complete e-commerce solutions to grow your online business.',
      features: ['Shopify', 'WooCommerce', 'Payment Integration', 'Inventory Management'],
      icon: '🛒',
    },
    {
      title: 'SEO & Marketing',
      description: 'Improve your online visibility and reach your target audience.',
      features: ['Technical SEO', 'Content Strategy', 'Analytics', 'Social Media'],
      icon: '📈',
    },
    {
      title: 'Consulting',
      description: 'Strategic guidance to help you make the right technology decisions.',
      features: ['Technology Audit', 'Architecture Planning', 'Team Training', 'Best Practices'],
      icon: '💡',
    },
  ];

  return (
    <Section id="services" padding="xl">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to launch, we provide comprehensive digital solutions 
            tailored to your specific business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <p className="text-muted-foreground">{service.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm">
                      <span className="text-primary mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
};
