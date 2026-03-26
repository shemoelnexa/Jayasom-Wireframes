import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import { Star, Share2 } from "lucide-react";

const allArticles = [
  { title: "The Science of Sleep at Jayasom", category: "Wellness", date: "March 2026", desc: "How circadian design and personalised sleep protocols help our guests rediscover deep, restorative rest." },
  { title: "Farm-to-Table: Our Garden Story", category: "Home", date: "February 2026", desc: "A look inside Jayasom's organic gardens and how they shape every meal on your wellness journey." },
  { title: "A Conversation with Our Founder", category: "Health", date: "January 2026", desc: "Karen Campbell shares the vision behind Jayasom and what it means to create a heart-centred wellness destination." },
  { title: "Movement as Medicine", category: "Wellness", date: "January 2026", desc: "Exploring the role of intentional movement — from yoga to aquatic therapy — in holistic healing." },
  { title: "Building Community at Amaala", category: "Destination", date: "December 2025", desc: "How Jayasom is fostering a connected, wellness-led community along the Red Sea coast." },
  { title: "The Art of Doing Nothing", category: "Wellness", date: "November 2025", desc: "Why stillness is the most radical act of self-care, and how Jayasom creates space for it." },
  { title: "Desert Healing Traditions", category: "Destination", date: "October 2025", desc: "Ancient Arabian wellness practices that inspire the therapeutic programmes at Jayasom." },
  { title: "Nutrition for Longevity", category: "Health", date: "September 2025", desc: "Evidence-based dietary strategies our nutritionists use to support long-term vitality." },
  { title: "Designing Spaces That Heal", category: "Home", date: "August 2025", desc: "How biophilic architecture and circadian lighting transform residences into healing environments." },
  { title: "Mindfulness in Modern Life", category: "Wellness", date: "July 2025", desc: "Practical mindfulness techniques you can integrate into your daily routine beyond the retreat." },
  { title: "The Red Sea Ecosystem", category: "Destination", date: "June 2025", desc: "Exploring the marine biodiversity that makes Amaala one of the world's most pristine coastal destinations." },
  { title: "Hormonal Health at Every Age", category: "Health", date: "May 2025", desc: "Understanding hormonal shifts and how integrative approaches support women through every life stage." },
];

const filterCategories = ["Most Recent", "Wellness", "Home", "Destination", "Health"];

const JournalsStories = () => {
  const [activeFilter, setActiveFilter] = useState("Most Recent");
  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const base = activeFilter === "Most Recent" ? allArticles : allArticles.filter((a) => a.category === activeFilter);
    return base;
  }, [activeFilter]);

  const visible = filtered.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    if (visibleCount < filtered.length) {
      setVisibleCount((c) => Math.min(c + 3, filtered.length));
    }
  }, [visibleCount, filtered.length]);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <WireLayout>
      <div className="relative">
        <WireImage className="h-[420px] w-full" label="Hero Image — Journals & Stories" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs tracking-widest uppercase mb-3 text-muted-foreground">Insights</p>
            <h1 className="text-4xl font-light text-foreground">Journals & Stories</h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto mt-3">Perspectives, stories, and updates from Jayasom Amaala.</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <section className="px-8 py-8">
        <div className="max-w-6xl mx-auto flex gap-4 flex-wrap">
          {filterCategories.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-4 py-2 border cursor-pointer transition-colors ${activeFilter === f ? "bg-foreground text-primary-foreground border-foreground" : "border-border text-muted-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="px-8 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((article) => (
            <div key={article.title} className="border border-border flex flex-col">
              <div className="aspect-[4/3] relative">
                <WireImage className="h-full w-full" label="Article Image" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground">{article.category}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
                <h3 className="text-sm font-bold mb-2 text-foreground">{article.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{article.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground border-b border-foreground pb-0.5 cursor-pointer">Read more →</span>
                  <div className="flex items-center gap-3">
                    <button className="text-muted-foreground hover:text-foreground transition-colors" title="Save">
                      <Star className="w-4 h-4" />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors" title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infinite scroll loader */}
      {visibleCount < filtered.length && (
        <div ref={loaderRef} className="text-center pb-16">
          <p className="text-xs text-muted-foreground">Loading more articles...</p>
        </div>
      )}
    </WireLayout>
  );
};

export default JournalsStories;
