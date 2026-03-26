import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";

const WellbeingSpaces = () => (
  <WireLayout>
    {/* Hero */}
    <div className="relative">
      <WireImage className="h-[500px] w-full" label="Hero Image — Wellbeing Spaces" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Jayasom Amaala</p>
          <h1 className="text-4xl font-light text-foreground mb-4">Wellbeing Spaces</h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">Purposeful environments designed to nurture healing, stillness, and renewal across body, mind, and spirit.</p>
        </div>
      </div>
    </div>

    <WireSection
      label="Our Approach"
      title="Spaces Designed for Healing"
      subtitle="Every space at Jayasom has been conceived with intention — merging biophilic design, natural light, and sensory calm to create environments that support your wellbeing journey."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <WireImage className="h-72" label="Wellness Centre Exterior" />
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-light mb-3 text-foreground">The Wellness Centre</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">A 4,000 sqm sanctuary housing treatment rooms, hydrotherapy circuits, movement studios, and consultation suites. Designed with natural materials that breathe with the landscape.</p>
          <WireButton>Explore treatments</WireButton>
        </div>
      </div>
    </WireSection>

    <WireSection title="Spaces to Explore">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Hydrotherapy Circuit", "Meditation Pavilion", "Movement Studio", "Thermal Garden", "Sound Healing Room", "Private Treatment Suites"].map((space) => (
          <div key={space} className="border border-border">
            <WireImage className="h-48" label={space} />
            <div className="p-5">
              <h4 className="text-sm font-bold mb-2 text-foreground">{space}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">A dedicated environment crafted to support specific healing modalities and therapeutic practices.</p>
            </div>
          </div>
        ))}
      </div>
    </WireSection>

    <WireSection
      dark
      title="Experience a Guided Tour"
      subtitle="Allow our wellness team to walk you through the spaces and help you discover the right path for your journey."
    >
      <WireButton dark>Schedule a tour</WireButton>
    </WireSection>

    <WireSection
      label="Philosophy"
      title="Where Architecture Meets Wellness"
      subtitle="Jayasom's wellbeing spaces are designed around the principles of circadian lighting, natural ventilation, acoustic calm, and biophilic connection. Every material, every proportion, serves a healing purpose."
    >
      <WireImage className="h-80" label="Architectural Detail" />
    </WireSection>
  </WireLayout>
);

export default WellbeingSpaces;
