import { useState } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { retreats } from "@/data/retreats";
import { Calendar } from "lucide-react";

const properties = [
  { key: "all", label: "All Properties" },
  { key: "amaala", label: "Amaala" },
  { key: "ibiza", label: "Ibiza" },
  { key: "bali", label: "Bali" },
];

const filters = [
  { key: "all", label: "View All" },
  { key: "location", label: "Location" },
  { key: "interest", label: "Interest" },
  { key: "new", label: "What's New" },
];

const RetreatFinder = () => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [activeProperty, setActiveProperty] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = retreats.filter((r) => {
    if (activeProperty !== "all" && r.property !== activeProperty) return false;
    if (activeFilter === "new" && !r.isNew) return false;
    return true;
  });

  return (
    <WireLayout>
      {/* Hero Banner */}
      <div className="relative">
        <WireImage className="h-[480px] w-full" label="Hero Image — Retreats" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Jayasom Retreats</p>
            <h1 className="text-4xl font-light text-foreground">Find Your Retreat</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4">Transformative wellness programmes across our global destinations.</p>
          </div>
        </div>
      </div>

      {/* Property Tabs */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto flex">
          {properties.map((p) => (
            <button
              key={p.key}
              onClick={() => { setActiveProperty(p.key); setActiveFilter("all"); }}
              className={`px-6 py-4 text-xs tracking-wider transition-colors relative ${activeProperty === p.key ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
            >
              {p.label}
              {activeProperty === p.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 pt-8 pb-4">
        <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 text-xs tracking-wider border transition-colors ${activeFilter === f.key ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Retreat Listing */}
      <WireSection title="Our Retreats">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((retreat) => (
            <Link
              to={retreat.type === "retreat" ? `/retreats/${retreat.id}` : "#"}
              key={retreat.id}
              className="border border-border group"
            >
              <div className="relative">
                <WireImage className="h-48" label={retreat.name} />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {retreat.type === "supplement" && (
                    <span className="bg-foreground text-background text-[10px] tracking-wider px-3 py-1 uppercase">Retreat Supplement</span>
                  )}
                  {retreat.isNew && (
                    <span className="bg-foreground text-background text-[10px] tracking-wider px-3 py-1 uppercase">New</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] tracking-wider text-muted-foreground uppercase">{retreat.property}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-[10px] tracking-wider text-muted-foreground uppercase">{retreat.interest}</span>
                </div>
                <h4 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{retreat.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{retreat.duration}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{retreat.shortDesc}</p>
                <span className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground inline-block">
                  {retreat.type === "retreat" ? "View retreat →" : "Learn more →"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">No retreats match your current filters.</p>
            <button onClick={() => { setActiveProperty("all"); setActiveFilter("all"); }} className="text-xs text-foreground underline mt-2">Clear filters</button>
          </div>
        )}
      </WireSection>

      {/* CTA — Speak to a Wellness Advisor */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-light mb-3 text-foreground">Not Sure Where to Start?</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">Our Wellness Advisors are here to listen. Share your story and we'll recommend the perfect retreat for you.</p>
          <button
            onClick={() => setShowScheduler(!showScheduler)}
            className="border-2 border-foreground px-8 py-4 text-sm tracking-wider text-foreground inline-flex items-center gap-3 hover:bg-foreground hover:text-background transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Speak to a Wellness Advisor
          </button>

          {showScheduler && (
            <div className="border border-border mt-8 max-w-md mx-auto p-6">
              <p className="text-xs font-bold text-foreground mb-4">Select a 15-Minute Consultation Slot</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["Mon 28", "Tue 29", "Wed 30"].map((day) => (
                  <div key={day} className="border border-border p-2 text-center">
                    <p className="text-xs text-foreground font-bold">{day}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45"].map((time) => (
                  <div key={time} className="border border-border px-2 py-2 text-xs text-muted-foreground text-center cursor-pointer hover:bg-foreground hover:text-background transition-colors">{time}</div>
                ))}
              </div>
              <div className="mt-4">
                <WireButton>Confirm Booking</WireButton>
              </div>
            </div>
          )}
        </div>
      </section>
    </WireLayout>
  );
};

export default RetreatFinder;
