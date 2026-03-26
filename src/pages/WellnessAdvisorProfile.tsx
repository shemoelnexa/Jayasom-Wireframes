import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { advisors } from "@/data/advisors";
import { Globe } from "lucide-react";

const WellnessAdvisorProfile = () => {
  const { id } = useParams();
  const advisor = advisors.find((a) => a.id === id) || advisors[0];

  return (
    <WireLayout>
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/wellness-advisor" className="hover:underline">Our Experts & Specialists</Link> → {advisor.name}
      </div>

      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <WireImage className="h-80 w-full" label={advisor.name} />
          </div>
          <div className="md:col-span-2">
            <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">{advisor.role}</p>
            <h1 className="text-3xl font-light mb-4 text-foreground">{advisor.name}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{advisor.bio}</p>

            {/* Languages Spoken */}
            <div className="flex items-center gap-2 mb-8">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-bold">Languages: </span>
                {advisor.languages.join(", ")}
              </p>
            </div>

            <h3 className="text-sm font-bold mb-3 text-foreground">Specialisations</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {advisor.specializations.map((s) => (
                <span key={s} className="border border-border px-3 py-1 text-xs text-muted-foreground">{s}</span>
              ))}
            </div>

            <WireButton>Book a consultation with {advisor.name.split(" ")[0]}</WireButton>
          </div>
        </div>
      </section>

      <WireSection title="What Guests Say">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advisor.testimonials.map((t, i) => (
            <div key={i} className="border border-border p-6">
              <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">"{t.quote}"</p>
              <p className="text-xs text-foreground font-bold">— {t.author}</p>
            </div>
          ))}
        </div>
      </WireSection>

      <WireSection dark title="Begin Your Wellness Journey" subtitle="Schedule a complimentary consultation and discover how personalised guidance can transform your retreat experience.">
        <WireButton dark>Request consultation</WireButton>
      </WireSection>
    </WireLayout>
  );
};

export default WellnessAdvisorProfile;
