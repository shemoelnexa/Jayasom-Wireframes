import { Link, useParams } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import { Share2, Star } from "lucide-react";
import { articles } from "@/data/articles";

const JournalDetail = () => {
  const { id } = useParams();
  const article = articles.find((a) => a.id === id) || articles[0];
  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const fallback = articles.filter((a) => a.id !== article.id).slice(0, 3);
  const suggestions = related.length > 0 ? related : fallback;

  return (
    <WireLayout>
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/journals-stories" className="hover:underline">Journals & Stories</Link> → {article.category} → {article.title}
      </div>

      {/* Article Header */}
      <header className="px-8 pt-6 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-4">{article.category}</p>
          <h1 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">{article.title}</h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">{article.desc}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="px-8 mb-12">
        <div className="max-w-5xl mx-auto">
          <WireImage className="h-[420px] md:h-[520px] w-full" label={`${article.title} — Hero`} />
        </div>
      </div>

      {/* Body */}
      <article className="px-8 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          {article.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="text-xl md:text-2xl font-light text-foreground pt-4">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={i}
                  className="border-l-2 border-foreground pl-6 py-2 my-8 text-lg md:text-xl font-light italic text-foreground leading-relaxed"
                >
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={i} className="text-base text-muted-foreground leading-[1.8]">
                {block.text}
              </p>
            );
          })}

          {/* Share / Save */}
          <div className="flex items-center justify-between border-t border-border pt-6 mt-10">
            <p className="text-xs text-muted-foreground">Enjoyed this piece?</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Star className="w-4 h-4" /> Save
              </button>
              <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Author Card */}
      <section className="px-8 pb-16">
        <div className="max-w-2xl mx-auto border border-border p-6 flex items-start gap-4">
          <div className="w-14 h-14 border border-border flex-shrink-0 flex items-center justify-center text-xs text-muted-foreground">
            Photo
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">Written by</p>
            <h3 className="text-sm font-bold text-foreground mb-1">{article.author}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Part of the Jayasom editorial and wellness team, sharing perspectives from the spaces, kitchens, and practitioners that make a retreat here distinct.
            </p>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-8 pb-16 bg-muted/30">
        <div className="max-w-6xl mx-auto py-12">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">Continue Reading</p>
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">More Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestions.map((a) => (
              <Link key={a.id} to={`/journals-stories/${a.id}`} className="border border-border flex flex-col group bg-background">
                <WireImage className="aspect-[4/3] w-full" label="Article Image" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-muted-foreground">{a.category}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{a.date}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 text-foreground group-hover:underline">{a.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </WireLayout>
  );
};

export default JournalDetail;
