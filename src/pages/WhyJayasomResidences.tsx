import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";

const WhyJayasomResidences = () => (
  <WireLayout>
    <div className="relative">
      <WireImage className="h-[480px] w-full" label="Hero Image — Why Jayasom Residences" />
      <div className="absolute inset-0 flex items-end pb-16 px-8">
        <div>
          <h1 className="text-4xl font-light text-foreground mb-3">Why Jayasom Residences</h1>
          <p className="text-sm text-muted-foreground max-w-lg">More than a home. A lifelong commitment to your wellbeing, set within one of the world's most visionary destinations.</p>
        </div>
      </div>
    </div>

    <WireSection title="A New Standard of Living" subtitle="Jayasom Residences redefine what it means to live well. Every residence is designed around the principles of integrative wellness, sustainable luxury, and meaningful community.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <WireImage className="h-72" label="Residence Exterior" />
        <div className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground leading-relaxed">Each wellness residence at Jayasom is a sanctuary wholly conceived to inspire and curate genuine well-being at every age. From personalised health programmes to biophilic architecture, every detail has been considered to support a life of balance, vitality, and purpose.</p>
        </div>
      </div>
    </WireSection>

    <WireSection title="Key Benefits">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Wellness Integration", desc: "Access to Jayasom's full wellness ecosystem including treatments, nutrition, and advisory services." },
          { title: "Amaala Lifestyle", desc: "Part of a connected coastal community with marina, golf, arts, and cultural experiences at your doorstep." },
          { title: "Sustainable Design", desc: "LEED-certified architecture with renewable energy, water conservation, and organic gardens." },
          { title: "Concierge Services", desc: "Dedicated lifestyle management including travel, dining, wellness, and home maintenance." },
        ].map((item) => (
          <div key={item.title} className="border border-border p-6">
            <h4 className="text-sm font-bold mb-2 text-foreground">{item.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </WireSection>

    <WireSection dark title="Begin Your Journey" subtitle="Discover how Jayasom Residences can transform your lifestyle. Our team is ready to guide you.">
      <WireButton dark>Enquire now</WireButton>
    </WireSection>
  </WireLayout>
);

export default WhyJayasomResidences;
