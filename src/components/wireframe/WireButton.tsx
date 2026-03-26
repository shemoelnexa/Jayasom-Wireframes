interface WireButtonProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

const WireButton = ({ children, dark = false, className = "" }: WireButtonProps) => (
  <button className={`border px-6 py-3 text-xs tracking-wider ${dark ? "border-primary-foreground text-primary-foreground" : "border-foreground text-foreground"} ${className}`}>
    {children}
  </button>
);

export default WireButton;
