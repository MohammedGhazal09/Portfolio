import { Badge } from "./ui/badge";

const skillCategories = [
  {
    title: "Front-End Development",
    skills: [
      "HTML", "CSS", "Tailwind CSS", "JavaScript (ES6+)", "DOM Manipulation", 
      "Event Handling", "Async/Await", "Fetch API", "Responsive Design", 
      "Styled Components", "React.js", "Context API"
    ]
  },
  {
    title: "Back-End Development",
    skills: [
      "Node.js", "Express.js", "RESTful APIs", "HTTP Protocol", 
      "MongoDB", "JWT Authentication", "Cookies", "Mongoose"
    ]
  },
  {
    title: "Development Tools",
    skills: ["Git", "GitHub", "Webpack", "Vite"]
  },
  {
    title: "Advanced Skills",
    skills: ["Performance Optimization", "Web Accessibility", "Advanced State Management"]
  }
];

const softSkills = [
  "Problem Solving", "UI/UX Design", "Effective Communication", 
  "Teamwork", "Time Management", "Agile Methodologies"
];

export const Skills = () => {
  return (
    <section id="skills" className="py-32 px-4 relative">
      {/* Background gradient orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-3xl opacity-10 gradient-hero"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 font-display">
            Skills & Technologies
          </h2>
          <div className="w-32 h-2 gradient-primary mx-auto rounded-full mb-8 shadow-glow"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leveraging cutting-edge technologies to build exceptional web experiences
          </p>
        </div>
        
        <div className="glass p-12 rounded-3xl backdrop-blur-xl border-0 shadow-elegant-lg animate-scale-in space-y-10">
          {skillCategories.map((category, catIndex) => (
            <div key={category.title} className="space-y-4">
              <h3 className="text-2xl font-bold text-gradient text-center">{category.title}</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {category.skills.map((skill, index) => (
                  <Badge 
                    key={skill} 
                    variant="secondary"
                    className="text-base px-6 py-3 glass hover:glass-strong hover:scale-110 hover:shadow-glow transition-all duration-300 cursor-default font-medium"
                    style={{ animationDelay: `${(catIndex * 5 + index) * 0.05}s` }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {catIndex < skillCategories.length - 1 && (
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto mt-8"></div>
              )}
            </div>
          ))}
        </div>

        {/* Soft Skills Section */}
        <div className="mt-12 glass p-12 rounded-3xl backdrop-blur-xl border-0 shadow-elegant-lg animate-scale-in">
          <h3 className="text-3xl font-bold text-gradient text-center mb-8">Soft Skills</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {softSkills.map((skill, index) => (
              <Badge 
                key={skill} 
                variant="outline"
                className="text-base px-6 py-3 glass hover:glass-strong hover:scale-110 hover:shadow-glow transition-all duration-300 cursor-default font-medium border-primary/30"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
