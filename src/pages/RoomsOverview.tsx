import { useState } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { rooms } from "@/data/rooms";
import { Users, BedDouble, Baby } from "lucide-react";

const roomOptions = [
  { value: 0, label: "Any" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3+" },
];

const guestOptions = [
  { value: 0, label: "Any" },
  { value: 2, label: "1–2" },
  { value: 4, label: "3–4" },
  { value: 6, label: "5+" },
];

const RoomsOverview = () => {
  const [filterRooms, setFilterRooms] = useState(0);
  const [filterGuests, setFilterGuests] = useState(0);
  const [filterChildren, setFilterChildren] = useState(false);

  const filtered = rooms.filter((room) => {
    if (filterRooms > 0) {
      if (filterRooms === 3) {
        if (room.numRooms < 3) return false;
      } else if (room.numRooms !== filterRooms) return false;
    }
    if (filterGuests > 0) {
      if (filterGuests === 6) {
        if (room.maxGuests < 5) return false;
      } else if (filterGuests === 4) {
        if (room.maxGuests < 3 || room.maxGuests > 4) return false;
      } else if (filterGuests === 2) {
        if (room.maxGuests > 2) return false;
      }
    }
    if (filterChildren && !room.childrenAllowed) return false;
    return true;
  });

  const hasActiveFilters = filterRooms > 0 || filterGuests > 0 || filterChildren;

  return (
    <WireLayout>
      <div className="relative">
        <WireImage className="h-[480px] w-full" label="Hero Image — Rooms & Villas" />
        <div className="absolute inset-0 flex items-end pb-16 px-8">
          <div>
            <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">Accommodation</p>
            <h1 className="text-4xl font-light text-foreground">Rooms & Villas</h1>
          </div>
        </div>
      </div>

      <WireSection
        title="A Place to Rest, Restore, and Be"
        subtitle="Each room and villa at Jayasom Amaala has been thoughtfully designed as an extension of your wellness journey — a private sanctuary where the outside world fades and healing begins."
      />

      {/* Filters */}
      <section className="px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border p-6">
            <div className="flex flex-wrap gap-8 items-end">
              {/* Rooms Filter */}
              <div className="flex-1 min-w-[140px]">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground mb-3">
                  <BedDouble className="w-4 h-4" />
                  Bedrooms
                </label>
                <div className="flex gap-2">
                  {roomOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterRooms(opt.value)}
                      className={`px-4 py-2 text-xs border transition-colors ${filterRooms === opt.value ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guests Filter */}
              <div className="flex-1 min-w-[140px]">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground mb-3">
                  <Users className="w-4 h-4" />
                  Guests
                </label>
                <div className="flex gap-2">
                  {guestOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterGuests(opt.value)}
                      className={`px-4 py-2 text-xs border transition-colors ${filterGuests === opt.value ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Children Filter */}
              <div className="min-w-[160px]">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground mb-3">
                  <Baby className="w-4 h-4" />
                  Children (under 16)
                </label>
                <button
                  onClick={() => setFilterChildren(!filterChildren)}
                  className={`px-5 py-2 text-xs border transition-colors ${filterChildren ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"}`}
                >
                  {filterChildren ? "Yes — showing family-friendly" : "Any"}
                </button>
              </div>

              {/* Clear */}
              {hasActiveFilters && (
                <button
                  onClick={() => { setFilterRooms(0); setFilterGuests(0); setFilterChildren(false); }}
                  className="text-xs text-muted-foreground underline hover:text-foreground pb-2"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {hasActiveFilters && (
            <p className="text-xs text-muted-foreground mb-6">{filtered.length} {filtered.length === 1 ? "result" : "results"} found</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((room) => (
              <Link to={`/rooms-villas/${room.id}`} key={room.id} className="border border-border group">
                <div className="relative">
                  <WireImage className="h-56" label={room.name} />
                  {room.childrenAllowed && (
                    <span className="absolute top-3 left-3 bg-foreground text-background text-[10px] tracking-wider px-3 py-1 uppercase">Family-friendly</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{room.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{room.beds} · {room.size}</p>
                  <p className="text-xs text-muted-foreground mb-3">Up to {room.maxGuests} guests · {room.numRooms} {room.numRooms === 1 ? "bedroom" : "bedrooms"}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{room.desc}</p>
                  <span className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground inline-block">View details →</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground">No rooms match your current filters.</p>
              <button onClick={() => { setFilterRooms(0); setFilterGuests(0); setFilterChildren(false); }} className="text-xs text-foreground underline mt-2">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <WireSection dark title="Need Help Choosing?" subtitle="Our concierge team can recommend the perfect room or villa based on your retreat preferences and wellness goals.">
        <WireButton dark>Talk to our team</WireButton>
      </WireSection>
    </WireLayout>
  );
};

export default RoomsOverview;
