import React from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Card, CardContent } from '../ui/Card';

export const PortfolioSection: React.FC = () => {
  const projects = [
    {
      title: 'E-commerce Platform',
      description: 'Modern online store with advanced filtering and payment integration.',
      image: '🛍️',
      tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      link: '#',
    },
    {
      title: 'Healthcare App',
      description: 'Patient management system with appointment scheduling.',
      image: '🏥',
      tags: ['React Native', 'TypeScript', 'Firebase'],
      link: '#',
    },
    {
      title: 'Financial Dashboard',
      description: 'Real-time analytics dashboard for financial data visualization.',
      image: '📊',
      tags: ['Next.js', 'D3.js', 'PostgreSQL'],
      link: '#',
    },
    {
      title: 'Learning Platform',
      description: 'Online education platform with video streaming and quizzes.',
      image: '📚',
      tags: ['Vue.js', 'Laravel', 'AWS'],
      link: '#',
    },
    {
      title: 'Food Delivery App',
      description: 'Full-stack food delivery solution with real-time tracking.',
      image: '🍕',
      tags: ['Flutter', 'Node.js', 'Socket.io'],
      link: '#',
    },
    {
      title: 'Travel Booking',
      description: 'Comprehensive travel booking platform with payment gateway.',
      image: '✈️',
      tags: ['Angular', 'Spring Boot', 'MySQL'],
      link: '#',
    },
  ];

  return (
    <Section id="portfolio" background="muted" padding="xl">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a look at some of our recent projects and see how we've helped 
            businesses achieve their digital goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => window.open(project.link, '_blank')}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                {project.image}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            View All Projects
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </Container>
    </Section>
  );
};
