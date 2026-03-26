import { ImageIcon } from "lucide-react";

interface WireImageProps {
  className?: string;
  label?: string;
}

const WireImage = ({ className = "h-64", label }: WireImageProps) => (
  <div className={`bg-wire-placeholder border border-border flex items-center justify-center ${className}`}>
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <ImageIcon size={28} strokeWidth={1} />
      {label && <span className="text-xs">{label}</span>}
    </div>
  </div>
);

export default WireImage;
