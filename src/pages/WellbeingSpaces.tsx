import { useRef, useState } from "react";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const spaces = [
  { name: "Hydrotherapy Circuit", desc: "A sequential water-based therapy journey including vitality pools, cold plunge, steam rooms, and sensory showers." },
  { name: "Meditation Pavilion", desc: "An open-air sanctuary for guided and silent meditation, set among native gardens with natural acoustic design." },
  { name: "Movement Studio", desc: "A light-filled studio for yoga, Pilates, tai chi, and functional movement classes with panoramic views." },
  { name: "Thermal Garden", desc: "An outdoor thermal experience featuring heated stone beds, herbal steam pods, and cool mist pathways." },
  { name: "Sound Healing Room", desc: "A purpose-built acoustic space for sound baths, vibrational therapy, and deep relaxation sessions." },
  { name: "Private Treatment Suites", desc: "Individual treatment rooms designed for personalised therapies, bodywork, and wellness consultations." },
  { name: "Cryotherapy Chamber", desc: "Whole-body cryotherapy for inflammation reduction, recovery acceleration, and immune system stimulation." },
  { name: "Float Therapy Pods", desc: "Sensory deprivation pods for profound relaxation, stress relief, and meditative states of consciousness." },
  { name: "Breathwork Studio", desc: "A dedicated space for guided breathwork sessions, pranayama practice, and respiratory wellness." },
  { name: "Infrared Sauna Suite", desc: "Full-spectrum infrared saunas for deep detoxification, pain relief, and cardiovascular conditioning." },
  { name: "Outdoor Yoga Deck", desc: "A cantilevered timber deck overlooking the Red Sea for sunrise yoga, sunset meditation, and outdoor classes." },
  { name: "Vitality Pool", desc: "A mineral-enriched pool with hydrotherapy jets, underwater massage stations, and temperature-controlled zones." },
];

const INITIAL_COUNT = 6;

const WellbeingSpaces = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const scroll = (dir: "left" | "right") => {
    carouselRef.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  const visibleSpaces = spaces.slice(0, visibleCount);
  const hasMore = visibleCount < spaces.length;

  return (
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

      {/* Carousel */}
      <WireSection title="Spaces to Explore" subtitle="Scroll through our collection of purposeful wellness environments.">
        <div className="relative">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-border bg-background p-2 hover:bg-muted">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-border bg-background p-2 hover:bg-muted">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto px-8 pb-4" style={{ scrollbarWidth: "none" }}>
            {spaces.map((space) => (
              <div key={space.name} className="border border-border min-w-[300px] flex-shrink-0">
                <WireImage className="h-48" label={space.name} />
                <div className="p-5">
                  <h4 className="text-sm font-bold mb-2 text-foreground">{space.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{space.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </WireSection>

      {/* Grid with Load More */}
      <WireSection title="All Spaces & Amenities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleSpaces.map((space) => (
            <div key={space.name} className="border border-border">
              <WireImage className="h-48" label={space.name} />
              <div className="p-5">
                <h4 className="text-sm font-bold mb-2 text-foreground">{space.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{space.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount(spaces.length)}
              className="border border-foreground px-8 py-3 text-xs tracking-wider text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Load more ({spaces.length - visibleCount} remaining)
            </button>
          </div>
        )}
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
};

export default WellbeingSpaces;
