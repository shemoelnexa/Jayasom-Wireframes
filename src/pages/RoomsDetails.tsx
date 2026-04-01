import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { rooms } from "@/data/rooms";
import { Users, Baby } from "lucide-react";

const RoomsDetails = () => {
  const { id } = useParams();
  const room = rooms.find((r) => r.id === id) || rooms[0];
  const isFamily = room.childrenAllowed;
  const isFiveBed = room.beds === "5 Beds" || room.id === "five-bedroom-estate";

  const [bookingStep, setBookingStep] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [childAges, setChildAges] = useState<number[]>([]);

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

            {/* Guests & Children Selector */}
            <div className="border border-border p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Users className="w-3.5 h-3.5" /> Adults
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-7 h-7 border border-border text-xs text-foreground flex items-center justify-center hover:bg-muted">−</button>
                  <span className="text-xs text-foreground w-4 text-center">{adults}</span>
                  <button onClick={() => setAdults(Math.min(room.maxGuests, adults + 1))} className="w-7 h-7 border border-border text-xs text-foreground flex items-center justify-center hover:bg-muted">+</button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Baby className="w-3.5 h-3.5" /> Children (under 16)
                </label>
                <div className="flex items-center gap-3">
                  <button onClick={() => { setChildren(Math.max(0, children - 1)); setChildAges((prev) => prev.slice(0, -1)); }} className="w-7 h-7 border border-border text-xs text-foreground flex items-center justify-center hover:bg-muted">−</button>
                  <span className="text-xs text-foreground w-4 text-center">{children}</span>
                  <button onClick={() => { const next = Math.min(room.maxGuests - adults, children + 1); setChildren(next); setChildAges((prev) => [...prev, 5]); }} className="w-7 h-7 border border-border text-xs text-foreground flex items-center justify-center hover:bg-muted">+</button>
                </div>
              </div>

              {children > 0 && (
                <div className="border-t border-border pt-3 space-y-2">
                  {childAges.slice(0, children).map((age, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">Child {i + 1} age</span>
                      <select
                        value={age}
                        onChange={(e) => setChildAges((prev) => { const next = [...prev]; next[i] = Number(e.target.value); return next; })}
                        className="border border-border px-2 py-1 text-[10px] text-foreground bg-background"
                      >
                        {Array.from({ length: 16 }, (_, a) => (
                          <option key={a} value={a}>{a < 1 ? "Under 1" : `${a} years`}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-muted-foreground mt-3">Max {room.maxGuests} guests · {room.numRooms} {room.numRooms === 1 ? "bedroom" : "bedrooms"}</p>
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
