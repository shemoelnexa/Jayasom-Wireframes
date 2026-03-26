import { useState } from "react";
import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { retreats } from "@/data/retreats";
import { Calendar } from "lucide-react";

const RetreatFinder = () => {
  const [showScheduler, setShowScheduler] = useState(false);

  return (
  <WireLayout>
    <WireSection title="Find Your Retreat" subtitle="Answer a few questions and let us guide you to the retreat that aligns with your goals, preferences, and pace.">
      <div className="flex items-center gap-2 mb-10">
        {["Your Goals", "Duration", "Style", "Results"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 border flex items-center justify-center text-xs ${i === 0 ? "bg-foreground text-primary-foreground border-foreground" : "border-border text-muted-foreground"}`}>{i + 1}</div>
            <span className="text-xs text-muted-foreground mr-4">{step}</span>
          </div>
        ))}
      </div>

      <div className="border border-border p-8 mb-8">
        <h3 className="text-lg font-light mb-2 text-foreground">What brings you to Jayasom?</h3>
        <p className="text-xs text-muted-foreground mb-6">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Stress relief & relaxation", "Physical recovery & healing", "Emotional balance & clarity", "Fitness & vitality", "Sleep improvement", "Spiritual exploration", "Couple reconnection", "Family bonding"].map((option) => (
            <div key={option} className="border border-border px-4 py-3 text-xs text-muted-foreground cursor-pointer flex items-center gap-3">
              <div className="w-4 h-4 border border-border" />
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <WireButton>Next step →</WireButton>
      </div>
    </WireSection>

    {/* CTA — Speak to a Wellness Advisor */}
    <section className="px-8 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-light mb-3 text-foreground">Not Sure Where to Start?</h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">Our Wellness Advisors are here to listen. Share your story and we'll recommend the perfect retreat for you.</p>
        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="border-2 border-foreground px-8 py-4 text-sm tracking-wider text-foreground inline-flex items-center gap-3 hover:bg-foreground hover:text-background transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Speak to a Wellness Advisor
        </button>

        {/* Interactive Scheduling Widget — toggled by CTA */}
        {showScheduler && (
        <div className="border border-border mt-8 max-w-md mx-auto p-6">
          <p className="text-xs font-bold text-foreground mb-4">Select a 15-Minute Consultation Slot</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {["Mon 28", "Tue 29", "Wed 30"].map((day) => (
              <div key={day} className="border border-border p-2 text-center">
                <p className="text-xs text-foreground font-bold">{day}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {["09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45"].map((time) => (
              <div key={time} className="border border-border px-2 py-2 text-xs text-muted-foreground text-center cursor-pointer hover:bg-foreground hover:text-background transition-colors">{time}</div>
            ))}
          </div>
          <div className="mt-4">
            <WireButton>Confirm Booking</WireButton>
          </div>
        </div>
        )}
      </div>
    </section>

    <WireSection title="Our Retreats">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {retreats.map((retreat) => (
          <Link to={`/retreats/${retreat.id}`} key={retreat.id} className="border border-border group">
            <WireImage className="h-48" label={retreat.name} />
            <div className="p-5">
              <h4 className="text-sm font-bold mb-1 text-foreground group-hover:underline">{retreat.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{retreat.duration}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{retreat.shortDesc}</p>
              <span className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground inline-block">View retreat →</span>
            </div>
          </Link>
        ))}
      </div>
    </WireSection>
  </WireLayout>
  );
};

export default RetreatFinder;
