import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Chatify",
    description: "A real-time chat application built with the MERN stack, featuring user authentication, real-time messaging with Socket.io, and a modern responsive UI. Implements JWT-based security and MongoDB for data persistence.",
    demo: "https://chatify-ten-rho.vercel.app/",
    github: "https://github.com/MohammedGhazal09/Chatify",
  },
  {
    title: "PLASHOE E-Commerce",
    description: "A full-stack e-commerce platform for shoes with user authentication, shopping cart functionality, payment integration, and admin dashboard for inventory management. Built with React, Node.js, Express, and MongoDB.",
    demo: "https://ecommerce-theta-lemon.vercel.app",
    github: "https://github.com/MohammedGhazal09/PLASHOE",
  },
];

export const Projects = () => {
  return (
    <section id="projects" className="py-32 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 font-display">
            Featured Projects
          </h2>
          <div className="w-32 h-2 gradient-primary mx-auto rounded-full mb-8 shadow-glow"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and passion projects
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="glass transition-all duration-300 group overflow-hidden border-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-4 pt-8">
                <CardTitle className="text-4xl text-gradient mb-4">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 glass hover:scale-105 transition-all duration-300 group/btn border-0"
                    asChild
                  >
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5 group-hover/btn:rotate-45 transition-transform" />
                      Live Demo
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 glass hover:scale-105 transition-all duration-300 group/btn border-0"
                    asChild
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                      Source
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
