import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { advisors, getAdvisorFilterRole } from "@/data/advisors";
import type { AdvisorFilterRole } from "@/data/advisors";

const filterOptions: AdvisorFilterRole[] = ["All", "Doctors", "Physiotherapists", "Nutritionists", "Wellness Advisors"];

const WellnessAdvisor = () => {
  const [activeFilter, setActiveFilter] = useState<AdvisorFilterRole>("All");

  const filtered = useMemo(() => {
    if (activeFilter === "All") return advisors;
    return advisors.filter((a) => getAdvisorFilterRole(a).includes(activeFilter));
  }, [activeFilter]);

  return (
    <WireLayout>
      <div className="relative">
        <WireImage className="h-[450px] w-full" label="Hero Image — Our Experts & Specialists" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Your Guide</p>
            <h1 className="text-4xl font-light text-foreground">Our Experts & Specialists</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4">A personal guide to help you navigate your wellness journey — before, during, and after your stay.</p>
          </div>
        </div>
      </div>

      <WireSection title="How It Works" subtitle="Your Wellness Advisor is your single point of contact throughout your Jayasom experience. From pre-arrival consultations to post-stay follow-ups, they ensure every aspect of your journey is aligned with your personal goals.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { step: "01", title: "Pre-Arrival Consultation", desc: "Share your health history, goals, and preferences in a confidential one-on-one session." },
            { step: "02", title: "Personalised Programme", desc: "Receive a bespoke wellness itinerary crafted around your consultation insights." },
            { step: "03", title: "Ongoing Support", desc: "Your advisor checks in throughout your stay and provides a take-home wellness plan." },
          ].map((item) => (
            <div key={item.step} className="border border-border p-6">
              <p className="text-2xl font-light text-muted-foreground mb-3">{item.step}</p>
              <h4 className="text-sm font-bold mb-2 text-foreground">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </WireSection>

      {/* Sorting Filters */}
      <section className="px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 mb-8">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`border px-4 py-2 text-xs tracking-wider transition-colors ${activeFilter === f ? "bg-foreground text-primary-foreground border-foreground" : "border-border text-muted-foreground"}`}
            >
              {f} ({f === "All" ? advisors.length : advisors.filter((a) => getAdvisorFilterRole(a).includes(f)).length})
            </button>
          ))}
        </div>
      </section>

      <WireSection title="Meet Our Team">
        <p className="text-xs text-muted-foreground mb-6">{filtered.length} experts found</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filtered.map((advisor) => (
            <Link to={`/wellness-advisor/${advisor.id}`} key={advisor.id} className="text-center group">
              <WireImage className="h-64 w-full" label={advisor.name} />
              <h4 className="text-sm font-bold mt-4 text-foreground group-hover:underline">{advisor.name}</h4>
              <p className="text-xs text-muted-foreground">{advisor.role}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{advisor.languages.join(", ")}</p>
            </Link>
          ))}
        </div>
      </WireSection>

      <WireSection dark title="Book Your Consultation" subtitle="Begin your wellness journey with a complimentary 30-minute advisory session.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/50">First Name</div>
          <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/50">Last Name</div>
          <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/50 md:col-span-2">Email Address</div>
          <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/50 md:col-span-2">Tell us about your wellness goals</div>
        </div>
        <div className="mt-6">
          <WireButton dark>Request consultation</WireButton>
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default WellnessAdvisor;
