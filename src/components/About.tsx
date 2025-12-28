export const About = () => {
  return (
    <section id="about" className="py-32 px-4 relative">
      {/* Animated background orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float gradient-primary"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 font-display">
            About Me
          </h2>
          <div className="w-32 h-2 gradient-primary mx-auto rounded-full mb-12 shadow-glow"></div>
        </div>
        
        <div className="glass p-12 rounded-3xl backdrop-blur-xl border-0 shadow-elegant-lg animate-scale-in">
          <p className="text-2xl md:text-3xl font-light leading-relaxed text-center mb-8">
            I'm a passionate <span className="text-gradient font-bold">Full-Stack MERN Developer</span> experienced in building scalable, high-performance web applications.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto mb-8">
            Skilled in modern UI/UX design, RESTful API integration, responsive design, and web accessibility. 
            Committed to writing clean, maintainable code and continuously learning emerging technologies.
          </p>
          <div className="border-t border-border/50 pt-8 mt-8">
            <h3 className="text-2xl font-bold text-center mb-4 text-gradient">Education</h3>
            <div className="text-center">
              <p className="text-xl font-semibold">Bachelor of Computer Science</p>
              <p className="text-lg text-muted-foreground">Faculty of Computer Science, Islamic University, Madinah</p>
              <p className="text-muted-foreground">2023 – 2028</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
