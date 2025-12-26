import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Upload, 
  Play, 
  Users, 
  Lock, 
  Zap, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Dashboard from './Dashboard';

const features = [
  {
    icon: Upload,
    title: 'Smart Upload',
    description: 'Drag & drop video files with real-time progress tracking and validation',
  },
  {
    icon: Shield,
    title: 'Content Analysis',
    description: 'AI-powered sensitivity detection with safe/flagged classification',
  },
  {
    icon: Play,
    title: 'Secure Streaming',
    description: 'HTTP range request support for seamless video playback',
  },
  {
    icon: Users,
    title: 'Multi-Tenant',
    description: 'Complete user isolation with role-based access control',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'JWT authentication and encrypted data storage',
  },
  {
    icon: Zap,
    title: 'Real-Time Updates',
    description: 'Socket.io powered live processing status updates',
  },
];

export default function Index() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge variant="glass" className="animate-fade-in px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Enterprise-Grade Video Security
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Secure Video
            <br />
            <span className="gradient-text">Processing Platform</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Upload, analyze, and stream videos with AI-powered content sensitivity detection and real-time processing updates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => setShowDashboard(true)}
            >
              Launch Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="xl">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {['Role-Based Access', 'Real-Time Updates', 'Multi-Tenant'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive solution for secure video management with enterprise-grade features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass glass-hover rounded-2xl p-6 group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:glow transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Experience the power of secure video processing with our intuitive dashboard.
            </p>
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => setShowDashboard(true)}
            >
              Open Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">VidSecure</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Video Upload, Sensitivity Processing & Streaming Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
