import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Github, Linkedin, Mail, Send, MapPin, Phone, Loader2, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";

// EmailJS Configuration - Environment variables must be prefixed with VITE_ in Vite
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const Contact = () => {
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "", // Spam protection - hidden field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check - if filled, it's likely a bot
    if (formData.honeypot) {
      toast.success("Message sent!"); // Fake success for bots
      return;
    }

    setIsLoading(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setIsSuccess(true);
      toast.success("Message sent! I'll get back to you soon.", {
        description: "Thank you for reaching out!",
      });
      setFormData({ name: "", email: "", subject: "", message: "", honeypot: "" });
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Failed to send message", {
        description: "Please try again or contact me directly via email.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="contact" className="py-32 px-4 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 gradient-accent"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-6xl md:text-7xl font-bold mb-8 font-display">
            Let's Work Together
          </h2>
          <div className="w-32 h-2 gradient-primary mx-auto rounded-full mb-8 shadow-glow"></div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together
          </p>
        </div>
        
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-slide-in-left">
              <h3 className="text-3xl font-bold mb-6">Get In Touch</h3>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                I'm always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, I'll get back to you as soon as possible!
              </p>
            </div>
            
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <a 
                href="mailto:mohammedghazal01@outlook.com"
                className="flex items-center gap-4 glass p-4 rounded-2xl hover:glass-strong transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-3 rounded-xl gradient-primary group-hover:shadow-glow transition-all">
                  <Mail className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold">mohammedghazal01@outlook.com</div>
                </div>
              </a>

              <a 
                href="tel:+966581026649"
                className="flex items-center gap-4 glass p-4 rounded-2xl hover:glass-strong transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-3 rounded-xl gradient-primary group-hover:shadow-glow transition-all">
                  <Phone className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-semibold">+966 58 102 6649</div>
                </div>
              </a>

              <div className="flex items-center gap-4 glass p-4 rounded-2xl group">
                <div className="p-3 rounded-xl gradient-primary transition-all">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">KSA, Madinah</div>
                </div>
              </div>
              
              <a 
                href="https://github.com/MohammedGhazal09"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass p-4 rounded-2xl hover:glass-strong transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-3 rounded-xl gradient-primary group-hover:shadow-glow transition-all">
                  <Github className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">GitHub</div>
                  <div className="font-semibold">@MohammedGhazal09</div>
                </div>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/mohammed-ghazal-784153231"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 glass p-4 rounded-2xl hover:glass-strong transition-all duration-300 hover:scale-105 group"
              >
                <div className="p-3 rounded-xl gradient-primary group-hover:shadow-glow transition-all">
                  <Linkedin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">LinkedIn</div>
                  <div className="font-semibold">Mohammed Hamzah Ghazal</div>
                </div>
              </a>
            </div>
          </div>
          
          <Card className="lg:col-span-3 glass p-8 border-0 animate-slide-in-right">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users, catches bots */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="absolute opacity-0 pointer-events-none h-0 w-0"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="text-sm font-semibold mb-2 block group-focus-within:text-primary transition-colors">Your Name</label>
                  <Input 
                    placeholder="Abdullah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    className="glass border-0 h-12 text-base focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  />
                </div>
                <div className="group">
                  <label className="text-sm font-semibold mb-2 block group-focus-within:text-primary transition-colors">Your Email</label>
                  <Input 
                    type="email"
                    placeholder="abdullah@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="glass border-0 h-12 text-base focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="text-sm font-semibold mb-2 block group-focus-within:text-primary transition-colors">Subject</label>
                <Input 
                  placeholder="Project Inquiry / Collaboration / General Question"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  disabled={isLoading}
                  className="glass border-0 h-12 text-base focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                />
              </div>
              
              <div className="group">
                <label className="text-sm font-semibold mb-2 block group-focus-within:text-primary transition-colors">Your Message</label>
                <Textarea 
                  placeholder="Tell me about your project..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={isLoading}
                  className="glass border-0 text-base resize-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 h-[300px]"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className={`w-full transition-all duration-300 text-lg h-14 ${
                  isSuccess 
                    ? 'bg-green-500 hover:bg-green-600 shadow-[0_0_30px_rgba(34,197,94,0.4)]' 
                    : 'gradient-primary hover:shadow-glow hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};
