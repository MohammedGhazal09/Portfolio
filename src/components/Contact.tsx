import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Send, MapPin, Phone, Loader2, CheckCircle, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { gsap, SplitText } from "../lib/gsap";
import { useMagnetic } from "../lib/magnetic";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

type Channel = {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
};

const CHANNELS: Channel[] = [
  {
    icon: Mail,
    label: "Email",
    value: "mohammedghazal01@outlook.com",
    href: "mailto:mohammedghazal01@outlook.com",
  },
  { icon: Phone, label: "Phone", value: "+966 58 102 6649", href: "tel:+966581026649" },
  { icon: MapPin, label: "Location", value: "Madinah · GMT+3" },
  {
    icon: Github,
    label: "GitHub",
    value: "@MohammedGhazal09",
    href: "https://github.com/MohammedGhazal09",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Mohammed Hamzah Ghazal",
    href: "https://www.linkedin.com/in/mohammed-ghazal-784153231",
  },
];

/** Floating-label input with subtle gradient underline on focus. */
const Field = ({
  label,
  type = "text",
  value,
  onChange,
  required,
  disabled,
  textarea,
  rows = 5,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  rows?: number;
}) => {
  const id = `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const Element = textarea ? "textarea" : "input";
  return (
    <label htmlFor={id} className="block group relative">
      <span className="absolute left-0 -top-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
        {label}
      </span>
      <Element
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        rows={textarea ? rows : undefined}
        className="w-full bg-transparent border-0 border-b border-foreground/20 pt-7 pb-3 text-base md:text-lg outline-none focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/40"
        placeholder={textarea ? "Tell me about your project, timeline, and what success looks like…" : ""}
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 gradient-primary"
      />
    </label>
  );
};

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitRef = useMagnetic<HTMLButtonElement>(20);

  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current, { type: "words,chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.012,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6,
        },
      });
      gsap.from(".contact-channel", {
        x: -30,
        opacity: 0,
        stagger: 0.06,
        ease: "power3.out",
        duration: 0.7,
        scrollTrigger: { trigger: ".contact-channels", start: "top 85%" },
      });
      gsap.from(".contact-field", {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: "power3.out",
        duration: 0.7,
        scrollTrigger: { trigger: formRef.current, start: "top 85%" },
      });
      return () => split.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.honeypot) {
      // Bot trap — fake success
      toast.success("Message sent!");
      return;
    }
    setLoading(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setSuccess(true);
      toast.success("Message sent! I'll get back to you soon.", {
        description: "Thank you for reaching out.",
      });
      setData({ name: "", email: "", subject: "", message: "", honeypot: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      toast.error("Failed to send message", {
        description: "Please try again or email me directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-32 md:py-48 px-6 md:px-10 overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-3xl opacity-20 gradient-accent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span className="h-px w-12 bg-foreground/30" />
          <span>05 — Get in touch</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] max-w-[12ch]"
        >
          Have a brief? <span className="text-gradient">Send it.</span>
        </h2>

        <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
          Whether it's a question, a collaboration, or a fully-scoped project — I read
          every message and reply within a day.
        </p>

        <div className="mt-20 grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Channels */}
          <div className="contact-channels lg:col-span-4 space-y-2">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Channels
            </div>
            {CHANNELS.map(({ icon: Icon, label, value, href }) => {
              const Wrapper: React.ElementType = href ? "a" : "div";
              return (
                <Wrapper
                  key={label}
                  {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" } : {})}
                  data-cursor={href ? "hover" : undefined}
                  className={`contact-channel group flex items-start gap-4 py-4 border-b border-foreground/10 ${
                    href ? "hover:border-primary/40 transition-colors" : ""
                  }`}
                >
                  <span className="grid place-items-center h-10 w-10 rounded-full bg-foreground/5 border border-foreground/10 flex-shrink-0 group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                      {label}
                    </div>
                    <div className="text-sm md:text-base font-medium truncate">{value}</div>
                  </div>
                  {href && (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                  )}
                </Wrapper>
              );
            })}
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="lg:col-span-8 space-y-10"
            noValidate
          >
            {/* Honeypot */}
            <input
              type="text"
              name="honeypot"
              value={data.honeypot}
              onChange={(e) => setData({ ...data, honeypot: e.target.value })}
              className="absolute opacity-0 pointer-events-none h-0 w-0"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="contact-field grid md:grid-cols-2 gap-10">
              <Field
                label="Name"
                value={data.name}
                onChange={(v) => setData({ ...data, name: v })}
                required
                disabled={isLoading}
              />
              <Field
                label="Email"
                type="email"
                value={data.email}
                onChange={(v) => setData({ ...data, email: v })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="contact-field">
              <Field
                label="Subject"
                value={data.subject}
                onChange={(v) => setData({ ...data, subject: v })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="contact-field">
              <Field
                label="Message"
                value={data.message}
                onChange={(v) => setData({ ...data, message: v })}
                required
                disabled={isLoading}
                textarea
                rows={6}
              />
            </div>

            <div className="contact-field flex items-center justify-between gap-6 pt-4">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-[0.2em]">
                Avg response · 24h
              </span>
              <button
                ref={submitRef}
                type="submit"
                disabled={isLoading}
                data-cursor="hover"
                className={`relative inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] overflow-hidden transition-all ${
                  isSuccess
                    ? "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
                } disabled:opacity-60`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Sent
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
