import { useState } from "react";
import { Link } from "react-router-dom";
import { Baby, CalendarIcon, Headphones, Minus, Plus, User, Users } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const tabs = ["Kids", "Teens", "Adults", "Family"] as const;
type Tab = (typeof tabs)[number];

const tabContent: Record<Tab, {
  wellness: { title: string; subtitle: string; items: { heading: string; text: string }[]; image: string };
  packages: { name: string; duration: string; desc: string }[];
  cta: { title: string; subtitle: string; button: string };
}> = {
  Kids: {
    wellness: {
      title: "Adventures for Little Explorers",
      subtitle: "Designed for ages 4–12, our children's programme nurtures curiosity through nature, movement, and creativity in a safe, joyful environment.",
      items: [
        { heading: "Nature Discovery", text: "Guided nature walks, bug hunts, and botanical crafts that spark wonder and a love for the natural world." },
        { heading: "Creative Arts", text: "Painting, pottery, storytelling, and music sessions designed to encourage self-expression and imagination." },
        { heading: "Gentle Movement", text: "Kid-friendly yoga, dance, and balance activities that build body awareness through playful movement." },
      ],
      image: "Children Playing in Nature",
    },
    packages: [
      { name: "Little Explorer Retreat", duration: "4 Nights", desc: "A nature-focused adventure with daily outdoor activities, arts and crafts, and gentle mindfulness for children." },
      { name: "Creative Kids Camp", duration: "5 Nights", desc: "An immersive arts and expression programme combining visual arts, music, dance, and storytelling." },
      { name: "Junior Wellness Journey", duration: "3 Nights", desc: "An introduction to wellbeing through fun movement, healthy eating workshops, and nature connection." },
    ],
    cta: { title: "Give Your Kids a Magical Experience", subtitle: "Our children's programmes are led by certified child development specialists in a safe, nurturing setting.", button: "Explore kids' programmes" },
  },
  Teens: {
    wellness: {
      title: "Empowering Teen Wellness",
      subtitle: "Active adventures, digital detox, and confidence-building experiences for guests aged 13–17 — designed to engage, challenge, and inspire.",
      items: [
        { heading: "Adventure & Sport", text: "Surfing, rock climbing, kayaking, and trail runs that build resilience and teamwork in nature." },
        { heading: "Digital Detox", text: "Structured screen-free experiences including journaling, photography with film cameras, and outdoor skill-building." },
        { heading: "Confidence Building", text: "Workshops on public speaking, leadership, and self-awareness led by experienced youth mentors." },
      ],
      image: "Teens on an Outdoor Adventure",
    },
    packages: [
      { name: "Teen Adventure Week", duration: "5 Nights", desc: "High-energy outdoor activities combined with mindfulness sessions and social connection experiences." },
      { name: "Digital Detox Retreat", duration: "4 Nights", desc: "A screen-free immersion focused on creativity, nature, and building real-world skills and friendships." },
      { name: "Young Leaders Programme", duration: "6 Nights", desc: "Leadership, teamwork, and personal growth through adventure challenges and reflective workshops." },
    ],
    cta: { title: "Inspire Your Teen's Growth", subtitle: "Our teen programmes are designed by youth development experts to be genuinely engaging — no eye-rolls guaranteed.", button: "Explore teen programmes" },
  },
  Adults: {
    wellness: {
      title: "Wellness for the Individual",
      subtitle: "Reconnect with yourself through personalised wellness journeys that restore balance, clarity, and vitality.",
      items: [
        { heading: "Mindfulness & Meditation", text: "Guided meditation, breathwork, and mindfulness practices tailored to your experience level and personal goals." },
        { heading: "Body & Movement", text: "Personalised fitness, yoga, Pilates, and aquatic therapy sessions designed around your body's unique needs." },
        { heading: "Restorative Therapies", text: "Spa treatments, sound healing, and holistic therapies that address both physical tension and emotional wellbeing." },
      ],
      image: "Adult Enjoying a Spa Treatment",
    },
    packages: [
      { name: "The Personal Reset", duration: "5 Nights", desc: "A comprehensive individual wellness retreat with daily spa treatments, fitness sessions, and nutritional guidance." },
      { name: "Mindful Escape", duration: "3 Nights", desc: "A focused weekend of meditation, silence, and reflection for those seeking mental clarity and calm." },
      { name: "Active Vitality", duration: "7 Nights", desc: "An energising programme combining outdoor fitness, healthy cuisine, and recovery therapies." },
    ],
    cta: { title: "Your Wellbeing Journey Begins Here", subtitle: "Every programme is personalised by our wellness advisors to match your goals, preferences, and pace.", button: "Plan your personal retreat" },
  },
  Family: {
    wellness: {
      title: "Wellness for Every Generation",
      subtitle: "From toddlers to grandparents, our family programmes are designed to honour each individual's needs while creating shared moments of joy and connection.",
      items: [
        { heading: "Children's Programme", text: "Nature exploration, creative arts, gentle movement, and mindfulness activities designed specifically for young guests aged 4–12." },
        { heading: "Teen Wellness", text: "Active adventures, digital detox workshops, and confidence-building activities for guests aged 13–17." },
        { heading: "Shared Family Rituals", text: "Sunset yoga, family cooking classes, stargazing, and guided nature walks — experiences designed to be enjoyed together." },
      ],
      image: "Family at the Beach",
    },
    packages: [
      { name: "The Family Reset", duration: "5 Nights", desc: "A balanced retreat combining shared activities with individual wellness time for parents." },
      { name: "Generations Together", duration: "7 Nights", desc: "A multi-generational programme honouring the unique needs of each family member." },
      { name: "Active Family Adventure", duration: "4 Nights", desc: "Outdoor exploration, water sports, and nature-based activities for the adventurous family." },
    ],
    cta: { title: "Family Wellbeing Starts Here", subtitle: "Let us help you design the perfect family retreat. Our advisors understand that every family is unique.", button: "Plan your family retreat" },
  },
};

const tabIcons: Record<Tab, React.ReactNode> = {
  Kids: <Baby className="w-4 h-4" />,
  Teens: <Headphones className="w-4 h-4" />,
  Adults: <User className="w-4 h-4" />,
  Family: <Users className="w-4 h-4" />,
};

const FamiliesWellbeing = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Family");
  const content = tabContent[activeTab];

  const [planOpen, setPlanOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planPhone, setPlanPhone] = useState("");
  const [planEmail, setPlanEmail] = useState("");
  const [planAdults, setPlanAdults] = useState(2);
  const [planChildren, setPlanChildren] = useState(0);
  const [planRange, setPlanRange] = useState<DateRange | undefined>(undefined);

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlanOpen(false);
    setPlanName("");
    setPlanPhone("");
    setPlanEmail("");
    setPlanAdults(2);
    setPlanChildren(0);
    setPlanRange(undefined);
  };

  const rangeLabel = planRange?.from
    ? planRange.to
      ? `${format(planRange.from, "LLL d, y")} — ${format(planRange.to, "LLL d, y")}`
      : format(planRange.from, "LLL d, y")
    : "Pick a date range";

  return (
    <WireLayout>
      <div className="relative">
        <WireImage className="h-[480px] w-full" label="Hero Image — Families & Shared Wellbeing" />
        <div className="absolute inset-0 flex items-end pb-16 px-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">Together</p>
            <h1 className="text-4xl font-light text-foreground">Families & Shared Wellbeing</h1>
            <p className="text-sm text-muted-foreground max-w-lg mt-3">Wellbeing is felt most deeply when shared. Jayasom creates meaningful experiences for families to reconnect, play, and grow together.</p>
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="px-8 pt-6 -mb-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="inline-flex rounded-full bg-muted p-1.5 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wide transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-background text-foreground shadow-md font-medium scale-100"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50 hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                {tabIcons[tab]}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div key={activeTab} className="animate-fade-in-up">
        <WireSection title={content.wellness.title} subtitle={content.wellness.subtitle}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {content.wellness.items.map((item, i) => (
                <div key={item.heading}>
                  <h3 className="text-sm font-bold mb-3 text-foreground">{item.heading}</h3>
                  <p className={`text-xs text-muted-foreground leading-relaxed ${i < content.wellness.items.length - 1 ? "mb-4" : ""}`}>{item.text}</p>
                </div>
              ))}
            </div>
            <WireImage className="h-80" label={content.wellness.image} />
          </div>
        </WireSection>

        <WireSection title={`${activeTab === "Family" ? "Family" : activeTab} Retreat Packages`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.packages.map((pkg) => (
              <Link
                key={pkg.name}
                to={`/retreats-v2/${slugify(pkg.name)}`}
                className="border border-border p-6 group block"
              >
                <h4 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{pkg.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{pkg.duration}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{pkg.desc}</p>
                <span className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground inline-block">Learn more →</span>
              </Link>
            ))}
          </div>
        </WireSection>

        <WireSection dark title={content.cta.title} subtitle={content.cta.subtitle}>
          <Dialog open={planOpen} onOpenChange={setPlanOpen}>
            <DialogTrigger asChild>
              <button className="border px-6 py-3 text-xs tracking-wider border-primary-foreground text-primary-foreground">
                {content.cta.button}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-light">{content.cta.button}</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Share your details and travel plans. Our wellness advisors will design a retreat around you.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePlanSubmit} className="space-y-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Name</label>
                  <input
                    type="text"
                    required
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={planPhone}
                    onChange={(e) => setPlanPhone(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Email</label>
                  <input
                    type="email"
                    required
                    value={planEmail}
                    onChange={(e) => setPlanEmail(e.target.value)}
                    className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-border p-3">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Adults</p>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPlanAdults(Math.max(1, planAdults - 1))}
                        className="w-7 h-7 border border-border text-foreground flex items-center justify-center hover:bg-muted"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-foreground">{planAdults}</span>
                      <button
                        type="button"
                        onClick={() => setPlanAdults(planAdults + 1)}
                        className="w-7 h-7 border border-border text-foreground flex items-center justify-center hover:bg-muted"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="border border-border p-3">
                    <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Children</p>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPlanChildren(Math.max(0, planChildren - 1))}
                        className="w-7 h-7 border border-border text-foreground flex items-center justify-center hover:bg-muted"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm text-foreground">{planChildren}</span>
                      <button
                        type="button"
                        onClick={() => setPlanChildren(planChildren + 1)}
                        className="w-7 h-7 border border-border text-foreground flex items-center justify-center hover:bg-muted"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Select Availability</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground flex items-center justify-between focus:outline-none"
                      >
                        <span className={planRange?.from ? "text-foreground" : "text-muted-foreground"}>{rangeLabel}</span>
                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={planRange}
                        onSelect={setPlanRange}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <button
                  type="submit"
                  className="w-full border border-foreground bg-foreground text-background px-6 py-3 text-xs tracking-wider hover:bg-background hover:text-foreground transition-colors"
                >
                  Submit
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </WireSection>
      </div>
    </WireLayout>
  );
};

export default FamiliesWellbeing;
