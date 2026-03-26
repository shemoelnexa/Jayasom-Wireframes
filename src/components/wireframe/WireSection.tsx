import { ReactNode } from "react";

interface WireSectionProps {
  label?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  dark?: boolean;
}

const WireSection = ({ label, title, subtitle, children, className = "", dark = false }: WireSectionProps) => (
  <section className={`px-8 py-16 ${dark ? "bg-foreground text-primary-foreground" : ""} ${className}`}>
    <div className="max-w-6xl mx-auto">
      {label && <p className={`text-xs tracking-widest uppercase mb-3 ${dark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{label}</p>}
      <h2 className={`text-2xl md:text-3xl font-light mb-4 ${dark ? "text-primary-foreground" : "text-foreground"}`}>{title}</h2>
      {subtitle && <p className={`text-sm leading-relaxed max-w-2xl mb-8 ${dark ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default WireSection;
