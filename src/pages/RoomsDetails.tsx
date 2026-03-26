import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { rooms } from "@/data/rooms";

const familyRoomIds = ["family-residence", "oasis-pool-villa", "garden-villa", "five-bedroom-estate"];

const RoomsDetails = () => {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id) || rooms[0];
  const isFamily = familyRoomIds.includes(room.id);
  const isFiveBed = room.beds === "5 Beds" || room.id === "five-bedroom-estate";

  const [bookingStep, setBookingStep] = useState(1);

  return (
    <WireLayout>
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/rooms-villas" className="hover:underline">Rooms & Villas</Link> → {room.name}
      </div>

      <div className="px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <WireImage className="h-[400px] w-full" label={`${room.name} — Main`} />
          </div>
          <div className="flex flex-col gap-3">
            <WireImage className="h-[195px]" label="Bathroom" />
            <WireImage className="h-[195px]" label="Terrace View" />
          </div>
        </div>
      </div>

      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-light mb-2 text-foreground">{room.name}</h1>
            <p className="text-xs text-muted-foreground mb-6">{room.beds} · {room.size}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{room.longDesc}</p>
            <h3 className="text-sm font-bold mb-3 text-foreground">Room Features</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-8">
              {room.features.map((f) => <li key={f}>· {f}</li>)}
            </ul>
            <h3 className="text-sm font-bold mb-3 text-foreground">Wellness Inclusions</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">{room.wellnessInclusions}</p>
          </div>

          {/* Conditional Booking Flow */}
          <div className="border border-border p-6">
            <h3 className="text-sm font-bold mb-2 text-foreground">Reserve This Suite</h3>
            <p className="text-[10px] text-muted-foreground mb-4">
              {isFamily ? "Family Booking: Select Room → Add Retreat" : "Adult Booking: Select Retreat → Select Room"}
            </p>

            {/* Step indicators */}
            <div className="flex gap-2 mb-4">
              <div className={`flex-1 h-1 ${bookingStep >= 1 ? "bg-foreground" : "bg-border"}`} />
              <div className={`flex-1 h-1 ${bookingStep >= 2 ? "bg-foreground" : "bg-border"}`} />
            </div>

            {isFamily ? (
              <>
                {bookingStep === 1 && (
                  <div className="space-y-4 mb-6">
                    <p className="text-xs text-foreground font-bold">Step 1: Confirm Room</p>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Check-in</label>
                      <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select date</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Check-out</label>
                      <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select date</div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Guests</label>
                      <div className="border border-border px-3 py-2 text-xs text-muted-foreground">2 Adults, 2 Children</div>
                    </div>
                    <button onClick={() => setBookingStep(2)} className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground w-full">Next: Add Retreat →</button>
                  </div>
                )}
                {bookingStep === 2 && (
                  <div className="space-y-4 mb-6">
                    <p className="text-xs text-foreground font-bold">Step 2: Add a Retreat</p>
                    <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select a retreat programme</div>
                    <WireButton>Check Availability</WireButton>
                    <button onClick={() => setBookingStep(1)} className="text-xs text-muted-foreground underline block">← Back to room</button>
                  </div>
                )}
              </>
            ) : (
              <>
                {bookingStep === 1 && (
                  <div className="space-y-4 mb-6">
                    <p className="text-xs text-foreground font-bold">Step 1: Select Retreat</p>
                    <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Choose your retreat programme</div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Preferred Dates</label>
                      <div className="border border-border px-3 py-2 text-xs text-muted-foreground">Select dates</div>
                    </div>
                    <button onClick={() => setBookingStep(2)} className="border border-foreground px-6 py-3 text-xs tracking-wider text-foreground w-full">Next: Select Room →</button>
                  </div>
                )}
                {bookingStep === 2 && (
                  <div className="space-y-4 mb-6">
                    <p className="text-xs text-foreground font-bold">Step 2: Confirm Room</p>
                    <div className="border border-border px-3 py-2 text-xs text-muted-foreground">{room.name} selected</div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Guests</label>
                      <div className="border border-border px-3 py-2 text-xs text-muted-foreground">2 Adults</div>
                    </div>
                    <WireButton>Check Availability</WireButton>
                    <button onClick={() => setBookingStep(1)} className="text-xs text-muted-foreground underline block">← Back to retreat</button>
                  </div>
                )}
              </>
            )}

            {isFiveBed && (
              <div className="border border-border bg-muted/30 p-3 mt-4">
                <p className="text-[10px] text-muted-foreground">This residence type is mapped to multi-guest retreat rates. Please contact our reservations team for group pricing.</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-4">Starting from $X,XXX per night</p>
          </div>
        </div>
      </section>

      <WireSection title="You May Also Like">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.filter((r) => r.id !== room.id).slice(0, 3).map((r) => (
            <Link to={`/rooms-villas/${r.id}`} key={r.id} className="border border-border group">
              <WireImage className="h-44" label={r.name} />
              <div className="p-4">
                <h4 className="text-sm font-bold text-foreground group-hover:underline">{r.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">View details →</p>
              </div>
            </Link>
          ))}
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default RoomsDetails;
