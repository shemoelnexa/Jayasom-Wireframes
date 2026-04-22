import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import { Star, Share2 } from "lucide-react";
import { articles } from "@/data/articles";

const filterCategories = ["Most Recent", "Wellness", "Home", "Destination", "Health"];

const JournalsStories = () => {
  const [activeFilter, setActiveFilter] = useState("Most Recent");
  const [visibleCount, setVisibleCount] = useState(6);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const base = activeFilter === "Most Recent" ? articles : articles.filter((a) => a.category === activeFilter);
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
            <Link to={`/journals-stories/${article.id}`} key={article.id} className="border border-border flex flex-col group">
              <div className="aspect-[4/3] relative">
                <WireImage className="h-full w-full" label="Article Image" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground">{article.category}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                </div>
                <h3 className="text-sm font-bold mb-2 text-foreground group-hover:underline">{article.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">{article.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground border-b border-foreground pb-0.5">Read more →</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Save"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
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
