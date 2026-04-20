import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";

const pages = [
  { path: "/wellbeing-spaces", label: "Wellbeing Spaces" },
  { path: "/rooms-villas", label: "Rooms & Villas Overview" },
  { path: "/rooms-villas/oceanfront-suite", label: "Rooms & Villas Details" },
  { path: "/culinary-nourishment", label: "Culinary Nourishment" },
  { path: "/families-wellbeing", label: "Families & Shared Wellbeing" },
  { path: "/journals-stories", label: "Journals & Stories — Amaala" },
  { path: "/retreat-finder", label: "Retreat Finder" },
  { path: "/activity-details", label: "Activity Details" },
  { path: "/wellness-advisor", label: "Our Experts & Specialists" },
  { path: "/why-jayasom-residences", label: "Why Jayasom Residences" },
  { path: "/residential-community", label: "Residential Community" },
  { path: "/amaala-residences", label: "Amaala Residences Overview" },
  // REMOVED: { path: "/masterplans-sitemaps", label: "Masterplans & Sitemaps" }, — page removed. Uncomment to restore in the index listing.
  { path: "/treatments", label: "Treatments Listing" },
  { path: "/treatments/deep-tissue-restoration", label: "Treatment Details" },
  // REMOVED: { path: "/retreats/restore-rebalance", label: "Retreat Details" }, — superseded by Retreat Details V2. Uncomment to restore in the index listing.
  { path: "/retreats-v2/holistic-detox", label: "Retreat Details V2" },
  { path: "/retreats-as-a-pair", label: "Retreat Details — As a Pair" },
  { path: "/wellness-advisor/dr-sarah-mitchell", label: "Expert & Specialist Profile" },
  // REMOVED: { path: "/digital-brochure", label: "Digital Brochure" }, — page removed. Uncomment to restore in the index listing.
  { path: "/family-retreat-inclusions", label: "Family Retreat Inclusions" },
];

const Index = () => (
  <WireLayout>
    <section className="px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-light mb-3 text-foreground">Jayasom — Wireframe Pages</h1>
        <p className="text-sm text-muted-foreground mb-10">{pages.length} wireframe page layouts for the Jayasom Amaala wellness destination website.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page, i) => (
            <Link
              key={page.path}
              to={page.path}
              className="border border-border px-6 py-4 flex items-center gap-4 text-foreground hover:bg-accent transition-colors"
            >
              <span className="text-xs text-muted-foreground w-6">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm">{page.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  </WireLayout>
);

export default Index;
