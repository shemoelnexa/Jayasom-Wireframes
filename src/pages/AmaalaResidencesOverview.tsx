import { useState } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { residences } from "@/data/residences";

const AmaalaResidencesOverview = () => {
  const [viewingOpen, setViewingOpen] = useState(false);
  const [viewingName, setViewingName] = useState("");
  const [viewingPhone, setViewingPhone] = useState("");
  const [viewingEmail, setViewingEmail] = useState("");
  const [viewingMessage, setViewingMessage] = useState("");

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViewingOpen(false);
    setViewingName("");
    setViewingPhone("");
    setViewingEmail("");
    setViewingMessage("");
  };

  return (
  <WireLayout>
    <div className="relative">
      <WireImage className="h-[500px] w-full" label="Hero Image — Amaala Residences" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Jayasom Residences</p>
          <h1 className="text-4xl font-light text-foreground">Amaala Residences</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4">Each wellness residence at Jayasom is a sanctuary wholly conceived to inspire and curate genuine well-being at every age.</p>
        </div>
      </div>
    </div>

    <WireSection label="Welcome" title="Your Wellness Home" subtitle="Amaala Residences represent a new paradigm in wellness living — where architecture, nature, and holistic health converge to create homes that nurture every aspect of your wellbeing. This is more than a residence; it is a lifetime commitment to living well.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <WireImage className="h-72" label="Residence Lifestyle — Exterior" />
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-bold mb-3 text-foreground">A Destination for Living</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">Set along the pristine Red Sea coast at Amaala, Jayasom residences offer direct access to world-class wellness facilities, organic dining, and a vibrant community of like-minded individuals committed to purposeful living.</p>
          <h3 className="text-sm font-bold mb-3 text-foreground">Wellness by Design</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Every residence is designed with biophilic principles, circadian lighting, air and water purification systems, and dedicated wellness spaces — ensuring your home supports your health 24 hours a day.</p>
        </div>
      </div>
    </WireSection>

    <WireSection label="The Collection" title="Residence Types" subtitle="A carefully curated selection of homes ranging from intimate apartments to expansive beachfront villas, each designed with wellness at its core.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {residences.map((res) => (
          <Link to={`/amaala-residences/${res.id}`} key={res.id} className="border border-border group">
            <WireImage className="h-56" label={res.name} />
            <div className="p-5">
              <h4 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{res.name}</h4>
              <p className="text-xs text-muted-foreground mb-1">{res.size}</p>
              <p className="text-xs text-muted-foreground mb-4">{res.priceFrom}</p>
              <WireButton>View details →</WireButton>
            </div>
          </Link>
        ))}
      </div>
    </WireSection>

    {/* Generic Representative Layout */}
    <WireSection title="Floor Plans — Generic Representative Layout">
      <div className="border border-border p-8">
        <WireImage className="h-80" label="Generic Representative Layout" />
        <p className="text-xs text-muted-foreground mt-4 text-center italic">This is a generic representative layout for illustrative purposes.</p>
      </div>
      <div className="border-2 border-destructive bg-destructive/10 p-5 mt-6">
        <p className="text-sm font-bold text-destructive mb-1">Important Disclaimer</p>
        <p className="text-xs text-foreground leading-relaxed">This layout is for illustrative purposes only and does not constitute a legal commitment. Final unit configurations are subject to change.</p>
      </div>
    </WireSection>

    <WireSection title="Design & Architecture" subtitle="Designed by world-renowned architects, Jayasom residences blend seamlessly with the natural coastal landscape. Sustainable materials, biophilic principles, and panoramic views define every home.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WireImage className="h-72" label="Architectural Render — Exterior" />
        <WireImage className="h-72" label="Architectural Render — Interior" />
      </div>
    </WireSection>

    <WireSection dark title="Request a Private Viewing" subtitle="Our sales team can arrange a personalised presentation and virtual tour of available residences.">
      <Dialog open={viewingOpen} onOpenChange={setViewingOpen}>
        <DialogTrigger asChild>
          <button className="border px-6 py-3 text-xs tracking-wider border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-colors">
            Schedule a viewing
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-light">Schedule a Private Viewing</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Share your details and our sales team will be in touch to arrange a personalised presentation and tour.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleViewingSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Name</label>
              <input
                type="text"
                required
                value={viewingName}
                onChange={(e) => setViewingName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Phone Number</label>
              <input
                type="tel"
                required
                value={viewingPhone}
                onChange={(e) => setViewingPhone(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={viewingEmail}
                onChange={(e) => setViewingEmail(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Message</label>
              <textarea
                rows={3}
                value={viewingMessage}
                onChange={(e) => setViewingMessage(e.target.value)}
                placeholder="Tell us what you'd like to know…"
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full border border-foreground bg-foreground text-background px-6 py-3 text-xs tracking-wider hover:bg-background hover:text-foreground transition-colors"
            >
              Request Viewing
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </WireSection>

    <WireSection title="Location" subtitle="Situated at the southern wellness core of Amaala's Triple Bay, Jayasom residences offer direct access to pristine beaches, coral reefs, and desert landscapes.">
      <WireImage className="h-80" label="Location Map" />
    </WireSection>
  </WireLayout>
  );
};

export default AmaalaResidencesOverview;
