import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { rooms } from "@/data/rooms";

const RoomsOverview = () => (
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

    <section className="px-8 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <Link to={`/rooms-villas/${room.id}`} key={room.id} className="border border-border group">
            <WireImage className="h-56" label={room.name} />
            <div className="p-5">
              <h3 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{room.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{room.beds} · {room.size}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{room.desc}</p>
              <span className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground inline-block">View details →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>

    <WireSection dark title="Need Help Choosing?" subtitle="Our concierge team can recommend the perfect room or villa based on your retreat preferences and wellness goals.">
      <WireButton dark>Talk to our team</WireButton>
    </WireSection>
  </WireLayout>
);

export default RoomsOverview;
