import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { advisors } from "@/data/advisors";
import { Globe } from "lucide-react";

const WellnessAdvisorProfile = () => {
  const { id } = useParams();
  const advisor = advisors.find((a) => a.id === id) || advisors[0];

  const [consultOpen, setConsultOpen] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultMessage, setConsultMessage] = useState("");

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultOpen(false);
    setConsultName("");
    setConsultPhone("");
    setConsultEmail("");
    setConsultMessage("");
  };

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

            <button
              onClick={() => setConsultOpen(true)}
              className="border px-6 py-3 text-xs tracking-wider border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              Book a consultation with {advisor.name.split(" ")[0]}
            </button>
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
        <button
          onClick={() => setConsultOpen(true)}
          className="border px-6 py-3 text-xs tracking-wider border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-colors"
        >
          Request consultation
        </button>
      </WireSection>

      {/* Shared consultation dialog */}
      <Dialog open={consultOpen} onOpenChange={setConsultOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-light">Request a Consultation</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Share your details and {advisor.name.split(" ")[0]}'s team will be in touch to arrange a time that suits you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConsultSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Name</label>
              <input
                type="text"
                required
                value={consultName}
                onChange={(e) => setConsultName(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Phone Number</label>
              <input
                type="tel"
                required
                value={consultPhone}
                onChange={(e) => setConsultPhone(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={consultEmail}
                onChange={(e) => setConsultEmail(e.target.value)}
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] tracking-widest uppercase text-muted-foreground">Message</label>
              <textarea
                rows={3}
                value={consultMessage}
                onChange={(e) => setConsultMessage(e.target.value)}
                placeholder="Tell us what you'd like to discuss…"
                className="w-full border border-border px-3 py-2 text-sm bg-background text-foreground focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full border border-foreground bg-foreground text-background px-6 py-3 text-xs tracking-wider hover:bg-background hover:text-foreground transition-colors"
            >
              Request Consultation
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </WireLayout>
  );
};

export default WellnessAdvisorProfile;
