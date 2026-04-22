import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import { retreats } from "@/data/retreats";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Calendar, CalendarIcon } from "lucide-react";

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
  const [activeProperty, setActiveProperty] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadProperty, setLeadProperty] = useState("");
  const [leadInterest, setLeadInterest] = useState("");
  const [leadDate, setLeadDate] = useState<Date | undefined>(undefined);
  const [leadMessage, setLeadMessage] = useState("");

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadOpen(false);
    setLeadName("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadProperty("");
    setLeadInterest("");
    setLeadDate(undefined);
    setLeadMessage("");
  };

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
              // REMOVED-PAGE-LINK: was `/retreats/${retreat.id}` — now points to V2. To restore original, change `/retreats-v2/` back to `/retreats/`.
              to={retreat.type === "retreat" ? `/retreats-v2/${retreat.id}` : "#"}
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
          <Dialog open={leadOpen} onOpenChange={setLeadOpen}>
            <DialogTrigger asChild>
              <button className="border-2 border-foreground px-8 py-4 text-sm tracking-wider text-foreground inline-flex items-center gap-3 hover:bg-foreground hover:text-background transition-colors">
                <Calendar className="w-4 h-4" />
                Speak to a Wellness Advisor
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-light">Speak to a Wellness Advisor</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Share your details and a Wellness Advisor will be in touch to help you find the right retreat.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLeadSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Name</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Preferred Property</label>
                  <select
                    required
                    value={leadProperty}
                    onChange={(e) => setLeadProperty(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  >
                    <option value="" disabled>Select a property</option>
                    <option value="amaala">Amaala</option>
                    <option value="ibiza">Ibiza</option>
                    <option value="bali">Bali</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Wellness Interest</label>
                  <select
                    required
                    value={leadInterest}
                    onChange={(e) => setLeadInterest(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  >
                    <option value="" disabled>Select an interest</option>
                    <option value="detox">Detox</option>
                    <option value="longevity">Longevity</option>
                    <option value="sleep">Sleep</option>
                    <option value="fitness">Fitness</option>
                    <option value="mental-fitness">Mental Fitness</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Preferred Dates</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground flex items-center justify-between focus:outline-none"
                      >
                        <span className={leadDate ? "text-foreground" : "text-muted-foreground"}>
                          {leadDate ? format(leadDate, "PPP") : "Pick a date"}
                        </span>
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        mode="single"
                        selected={leadDate}
                        onSelect={setLeadDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Message</label>
                  <textarea
                    rows={3}
                    value={leadMessage}
                    onChange={(e) => setLeadMessage(e.target.value)}
                    placeholder="Share a bit about what you're looking for…"
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full border border-foreground bg-foreground text-background px-6 py-3 text-xs tracking-wider hover:bg-background hover:text-foreground transition-colors"
                >
                  Request a Call
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </WireLayout>
  );
};

export default RetreatFinder;
