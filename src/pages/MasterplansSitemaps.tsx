import { useState } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import { MapPin, X } from "lucide-react";

const mapPins = [
  { id: 1, name: "Wellness Core", desc: "The heart of Jayasom — housing the Wellness Centre, treatment suites, hydrotherapy circuit, and meditation gardens.", top: "35%", left: "25%" },
  { id: 2, name: "Residential Quarter", desc: "Apartments, penthouses, and villas positioned to maximise sea views, privacy, and proximity to wellness amenities.", top: "20%", left: "55%" },
  { id: 3, name: "Coastal Promenade", desc: "A linear walking route connecting the wellness core to communal spaces, beach access, and dining venues.", top: "65%", left: "40%" },
  { id: 4, name: "Organic Farm & Gardens", desc: "On-site organic gardens supplying fresh produce to Jayasom's kitchens and hosting educational wellness experiences.", top: "50%", left: "70%" },
  { id: 5, name: "Beach Club", desc: "A serene beachfront social hub with infinity pool, day beds, and light dining options.", top: "75%", left: "60%" },
  { id: 6, name: "Arrival Pavilion", desc: "The welcoming gateway to Jayasom featuring concierge services, orientation, and guest lounge.", top: "15%", left: "35%" },
];

const MasterplansSitemaps = () => {
  const [activePin, setActivePin] = useState<number | null>(null);

  return (
    <WireLayout>
      <WireSection title="Masterplans & Sitemaps" subtitle="Explore the carefully planned layout of Jayasom Amaala — from the wellness core to the coastal residences and communal spaces." />

      {/* Interactive Map Component */}
      <section className="px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border relative" style={{ minHeight: 500 }}>
            <WireImage className="h-[500px] w-full" label="Interactive Masterplan Map — Jayasom Amaala" />
            {/* Clickable Pins */}
            {mapPins.map((pin) => (
              <button
                key={pin.id}
                onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
                className="absolute z-10 group"
                style={{ top: pin.top, left: pin.left }}
                title={pin.name}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${activePin === pin.id ? "bg-foreground border-foreground" : "bg-background border-foreground"}`}>
                  <MapPin className={`w-4 h-4 ${activePin === pin.id ? "text-background" : "text-foreground"}`} />
                </div>
                {/* Tooltip */}
                {activePin === pin.id && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 border border-border bg-background p-4 text-left shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-foreground">{pin.name}</p>
                      <button onClick={(e) => { e.stopPropagation(); setActivePin(null); }}>
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{pin.desc}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">Click on any pin to view area details</p>
        </div>
      </section>

      <WireSection title="Key Areas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mapPins.slice(0, 4).map((item) => (
            <div key={item.name} className="border border-border">
              <WireImage className="h-48" label={`Site Plan — ${item.name}`} />
              <div className="p-5">
                <h4 className="text-sm font-bold mb-2 text-foreground">{item.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </WireSection>

      <div className="text-center py-12">
        <Link to="/digital-brochure" className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors">View digital brochure</Link>
      </div>
    </WireLayout>
  );
};

export default MasterplansSitemaps;
