import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";

const FamiliesWellbeing = () => (
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

    <WireSection title="Wellness for Every Generation" subtitle="From toddlers to grandparents, our family programmes are designed to honour each individual's needs while creating shared moments of joy and connection.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold mb-3 text-foreground">Children's Programme</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">Nature exploration, creative arts, gentle movement, and mindfulness activities designed specifically for young guests aged 4–12.</p>
          <h3 className="text-sm font-bold mb-3 text-foreground">Teen Wellness</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">Active adventures, digital detox workshops, and confidence-building activities for guests aged 13–17.</p>
          <h3 className="text-sm font-bold mb-3 text-foreground">Shared Family Rituals</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Sunset yoga, family cooking classes, stargazing, and guided nature walks — experiences designed to be enjoyed together.</p>
        </div>
        <WireImage className="h-80" label="Family at the Beach" />
      </div>
    </WireSection>

    <WireSection title="Family Retreat Packages">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: "The Family Reset", duration: "5 Nights", desc: "A balanced retreat combining shared activities with individual wellness time for parents." },
          { name: "Generations Together", duration: "7 Nights", desc: "A multi-generational programme honouring the unique needs of each family member." },
          { name: "Active Family Adventure", duration: "4 Nights", desc: "Outdoor exploration, water sports, and nature-based activities for the adventurous family." },
        ].map((pkg) => (
          <div key={pkg.name} className="border border-border p-6">
            <h4 className="text-sm font-bold mb-1 text-foreground">{pkg.name}</h4>
            <p className="text-xs text-muted-foreground mb-3">{pkg.duration}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{pkg.desc}</p>
            <WireButton>Learn more →</WireButton>
          </div>
        ))}
      </div>
    </WireSection>

    <WireSection dark title="Family Wellbeing Starts Here" subtitle="Let us help you design the perfect family retreat. Our advisors understand that every family is unique.">
      <WireButton dark>Plan your family retreat</WireButton>
    </WireSection>
  </WireLayout>
);

export default FamiliesWellbeing;
