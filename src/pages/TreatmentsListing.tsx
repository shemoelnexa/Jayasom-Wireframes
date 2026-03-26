import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import { treatments } from "@/data/treatments";

const categories = [...new Set(treatments.map((t) => t.category))];

const TreatmentsListing = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return treatments.filter((t) => {
      const matchSearch = search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.shortDesc.toLowerCase().includes(search.toLowerCase());
      const matchCat = !activeCategory || t.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  return (
    <WireLayout>
      <div className="relative">
        <WireImage className="h-[400px] w-full" label="Hero Image — Treatments" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Healing & Therapy</p>
            <h1 className="text-4xl font-light text-foreground">Treatments</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-4">Explore over 100 treatments spanning massage, facials, hydrotherapy, energy healing, meditation, and more.</p>
          </div>
        </div>
      </div>

      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search treatments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-border px-4 py-3 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`border px-4 py-2 text-xs tracking-wider ${!activeCategory ? "bg-foreground text-primary-foreground border-foreground" : "border-border text-muted-foreground"}`}
            >
              All ({treatments.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`border px-4 py-2 text-xs tracking-wider ${activeCategory === cat ? "bg-foreground text-primary-foreground border-foreground" : "border-border text-muted-foreground"}`}
              >
                {cat} ({treatments.filter((t) => t.category === cat).length})
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-6">{filtered.length} treatments found</p>

          {/* Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((treatment) => (
              <Link to={`/treatments/${treatment.id}`} key={treatment.id} className="border border-border group">
                <WireImage className="h-44" label={treatment.name} />
                <div className="p-5">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{treatment.category}</p>
                  <h3 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{treatment.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{treatment.duration}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{treatment.shortDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </WireLayout>
  );
};

export default TreatmentsListing;
