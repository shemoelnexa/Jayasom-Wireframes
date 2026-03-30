import { useState } from "react";
import { Baby, Headphones, User, Users } from "lucide-react";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";

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
              <div key={pkg.name} className="border border-border p-6">
                <h4 className="text-sm font-bold mb-1 text-foreground">{pkg.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{pkg.duration}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{pkg.desc}</p>
                <WireButton>Learn more →</WireButton>
              </div>
            ))}
          </div>
        </WireSection>

        <WireSection dark title={content.cta.title} subtitle={content.cta.subtitle}>
          <WireButton dark>{content.cta.button}</WireButton>
        </WireSection>
      </div>
    </WireLayout>
  );
};

export default FamiliesWellbeing;
