import { useRef } from "react";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const outlets = [
  { name: "The Garden Table", desc: "Open-air dining surrounded by organic gardens. Seasonal menus celebrating local produce.", tag: "Family Friendly" },
  { name: "Nourish Bar", desc: "Cold-pressed juices, adaptogenic tonics, and wellness shots.", tag: "Family Friendly" },
  { name: "The Sea Kitchen", desc: "Sustainable seafood from the Red Sea, prepared with minimal intervention.", tag: "Adults Only" },
  { name: "Desert Fire Grill", desc: "Open-flame cooking using ancient desert techniques and local spices.", tag: "Adults Only" },
  { name: "The Vitality Café", desc: "Light bites and superfood bowls designed around your wellness programme.", tag: "Family Friendly" },
  { name: "Moonlight Terrace", desc: "Evening fine dining with panoramic desert views and curated tasting menus.", tag: "Adults Only", closed: true },
  { name: "Spice Route Kitchen", desc: "A culinary journey through Middle Eastern, Asian, and Mediterranean flavours.", tag: "Family Friendly" },
  { name: "The Juice Lab", desc: "Freshly pressed juices and smoothies tailored to your wellness goals.", tag: "Family Friendly" },
  { name: "Harvest Table", desc: "Farm-to-table communal dining with seasonal and locally sourced ingredients.", tag: "Family Friendly" },
  { name: "Oasis Lounge", desc: "Afternoon teas, herbal infusions, and light wellness snacks in a serene setting.", tag: "Adults Only" },
];

const CulinaryNourishment = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <WireLayout>
      {/* Hero Background Video Placeholder */}
      <div className="relative">
        <WireImage className="h-[480px] w-full" label="Hero Background Video — Culinary Nourishment" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer">
              <Play className="w-6 h-6 text-foreground ml-1" />
            </div>
            <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Nourishment</p>
            <h1 className="text-4xl font-light text-foreground">Culinary Nourishment</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4">Food as medicine, flavour as joy. Every meal at Jayasom is crafted to nourish your body and delight your senses.</p>
          </div>
        </div>
      </div>

      <WireSection
        label="Our Philosophy"
        title="Nourishment with Intention"
        subtitle="At Jayasom, dining is an integral part of your wellness journey. Our culinary team works alongside nutritionists and wellness practitioners to create menus that support your programme goals — from gut health and detoxification to vitality and longevity."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <WireImage className="h-72" label="Farm-to-Table Dining" />
          <WireImage className="h-72" label="Kitchen Garden" />
        </div>
      </WireSection>

      {/* Scrollable Carousel */}
      <WireSection title="Dining Experiences">
        <div className="relative">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-border bg-background p-2">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-border bg-background p-2">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-8 pb-4" style={{ scrollbarWidth: "none" }}>
            {outlets.map((venue) => (
              <div key={venue.name} className="border border-border min-w-[300px] flex-shrink-0 relative">
                {venue.closed && (
                  <div className="absolute inset-0 bg-foreground/60 z-10 flex items-center justify-center">
                    <span className="text-background text-sm font-bold tracking-wider uppercase">Currently Closed</span>
                  </div>
                )}
                <WireImage className="h-48" label={venue.name} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 border ${venue.tag === "Adults Only" ? "border-foreground text-foreground" : "border-muted-foreground text-muted-foreground"}`}>
                      {venue.tag}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mb-2 text-foreground">{venue.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{venue.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WireSection>

      <section className="bg-foreground text-background px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — copy */}
          <div>
            <p className="text-xs tracking-widest uppercase mb-3 text-background/60">Personalised Nutrition</p>
            <h2 className="text-2xl font-light mb-4 text-background">Personalised Nutrition Plans</h2>
            <p className="text-sm text-background/70 leading-relaxed">Work with our in-house nutritionist to create a bespoke dining plan aligned with your wellness objectives. Whether you're managing a health condition, optimising performance, or simply looking to eat better — we're here to guide you.</p>
          </div>

          {/* Right — always-visible form */}
          <div className="border border-background/30 p-6">
            <p className="text-sm font-bold text-background mb-4">Speak to a Nutritionist</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-background/70 block mb-1">First name</label>
                  <div className="border border-background/30 bg-transparent px-3 py-2 text-xs text-background/50">Enter first name</div>
                </div>
                <div>
                  <label className="text-[10px] text-background/70 block mb-1">Last name</label>
                  <div className="border border-background/30 bg-transparent px-3 py-2 text-xs text-background/50">Enter last name</div>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-background/70 block mb-1">Email</label>
                <div className="border border-background/30 bg-transparent px-3 py-2 text-xs text-background/50">your@email.com</div>
              </div>
              <div>
                <label className="text-[10px] text-background/70 block mb-1">Dietary requirements or goals</label>
                <div className="border border-background/30 bg-transparent px-3 py-2 text-xs text-background/50 h-20">Tell us about your dietary needs, allergies, or wellness nutrition goals...</div>
              </div>
              <div>
                <label className="text-[10px] text-background/70 block mb-1">Preferred consultation type</label>
                <div className="flex gap-3">
                  {["Video call", "Phone", "In person"].map((opt) => (
                    <div key={opt} className="border border-background/30 px-3 py-2 text-xs text-background/70 cursor-pointer hover:border-background">{opt}</div>
                  ))}
                </div>
              </div>
              <button className="border border-background px-6 py-3 text-xs tracking-wider text-background w-full hover:bg-background hover:text-foreground transition-colors mt-2">
                Send message
              </button>
            </div>
          </div>
        </div>
      </section>

      <WireSection label="From Our Garden" title="Seed to Plate" subtitle="Jayasom's on-site organic gardens supply seasonal herbs, vegetables, and edible flowers directly to our kitchens — reducing food miles to mere footsteps.">
        <WireImage className="h-72" label="Organic Garden" />
      </WireSection>
    </WireLayout>
  );
};

export default CulinaryNourishment;
