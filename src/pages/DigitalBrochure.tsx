import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";

const brochurePages = [
  { title: "Welcome to Jayasom", desc: "An introduction to holistic living at Amaala.", image: "Brochure — Welcome" },
  { title: "Wellness Philosophy", desc: "Our integrative approach to mind, body, and spirit.", image: "Brochure — Philosophy" },
  { title: "The Residences", desc: "Apartments, penthouses, and villas designed for wellness.", image: "Brochure — Residences" },
  { title: "Retreat Programmes", desc: "Curated retreats for restoration, vitality, and clarity.", image: "Brochure — Retreats" },
  { title: "Culinary Nourishment", desc: "Farm-to-table dining that feeds the soul.", image: "Brochure — Dining" },
  { title: "Our Experts", desc: "World-class practitioners guiding your journey.", image: "Brochure — Experts" },
  { title: "Masterplan & Location", desc: "Situated at Amaala's Triple Bay on the Red Sea coast.", image: "Brochure — Location" },
  { title: "Community & Lifestyle", desc: "A vibrant community of like-minded individuals.", image: "Brochure — Community" },
];

const DigitalBrochure = () => (
  <WireLayout>
    <div className="px-8 py-4 text-xs text-muted-foreground">
      <Link to="/" className="hover:underline">Home</Link> → Digital Brochure
    </div>

    {/* iPad-optimised full-screen pages — large touch zones */}
    <section className="px-8 pb-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Jayasom Amaala</p>
        <h1 className="text-4xl font-light text-foreground mb-4">Digital Brochure</h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">Explore the Jayasom experience — optimised for touch navigation. Swipe or tap to browse.</p>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {brochurePages.map((page, i) => (
          <div
            key={page.title}
            className="border border-border cursor-pointer group"
          >
            <WireImage className="h-[400px] w-full" label={page.image} />
            <div className="p-8 md:p-10 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Section {String(i + 1).padStart(2, "0")}</p>
                <h2 className="text-xl font-light text-foreground group-hover:underline">{page.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{page.desc}</p>
              </div>
              <span className="text-2xl text-muted-foreground ml-4">→</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    <WireSection dark title="Interested?" subtitle="Speak with our team to learn more about life at Jayasom Amaala.">
      <div className="flex gap-4">
        <Link to="/retreat-finder" className="border border-primary-foreground px-6 py-3 text-xs tracking-wider text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-colors">Book a Retreat</Link>
        <Link to="/amaala-residences" className="border border-primary-foreground px-6 py-3 text-xs tracking-wider text-primary-foreground hover:bg-primary-foreground hover:text-foreground transition-colors">View Residences</Link>
      </div>
    </WireSection>
  </WireLayout>
);

export default DigitalBrochure;
