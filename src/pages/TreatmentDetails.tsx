import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { treatments } from "@/data/treatments";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TreatmentDetails = () => {
  const { id } = useParams();
  const treatment = treatments.find((t) => t.id === id) || treatments[0];
  const isSignature = treatment.isSignature;
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggested = treatments.filter((t) => t.id !== treatment.id && t.category !== treatment.category).slice(0, 8);
  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <WireLayout>
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/treatments" className="hover:underline">Treatments</Link> → {treatment.category} → {treatment.name}
      </div>

      {/* Images only for Signature treatments */}
      {isSignature && (
        <div className="px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <WireImage className="h-[380px] w-full" label={treatment.name} />
            <WireImage className="h-[380px] w-full" label={`${treatment.name} — Environment`} />
          </div>
        </div>
      )}

      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {isSignature && (
              <span className="text-[10px] tracking-widest uppercase border border-foreground px-3 py-1 text-foreground mb-4 inline-block">Signature Treatment</span>
            )}
            <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">{treatment.category}</p>
            <h1 className="text-3xl font-light mb-2 text-foreground">{treatment.name}</h1>
            <p className="text-xs text-muted-foreground mb-6">Duration: {treatment.duration}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">{treatment.longDesc}</p>

            <h3 className="text-sm font-bold mb-3 text-foreground">Benefits</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-8">
              {treatment.benefits.map((b) => <li key={b}>· {b}</li>)}
            </ul>

            <h3 className="text-sm font-bold mb-3 text-foreground">Preparation & Notes</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{treatment.preparation}</p>
          </div>

          <div className="border border-border p-6">
            <h3 className="text-sm font-bold mb-4 text-foreground">Book This Treatment</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Preferred Date</label>
                <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select date</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Preferred Time</label>
                <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select time</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Therapist Preference</label>
                <div className="border border-border px-3 py-2 text-xs text-muted-foreground">No preference</div>
              </div>
            </div>
            <WireButton>Book treatment</WireButton>
            <p className="text-xs text-muted-foreground mt-4">Duration: {treatment.duration} · Pricing on request</p>
          </div>
        </div>
      </section>

      {/* Other Suggested Treatments Carousel */}
      <WireSection title="Other Suggested Treatments">
        <div className="relative">
          <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 border border-border bg-background p-2">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 border border-border bg-background p-2">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-8 pb-4" style={{ scrollbarWidth: "none" }}>
            {suggested.map((t) => (
              <Link to={`/treatments/${t.id}`} key={t.id} className="border border-border min-w-[280px] flex-shrink-0 group">
                {t.isSignature && <WireImage className="h-36" label={t.name} />}
                <div className="p-4">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{t.category}</p>
                  <h4 className="text-sm font-bold text-foreground group-hover:underline">{t.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{t.duration} · View details →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default TreatmentDetails;
