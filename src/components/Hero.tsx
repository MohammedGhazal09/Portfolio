import { lazy, Suspense } from "react";
import { Button } from "./ui/button";
import { Mail, Sparkles } from "lucide-react";

// Lazy load 3D component for better initial load performance
const HeroModel = lazy(() => import("./HeroModel").then(module => ({ default: module.HeroModel })));

// Loading fallback for 3D model
const ModelFallback = () => (
  <div className="w-full h-full min-h-[50vh] lg:min-h-[80vh] flex items-center justify-center">
    <div className="glass p-8 rounded-2xl">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  </div>
);

export const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 py-20 lg:py-0">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 gradient-mesh opacity-50"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float"
           style={{ background: 'linear-gradient(135deg, hsl(210 100% 50%), hsl(280 100% 65%))' }}>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 animate-float"
           style={{ animationDelay: '2s', background: 'linear-gradient(135deg, hsl(195 100% 50%), hsl(260 100% 70%))' }}>
      </div>
      
      {/* Main content - Split layout */}
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in-up space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Available for new projects</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight font-display">
              <span className="block mb-2 lg:mb-4">Mohammed</span>
              <span className="text-gradient">Ghazal</span>
            </h1>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-muted-foreground">
              Full-Stack MERN Developer
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Full-Stack MERN developer experienced in building scalable, high-performance web applications. 
              Skilled in modern UI/UX design, RESTful API integration, responsive design, and web accessibility.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14"
              >
                <Mail className="mr-2 h-5 w-5" />
                Let's Connect
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={scrollToProjects}
                className="glass-strong transition-all duration-300 hover:scale-105 text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 border-2"
              >
                View Work
              </Button>
            </div>
          </div>
          
          {/* Right side - 3D Model */}
          <div className="flex-1 w-full lg:w-1/2 h-[50vh] lg:h-[80vh]">
            <Suspense fallback={<ModelFallback />}>
              <HeroModel />
            </Suspense>
          </div>
          
        </div>
      </div>
    </section>
  );
};
