import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { Footprints, Shirt, ShieldAlert } from "lucide-react";

const ActivityDetails = () => (
  <WireLayout>
    <div className="px-8 py-4 text-xs text-muted-foreground">
      Activities → Desert Sunrise Meditation
    </div>

    <section className="px-8 pb-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <WireImage className="h-[400px]" label="Activity — Desert Sunrise Meditation" />
        <div className="flex flex-col justify-center">
          <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">Mindfulness</p>
          <h1 className="text-3xl font-light mb-4 text-foreground">Desert Sunrise Meditation</h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Begin your day in stillness as the sun rises over the desert landscape. Guided by our meditation practitioners, this session combines breathwork, gentle movement, and silent contemplation in a natural amphitheatre carved by wind and time.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm text-foreground">60 minutes</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Difficulty</p>
              <p className="text-sm text-foreground">All levels</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Group Size</p>
              <p className="text-sm text-foreground">Max 8 guests</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Schedule</p>
              <p className="text-sm text-foreground">Daily, 5:45 AM</p>
            </div>
          </div>

          {/* Preparation Alerts */}
          <div className="border border-border p-5 mb-6">
            <p className="text-xs font-bold mb-3 text-foreground">Preparation Alerts</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Footwear</p>
                  <p className="text-xs text-foreground">Closed-toe hiking shoes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Clothing</p>
                  <p className="text-xs text-foreground">Light, breathable layers</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Age Restriction</p>
                  <p className="text-xs text-foreground">16+ years</p>
                </div>
              </div>
            </div>
          </div>

          <WireButton>Reserve your spot</WireButton>
        </div>
      </div>
    </section>

    {/* Additional image placeholders */}
    <section className="px-8 pb-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <WireImage className="h-56" label="Desert Landscape at Dawn" />
        <WireImage className="h-56" label="Meditation Circle Setup" />
        <WireImage className="h-56" label="Guests During Session" />
      </div>
    </section>

    <WireSection label="What to Expect" title="Your Experience">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["Meet at the Wellness Centre", "Walk to the desert site", "Guided breathwork session", "Silent meditation & return"].map((step, i) => (
          <div key={step} className="border border-border p-5">
            <p className="text-xs text-muted-foreground mb-2">Step {i + 1}</p>
            <p className="text-sm text-foreground">{step}</p>
          </div>
        ))}
      </div>
    </WireSection>

    {/* Disclaimer */}
    <section className="px-8 pb-8">
      <div className="max-w-6xl mx-auto border border-border bg-muted/30 p-5">
        <p className="text-xs text-muted-foreground italic">
          Activity booking is handled independently and is not currently integrated with room reservations.
        </p>
      </div>
    </section>

    <WireSection title="Related Activities">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Moonlight Yoga", "Sound Healing Journey", "Forest Bathing Walk"].map((name) => (
          <div key={name} className="border border-border">
            <WireImage className="h-44" label={name} />
            <div className="p-4">
              <h4 className="text-sm font-bold text-foreground">{name}</h4>
              <p className="text-xs text-muted-foreground mt-1">View details →</p>
            </div>
          </div>
        ))}
      </div>
    </WireSection>
  </WireLayout>
);

export default ActivityDetails;
