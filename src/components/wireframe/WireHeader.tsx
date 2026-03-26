import { Link } from "react-router-dom";

const WireHeader = () => (
  <header className="border-b border-border px-8 py-5 flex items-center justify-between">
    <Link to="/" className="text-lg font-bold tracking-widest text-foreground">Jayasom</Link>
    <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
      <Link to="/wellbeing-spaces" className="hover:text-foreground transition-colors">Destinations</Link>
      <Link to="/retreat-finder" className="hover:text-foreground transition-colors">Retreats</Link>
      <Link to="/treatments" className="hover:text-foreground transition-colors">Wellness</Link>
      <Link to="/amaala-residences" className="hover:text-foreground transition-colors">Residences</Link>
      <Link to="/journals-stories" className="hover:text-foreground transition-colors">Insights</Link>
    </nav>
    <Link to="/retreat-finder" className="border border-foreground px-5 py-2 text-xs tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors">Book Now</Link>
  </header>
);

export default WireHeader;
