import { useState } from "react";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const socialSpaces = [
  { name: "The Gathering Pavilion", desc: "A central open-air meeting point for community events, seasonal celebrations, and evening gatherings under the stars." },
  { name: "Resident's Lounge", desc: "An intimate indoor space for quiet socialising, reading, and afternoon tea — designed for unhurried connection." },
  { name: "Communal Garden Terrace", desc: "A landscaped terrace with dining areas, fire pits, and garden seating where neighbours become friends." },
  { name: "Wellness Social Club", desc: "A members-only space hosting weekly workshops, book clubs, guest speakers, and wellness-themed social evenings." },
];

const sharedAmenities = [
  "Infinity Pool & Sun Deck",
  "Organic Community Garden",
  "Outdoor Yoga Lawn",
  "Beach Access & Boardwalk",
  "Children's Nature Play Area",
  "Co-Working Studio",
  "Art & Ceramics Workshop",
  "Bicycle & E-Scooter Hub",
];

const ResidentialCommunity = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterOpen(false);
    setRegisterName("");
    setRegisterPhone("");
    setRegisterEmail("");
    setRegisterMessage("");
  };

  return (
  <WireLayout>
    <div className="relative">
      <WireImage className="h-[480px] w-full" label="Hero Image — Residential Community" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Live Well, Together</p>
          <h1 className="text-4xl font-light text-foreground">Residential Community</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4">A wellness-led community where like-minded residents share a commitment to balanced, purposeful living.</p>
        </div>
      </div>
    </div>

    {/* Community Social Spaces */}
    <WireSection title="Community Social Spaces" subtitle="Thoughtfully designed gathering places that bring residents together in meaningful ways — from casual morning coffees to curated evening events.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {socialSpaces.map((space) => (
          <div key={space.name} className="border border-border">
            <WireImage className="h-56" label={space.name} />
            <div className="p-5">
              <h4 className="text-sm font-bold mb-2 text-foreground">{space.name}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{space.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </WireSection>

    {/* Shared Amenities */}
    <WireSection title="Shared Amenities" subtitle="Every resident enjoys access to a curated collection of amenities designed to support an active, connected, and enriching lifestyle.">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {sharedAmenities.map((amenity) => (
          <div key={amenity} className="border border-border p-5 text-center">
            <WireImage className="h-24 mb-3" />
            <p className="text-xs text-foreground">{amenity}</p>
          </div>
        ))}
      </div>
    </WireSection>

    {/* Lifestyle Section */}
    <WireSection title="A Life Designed Around Wellness" subtitle="At Jayasom, community living extends beyond shared spaces. It's a shared philosophy — where daily rhythms, seasonal rituals, and mutual support create a truly integrated wellness lifestyle.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WireImage className="h-80" label="Community Morning Yoga" />
        <div className="flex flex-col justify-center">
          <h3 className="text-sm font-bold mb-3 text-foreground">Daily Community Rituals</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">Morning yoga on the communal lawn, sunset walks along the coastal promenade, and weekly farm-to-table dinners hosted in the garden terrace.</p>
          <h3 className="text-sm font-bold mb-3 text-foreground">Seasonal Celebrations</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">From harvest festivals to wellness retreats designed exclusively for residents, every season brings new opportunities for connection and growth.</p>
          <h3 className="text-sm font-bold mb-3 text-foreground">Wellness Concierge</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">A dedicated community concierge helps coordinate activities, book treatments, and arrange everything from grocery deliveries to private dining.</p>
        </div>
      </div>
    </WireSection>

    <WireSection dark title="Join Our Community" subtitle="Register your interest and be among the first to experience wellness-led community living at Amaala.">
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogTrigger asChild>
          <button className="border px-6 py-3 text-xs tracking-wider border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-colors">
            Register interest
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-light">Register Your Interest</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Share your details and our community team will be in touch with information on availability, events, and next steps.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Name</label>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Phone Number</label>
              <input
                type="tel"
                required
                value={registerPhone}
                onChange={(e) => setRegisterPhone(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Message</label>
              <textarea
                rows={3}
                value={registerMessage}
                onChange={(e) => setRegisterMessage(e.target.value)}
                placeholder="Tell us what you'd like to know…"
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full border border-foreground bg-foreground text-background px-6 py-3 text-xs tracking-wider hover:bg-background hover:text-foreground transition-colors"
            >
              Submit Registration
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </WireSection>
  </WireLayout>
  );
};

export default ResidentialCommunity;
