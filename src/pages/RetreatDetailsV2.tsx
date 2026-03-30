import { useParams, Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import { retreats } from "@/data/retreats";

/* ── Static wireframe data ── */

const programGoals = [
  { icon: "🧬", title: "Toxin & Heavy Metal Reduction", desc: "Evidence-based protocols to measurably reduce your body's toxic load through targeted medical treatments." },
  { icon: "🫀", title: "Health Promotion via Medical Technology", desc: "Advanced diagnostics and therapeutic technologies to optimise your body's core systems." },
  { icon: "🥗", title: "Purifying Dietary Plan", desc: "A curated nutrition programme designed by our culinary wellness team to support deep cellular cleansing." },
  { icon: "🌿", title: "Sustainable Lifestyle Development", desc: "Take-home strategies and habits ensuring your transformation continues long after departure." },
];

const durationOptions = [
  { nights: "7 Nights", label: "Essential", price: "From $5,950", popular: false },
  { nights: "10 Nights", label: "Recommended", price: "From $7,800", popular: true },
  { nights: "14 Nights", label: "Comprehensive", price: "From $9,600", popular: false },
];

const journeyDays = [
  { day: "Day 1", title: "Arrival & Assessment", desc: "Welcome consultation, comprehensive health screening, blood work, body composition analysis, and personalised programme design." },
  { day: "Day 2–3", title: "Diagnostic & Foundation", desc: "Advanced diagnostics (ECG, spirometry, BIA), initial treatments begin, nutrition plan starts, movement assessment." },
  { day: "Day 4–6", title: "Deep Treatment Phase", desc: "Core therapeutic treatments, intensive detox protocols, daily movement sessions, guided meditation, and specialist consultations." },
  { day: "Day 7–9", title: "Restoration & Integration", desc: "Recovery-focused therapies, results review, lifestyle education workshops, and sustainable habit-building sessions." },
  { day: "Day 10+", title: "Optimisation & Transition", desc: "Final diagnostics, progress comparison, take-home programme creation, and Health Concierge onboarding for post-stay support." },
];

const medicalTreatments = [
  { treatment: "Medical Consultation (Initial + Follow-ups + Final)", n7: "3", n10: "4", n14: "5" },
  { treatment: "Comprehensive Blood Analysis", n7: "2", n10: "2", n14: "3" },
  { treatment: "Intravenous Detox Infusion", n7: "3", n10: "5", n14: "7" },
  { treatment: "Intravenous Immune Support Infusion", n7: "2", n10: "3", n14: "4" },
  { treatment: "Ozone Therapy Session", n7: "2", n10: "3", n14: "5" },
  { treatment: "Cryotherapy Session", n7: "2", n10: "3", n14: "4" },
  { treatment: "ECG & Spirometry", n7: "1", n10: "1", n14: "2" },
  { treatment: "Bioimpedance Analysis (BIA)", n7: "1", n10: "2", n14: "2" },
];

const wellnessTreatments = [
  { treatment: "Therapeutic Bodywork / Massage", n7: "3", n10: "5", n14: "7" },
  { treatment: "Thalassotherapy Session", n7: "2", n10: "3", n14: "4" },
  { treatment: "Hydrotherapy Circuit Access", n7: "Daily", n10: "Daily", n14: "Daily" },
  { treatment: "Infrared Sauna Detox", n7: "3", n10: "4", n14: "6" },
  { treatment: "Hydrafacial Treatment", n7: "1", n10: "1", n14: "2" },
  { treatment: "Sound Healing Ceremony", n7: "1", n10: "2", n14: "3" },
  { treatment: "Hammam Ritual", n7: "1", n10: "2", n14: "2" },
  { treatment: "Thermal Suite & Roman Therme", n7: "Daily", n10: "Daily", n14: "Daily" },
];

const movementOfferings = [
  { name: "Personal Training (HPM Method)", sessions: "Daily" },
  { name: "Yoga & Breathwork Classes", sessions: "Daily" },
  { name: "Functional Movement Screening", sessions: "1x" },
  { name: "Postural & Mobility Assessment", sessions: "1x" },
  { name: "Outdoor / Beach Training", sessions: "3x weekly" },
  { name: "Technogym Equipment Access", sessions: "Unlimited" },
];

const expertAdvisors = [
  { name: "Dr. Sarah Mitchell", role: "Medical Director", specialty: "Integrative Medicine & Detoxification" },
  { name: "Chef Marco Rossi", role: "Culinary Wellness Director", specialty: "Nutritional Gastronomy" },
  { name: "Leena Kapoor", role: "Wellness Advisor", specialty: "Holistic Therapies & Mindfulness" },
];

const testimonials = [
  { quote: "The level of medical precision combined with genuine care was unlike anything I've experienced. I left with measurably improved health markers and a sustainable plan for home.", author: "Sarah K.", programme: "14-Night Deep Detox", result: "40% reduction in inflammation markers" },
  { quote: "What sets this apart is the integration — medical, nutritional, movement, and mindfulness all working together. My energy levels transformed within the first week.", author: "James R.", programme: "10-Night Programme", result: "Improved sleep quality by 3 hours nightly" },
];

const bookingSteps = ["Programme", "Dates", "Accommodation", "Extras", "Contact"];

/* ── Component ── */

const RetreatDetailsV2 = () => {
  const { id } = useParams();
  const retreat = retreats.find((r) => r.id === id) || retreats[0];

  return (
    <WireLayout>
      {/* Breadcrumb */}
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link>
        {" → "}
        <Link to="/retreat-finder" className="hover:underline">Retreats</Link>
        {" → "}
        {retreat.name}
      </div>

      {/* ── Hero ── */}
      <div className="relative">
        <WireImage className="h-[500px] w-full" label={`Hero — ${retreat.name}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end pb-16 px-8">
          <div className="max-w-6xl mx-auto w-full">
            <p className="text-xs tracking-widest uppercase mb-2 text-white/70">{retreat.duration} · Wellness Programme</p>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-3">{retreat.name}</h1>
            <p className="text-sm text-white/80 max-w-xl">{retreat.shortDesc}</p>
          </div>
        </div>
      </div>

      {/* ── Programme Introduction + Key Facts Sidebar ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Programme Overview</p>
            <h2 className="text-2xl font-light text-foreground mb-6">An Evidence-Based Approach to Transformation</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{retreat.longDesc}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Working alongside our medical team and a Michelin-level culinary wellness kitchen, every element of this programme is designed to deliver a complete reset and measurable transformation. Your journey is guided by advanced diagnostics, personalised protocols, and a multidisciplinary team dedicated to your lasting wellbeing.
            </p>
          </div>

          {/* Key Facts Card */}
          <div className="border border-border p-6 h-fit">
            <h3 className="text-sm font-bold mb-5 text-foreground">Key Facts</h3>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Duration</span>
                <span className="text-foreground font-medium">7, 10, or 14 Nights</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Programme Type</span>
                <span className="text-foreground font-medium">Medically Supervised</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Starting From</span>
                <span className="text-foreground font-medium">$5,950</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Intensity Level</span>
                <span className="text-foreground font-medium">Moderate to High</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best For</span>
                <span className="text-foreground font-medium">Deep Cleansing</span>
              </div>
            </div>
            <div className="mt-6">
              <WireButton className="w-full text-center">Request a Quote</WireButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Programme Goals ── */}
      <section className="px-8 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Programme Goals</p>
          <h2 className="text-2xl font-light text-foreground mb-10">What This Programme Achieves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programGoals.map((goal) => (
              <div key={goal.title} className="border border-border bg-background p-6">
                <div className="text-2xl mb-4">{goal.icon}</div>
                <h3 className="text-sm font-bold text-foreground mb-2">{goal.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{goal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Duration & Pricing Cards ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Duration Options</p>
          <h2 className="text-2xl font-light text-foreground mb-3">Choose Your Programme Length</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-2xl">Each duration option includes the full programme — longer stays include additional treatments, deeper diagnostics, and extended recovery phases.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {durationOptions.map((opt) => (
              <div key={opt.nights} className={`border p-6 relative ${opt.popular ? "border-foreground" : "border-border"}`}>
                {opt.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-foreground text-background text-xs text-center py-1 tracking-wider">
                    RECOMMENDED
                  </div>
                )}
                <div className={opt.popular ? "mt-4" : ""}>
                  <h3 className="text-lg font-light text-foreground mb-1">{opt.nights}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{opt.label} Programme</p>
                  <p className="text-sm font-bold text-foreground mb-6">{opt.price}</p>
                  <p className="text-xs text-muted-foreground mb-1">Programme only — accommodation separate</p>
                  <p className="text-xs text-muted-foreground mb-6">Extension week available on request</p>
                  <WireButton className="w-full text-center">Select {opt.nights}</WireButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Your Journey / Day-by-Day Timeline ── */}
      <section className="px-8 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Your Journey</p>
          <h2 className="text-2xl font-light text-foreground mb-10">Programme Timeline</h2>
          <div className="mb-10">
            <WireButton>Download Programme</WireButton>
          </div>
          <div className="space-y-0">
            {journeyDays.map((phase, i) => (
              <div key={phase.day} className="flex gap-6">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-foreground bg-background" />
                  {i < journeyDays.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                {/* Content */}
                <div className="pb-10">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{phase.day}</p>
                  <h3 className="text-sm font-bold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Gallery Strip ── */}
      <section className="py-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <WireImage className="h-56" label="Treatment Room" />
          <WireImage className="h-56" label="Infrared Sauna" />
          <WireImage className="h-56" label="Culinary Experience" />
          <WireImage className="h-56" label="Thermal Suite" />
        </div>
      </section>

      {/* ── Medical Treatments Table ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Included Treatments</p>
          <h2 className="text-2xl font-light text-foreground mb-3">Medical Treatments</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">All medical treatments are administered by our qualified medical team under the supervision of our Medical Director.</p>

          <div className="border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-bold text-foreground">Treatment</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">7 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">10 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">14 Nights</th>
                </tr>
              </thead>
              <tbody>
                {medicalTreatments.map((row) => (
                  <tr key={row.treatment} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.treatment}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n7}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n10}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n14}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Wellness Treatments Table ── */}
      <section className="px-8 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-light text-foreground mb-3">Wellness & Spa Treatments</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">Restorative therapies designed to complement your medical programme and accelerate recovery.</p>

          <div className="border border-border overflow-x-auto bg-background">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-bold text-foreground">Treatment</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">7 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">10 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">14 Nights</th>
                </tr>
              </thead>
              <tbody>
                {wellnessTreatments.map((row) => (
                  <tr key={row.treatment} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.treatment}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n7}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n10}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n14}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Nutrition Section ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Culinary Wellness</p>
            <h2 className="text-2xl font-light text-foreground mb-6">Nourishment as Medicine</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Every meal is crafted by our culinary wellness team — a collaboration between nutritional scientists and our resident chef. Your daily food programme is designed to support your body's natural detoxification pathways while delivering exceptional flavour.
            </p>
            <ul className="space-y-3 text-xs text-muted-foreground mb-6">
              <li className="flex gap-2">· <span>Full-board detox cuisine — breakfast, lunch, dinner, and therapeutic snacks</span></li>
              <li className="flex gap-2">· <span>Herbal infusions sourced from heritage botanical gardens</span></li>
              <li className="flex gap-2">· <span>Alkaline water programme throughout your stay</span></li>
              <li className="flex gap-2">· <span>One-on-one nutrition consultation with personalised take-home plan</span></li>
              <li className="flex gap-2">· <span>Cooking demonstration — learn to prepare detox meals at home</span></li>
            </ul>
          </div>
          <WireImage className="h-80" label="Culinary Wellness — Detox Cuisine" />
        </div>
      </section>

      {/* ── Movement Lab ── */}
      <section className="px-8 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <WireImage className="h-80" label="Movement Lab — Training Session" />
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Movement Lab</p>
            <h2 className="text-2xl font-light text-foreground mb-6">Intelligent Movement for Recovery</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Our Movement Lab combines high-performance training methodology with recovery science. Sessions are calibrated to your current fitness level and programme goals — whether that's gentle restorative movement or high-intensity functional training.
            </p>
            <div className="border border-border bg-background">
              {movementOfferings.map((item, i) => (
                <div key={item.name} className={`flex justify-between px-4 py-3 text-xs ${i < movementOfferings.length - 1 ? "border-b border-border" : ""}`}>
                  <span className="text-muted-foreground">{item.name}</span>
                  <span className="text-foreground font-medium">{item.sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet Your Team / Expert Advisors ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Your Wellness Team</p>
          <h2 className="text-2xl font-light text-foreground mb-10">Guided by World-Class Experts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {expertAdvisors.map((advisor) => (
              <div key={advisor.name} className="text-center">
                <WireImage className="h-64 w-full mb-4" label={advisor.name} />
                <h3 className="text-sm font-bold text-foreground">{advisor.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{advisor.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{advisor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personalisation Note ── */}
      <section className="px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border bg-muted/30 p-8 text-center">
            <h3 className="text-sm font-bold text-foreground mb-2">Personalised to You</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Every programme is tailored following your initial consultation with our Medical Director and Wellness Advisor. The treatments and schedules shown represent the core programme — your team may recommend additional or alternative sessions based on your diagnostic results and personal goals.
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials / Guest Results ── */}
      <WireSection label="Guest Experiences" title="Measurable Results, Lasting Change">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div key={t.author} className="border border-border p-6">
              <p className="text-xs text-muted-foreground leading-relaxed italic mb-4">"{t.quote}"</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-foreground">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.programme}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">{t.result}</p>
                  <p className="text-xs text-muted-foreground">Key outcome</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </WireSection>

      {/* ── Booking Widget (Multi-Step) ── */}
      <section className="px-8 py-16 bg-foreground text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-primary-foreground/60 mb-3">Begin Your Journey</p>
          <h2 className="text-2xl font-light text-primary-foreground mb-8">Reserve Your Programme</h2>

          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-10">
            {bookingSteps.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${i === 0 ? "bg-primary-foreground text-foreground" : "border border-primary-foreground/40 text-primary-foreground/40"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs ${i === 0 ? "text-primary-foreground" : "text-primary-foreground/40"}`}>{step}</span>
                {i < bookingSteps.length - 1 && <div className="w-6 h-px bg-primary-foreground/20" />}
              </div>
            ))}
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-2">Programme Duration</label>
              <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/60">Select duration</div>
            </div>
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-2">Preferred Arrival Date</label>
              <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/60">Select date</div>
            </div>
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-2">Number of Guests</label>
              <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/60">1 Adult</div>
            </div>
            <div>
              <label className="text-xs text-primary-foreground/60 block mb-2">Accommodation Preference</label>
              <div className="border border-primary-foreground/30 px-4 py-3 text-xs text-primary-foreground/60">Select room type</div>
            </div>
          </div>

          {/* Accommodation Preview */}
          <p className="text-xs text-primary-foreground/60 mb-4">Featured Accommodation Options</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {["Wellness Suite", "Garden Villa", "Ocean Residence", "Royal Suite"].map((room) => (
              <div key={room} className="border border-primary-foreground/20">
                <WireImage className="h-28" label={room} />
                <p className="text-xs text-primary-foreground/70 p-3">{room}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <WireButton dark className="flex-1 text-center">Request a Quote</WireButton>
            <WireButton dark className="flex-1 text-center">Contact via WhatsApp</WireButton>
          </div>
          <p className="text-xs text-primary-foreground/40 mt-4 text-center">Our Health Concierge will respond within 24 hours with a personalised proposal.</p>
        </div>
      </section>

      {/* ── Health Concierge / Post-Stay Support ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Beyond Your Stay</p>
            <h2 className="text-2xl font-light text-foreground mb-6">Your Health Concierge</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Your wellness journey doesn't end at departure. Every guest receives dedicated Health Concierge support — a single point of contact who follows up on your progress, adjusts your home programme, and helps you stay on track with the transformation you've begun.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>· Post-stay follow-up consultations (virtual)</li>
              <li>· Personalised home nutrition and supplement plan</li>
              <li>· Movement programme for continued practice</li>
              <li>· Priority rebooking and programme continuity</li>
              <li>· Access to our digital wellness platform</li>
            </ul>
          </div>
          <WireImage className="h-72" label="Health Concierge — Post-Stay Support" />
        </div>
      </section>

      {/* ── Related Retreats ── */}
      <WireSection title="Other Retreats You May Enjoy" subtitle="Explore programmes that complement or continue your wellness journey.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {retreats.filter((r) => r.id !== retreat.id).slice(0, 3).map((r) => (
            <Link to={`/retreats-v2/${r.id}`} key={r.id} className="border border-border group">
              <WireImage className="h-44" label={r.name} />
              <div className="p-4">
                <h4 className="text-sm font-bold text-foreground group-hover:underline">{r.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{r.duration}</p>
                <p className="text-xs text-muted-foreground mt-2">View programme →</p>
              </div>
            </Link>
          ))}
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default RetreatDetailsV2;
