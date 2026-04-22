import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import { residences } from "@/data/residences";
import { BedDouble, Maximize2, Bath, Car, ShieldCheck } from "lucide-react";

const ResidenceDetails = () => {
  const { id } = useParams();
  const residence = residences.find((r) => r.id === id) || residences[0];

  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: `${residence.bedrooms}` },
    { icon: Maximize2, label: "Size", value: residence.size },
    { icon: Bath, label: "Bathrooms", value: `${residence.bathrooms}` },
    { icon: Car, label: "Parking", value: `${residence.parkingSpaces} spaces` },
    { icon: ShieldCheck, label: "Tenure", value: residence.tenure },
  ];

  return (
    <WireLayout>
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/amaala-residences" className="hover:underline">Amaala Residences</Link> → {residence.name}
      </div>

      <div className="px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <WireImage className="h-[400px] w-full" label={`${residence.name} — Main`} />
          </div>
          <div className="flex flex-col gap-3">
            <WireImage className="h-[195px]" label="Interior" />
            <WireImage className="h-[195px]" label="Terrace View" />
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Description */}
            <div className="md:col-span-2">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Residence</p>
              <h1 className="text-3xl md:text-4xl font-light mb-4 text-foreground">{residence.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">{residence.longDesc}</p>
            </div>

            {/* At a Glance */}
            <aside className="border border-border p-6 h-fit">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4">At a Glance</p>
              <dl className="space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </dt>
                    <dd className="text-xs font-bold text-foreground text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* Features & Inclusions */}
      <section className="px-8 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border p-6">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4">Residence Features</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground">
              {residence.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-foreground mt-px">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-border p-6">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4">Wellness Inclusions</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{residence.wellnessInclusions}</p>
          </div>
        </div>
      </section>

      <WireSection title="You May Also Like">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {residences.filter((r) => r.id !== residence.id).slice(0, 3).map((r) => (
            <Link to={`/amaala-residences/${r.id}`} key={r.id} className="border border-border group">
              <WireImage className="h-44" label={r.name} />
              <div className="p-4">
                <h4 className="text-sm font-bold text-foreground group-hover:underline">{r.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">View details →</p>
              </div>
            </Link>
          ))}
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default ResidenceDetails;
