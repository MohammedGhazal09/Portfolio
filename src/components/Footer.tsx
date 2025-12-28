export const Footer = () => {
  return (
    <footer className="py-16 px-4 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 gradient-primary"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center space-y-6">
          <div className="text-4xl font-bold text-gradient font-display">Mohammed Hamzah Ghazal</div>
          <div className="w-24 h-1 gradient-primary mx-auto rounded-full opacity-50"></div>
          <p className="text-muted-foreground text-lg">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground/60">
            Crafted with passion and precision ✨
          </p>
        </div>
      </div>
    </footer>
  );
};
