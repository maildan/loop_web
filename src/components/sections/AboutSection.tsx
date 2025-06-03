import React from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export const AboutSection: React.FC = () => {
  const features = [
    {
      title: 'Modern Design',
      description: 'Clean, contemporary designs that stand out and engage your audience.',
      icon: '🎨',
    },
    {
      title: 'Responsive',
      description: 'Perfect display across all devices, from mobile to desktop.',
      icon: '📱',
    },
    {
      title: 'Fast Performance',
      description: 'Optimized for speed and performance with modern web technologies.',
      icon: '⚡',
    },
    {
      title: 'SEO Optimized',
      description: 'Built with search engine optimization best practices in mind.',
      icon: '🔍',
    },
  ];

  return (
    <Section id="about" background="muted" padding="xl">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Loop?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine creativity with technical expertise to deliver web solutions 
            that exceed expectations and drive real business results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4">
              Founded with a passion for creating exceptional digital experiences, 
              Loop has been helping businesses establish their online presence for over a decade.
            </p>
            <p className="text-muted-foreground mb-6">
              Our team of designers and developers work collaboratively to bring your 
              vision to life, ensuring every project is delivered on time and exceeds expectations.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
              <div className="text-6xl">🚀</div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
