import { Link } from "react-router-dom";

const WireFooter = () => (
  <footer className="border-t border-border mt-20 px-8 py-12">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
        <div>
          <p className="font-bold text-sm tracking-widest mb-4 text-foreground">Jayasom</p>
          <p className="text-xs text-muted-foreground leading-relaxed">Healing rooted in wisdom, guided by heart.</p>
        </div>
        <div>
          <p className="text-xs font-bold mb-3 text-foreground">Quick Links</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/wellbeing-spaces" className="hover:underline">Wellbeing Spaces</Link></li>
            <li><Link to="/rooms-villas" className="hover:underline">Rooms & Villas</Link></li>
            <li><Link to="/culinary-nourishment" className="hover:underline">Culinary Nourishment</Link></li>
            <li><Link to="/retreat-finder" className="hover:underline">Retreat Finder</Link></li>
            <li><Link to="/treatments" className="hover:underline">Treatments</Link></li>
            <li><Link to="/journals-stories" className="hover:underline">Journals & Stories</Link></li>
            <li><Link to="/amaala-residences" className="hover:underline">Residences</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold mb-3 text-foreground">About</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li>Our Philosophy</li>
            <li>Sustainability</li>
            <li>Careers</li>
            <li>Media</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold mb-3 text-foreground">Wellness</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/retreat-finder" className="hover:underline">Retreats</Link></li>
            <li><Link to="/wellbeing-spaces" className="hover:underline">Wellbeing Spaces</Link></li>
            <li><Link to="/culinary-nourishment" className="hover:underline">Culinary Nourishment</Link></li>
            <li><Link to="/families-wellbeing" className="hover:underline">Families & Wellbeing</Link></li>
            <li><Link to="/wellness-advisor" className="hover:underline">Our Experts</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold mb-3 text-foreground">Residences</p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/amaala-residences" className="hover:underline">Amaala Residences</Link></li>
            <li><Link to="/why-jayasom-residences" className="hover:underline">Why Jayasom Residences</Link></li>
            <li><Link to="/residential-community" className="hover:underline">Residential Community</Link></li>
            {/* REMOVED: Masterplans footer link — page removed. Uncomment to restore. */}
            {/* <li><Link to="/masterplans-sitemaps" className="hover:underline">Masterplans</Link></li> */}
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground">© 2026 Jayasom PTE Ltd. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground mt-4 md:mt-0">
          <span>Cookies Policy</span>
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
        </div>
      </div>
    </div>
  </footer>
);

export default WireFooter;
