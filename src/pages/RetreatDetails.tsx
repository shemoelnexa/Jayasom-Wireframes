import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { retreats } from "@/data/retreats";

const transparencyItems = [
  { item: "3x Yoga Sessions", qty: "3x" },
  { item: "1x Wellness Consultation", qty: "1x" },
  { item: "2x Therapeutic Treatments", qty: "2x" },
  { item: "2x Guided Meditation", qty: "2x" },
  { item: "1x Nutrition Consultation", qty: "1x" },
  { item: "Unlimited Hydrotherapy Circuit", qty: "Unlimited" },
];

const RetreatDetails = () => {
  const { id } = useParams();
  const retreat = retreats.find((r) => r.id === id) || retreats[0];

  return (
    <WireLayout>
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/retreat-finder" className="hover:underline">Retreats</Link> → {retreat.name}
      </div>

      <div className="relative">
        <WireImage className="h-[450px] w-full" label={`Hero — ${retreat.name}`} />
        <div className="absolute inset-0 flex items-end pb-16 px-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">{retreat.duration}</p>
            <h1 className="text-4xl font-light text-foreground">{retreat.name}</h1>
          </div>
        </div>
      </div>

      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">{retreat.longDesc}</p>

            <h3 className="text-sm font-bold mb-3 text-foreground">Programme Highlights</h3>
            <ul className="space-y-2 text-xs text-muted-foreground mb-8">
              {retreat.highlights.map((h) => <li key={h}>· {h}</li>)}
            </ul>

            {/* Transparency Table */}
            <h3 className="text-sm font-bold mb-3 text-foreground">Programme Inclusions — At a Glance</h3>
            <div className="border border-border mb-8">
              <div className="grid grid-cols-2 border-b border-border bg-muted/30">
                <p className="text-xs font-bold text-foreground px-4 py-2">Inclusion</p>
                <p className="text-xs font-bold text-foreground px-4 py-2">Quantity</p>
              </div>
              {transparencyItems.map((row) => (
                <div key={row.item} className="grid grid-cols-2 border-b border-border last:border-0">
                  <p className="text-xs text-muted-foreground px-4 py-2">{row.item}</p>
                  <p className="text-xs text-foreground px-4 py-2">{row.qty}</p>
                </div>
              ))}
            </div>

            {/* Personalisation Note */}
            <div className="border border-border bg-muted/30 p-5 mb-8">
              <p className="text-xs text-foreground font-bold mb-1">Personalised to You</p>
              <p className="text-xs text-muted-foreground leading-relaxed">Your schedule will be personalised following a consultation with our Wellness Advisor. The inclusions above represent the minimum programme components — your advisor may recommend additional sessions based on your goals.</p>
            </div>

            <h3 className="text-sm font-bold mb-3 text-foreground">What's Included</h3>
            <ul className="space-y-2 text-xs text-muted-foreground mb-8">
              {retreat.includes.map((inc) => <li key={inc}>· {inc}</li>)}
            </ul>

            <h3 className="text-sm font-bold mb-3 text-foreground">Best Suited For</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {retreat.suitableFor.map((s) => <li key={s}>· {s}</li>)}
            </ul>
          </div>

          <div className="border border-border p-6">
            <h3 className="text-sm font-bold mb-4 text-foreground">Reserve Your Retreat</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Preferred Start Date</label>
                <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select date</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Duration</label>
                <div className="border border-border px-3 py-2 text-xs text-muted-foreground">{retreat.duration}</div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Guests</label>
                <div className="border border-border px-3 py-2 text-xs text-muted-foreground">1 Adult</div>
              </div>
            </div>
            <WireButton>Enquire now</WireButton>
            <p className="text-xs text-muted-foreground mt-4">Pricing available on request</p>
          </div>
        </div>
      </section>

      <WireSection title="Other Retreats You May Enjoy">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {retreats.filter((r) => r.id !== retreat.id).slice(0, 3).map((r) => (
            <Link to={`/retreats/${r.id}`} key={r.id} className="border border-border group">
              <WireImage className="h-44" label={r.name} />
              <div className="p-4">
                <h4 className="text-sm font-bold text-foreground group-hover:underline">{r.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{r.duration} · View retreat →</p>
              </div>
            </Link>
          ))}
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default RetreatDetails;
