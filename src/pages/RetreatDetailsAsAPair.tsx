import { Link } from "react-router-dom";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";

/* ── Static content: As a Pair ── */

const programmeInclusions = [
  { component: "Health Consultation", n4: "Yes", n7: "Yes", n10: "Yes", n14: "Yes" },
  { component: "Specialist Consultations", n4: "2", n7: "2", n10: "3", n14: "4" },
  { component: "Holistic Sessions", n4: "1", n7: "4", n10: "5", n14: "8" },
  { component: "Spa Experiences", n4: "5", n7: "8", n10: "11", n14: "15" },
  { component: "Motion Sessions", n4: "3", n7: "4", n10: "6", n14: "8" },
  { component: "Group Classes", n4: "Yes", n7: "Yes", n10: "Yes", n14: "Yes" },
  { component: "Wellness Meals (3 daily)", n4: "Yes", n7: "Yes", n10: "Yes", n14: "Yes" },
];

const weekAtJayasom = [
  {
    day: "Day 1",
    title: "Arriving Together",
    desc:
      "You land in the late morning. The transfer from the airport is unhurried — an hour through desert terrain that already begins to reset your sense of scale. Your villa is ready: two robes, a handwritten note from your Wellness Advisor, a pot of loose-leaf tea from Shay Waard. The afternoon is deliberately free. You walk the grounds. Later, you swim. You eat your first meal at Saratô, where the menu has already been shaped around your initial health questionnaires. By evening, the noise of your departure city has begun to fade.",
  },
  {
    day: "Day 2",
    title: "Understanding Yourselves",
    desc:
      "Morning brings your first joint consultation. Your advisor sits with you both as a guide, not a therapist. The conversation is practical: sleep patterns, energy levels, where you each feel stuck. Individual assessments follow. One of you may see the nutritionist; the other, the physiotherapist. You reconvene in the afternoon for a shared Crystal Aroma Massage — ninety minutes of warmth, essential oils, and the simple act of being in the same room without speaking.",
  },
  {
    day: "Day 3",
    title: "The First Shared Ritual",
    desc:
      "Today holds your first true couples experience: QALBAIN, the Two Hearts ritual. This 120-minute sacred ritual uses sound, touch, and guided breathwork to bring you into alignment. It is not about fixing anything. It is about remembering what drew you together. Afterwards, you sit in the garden. Some couples talk. Others simply sit. The afternoon is yours — the hydrothermal circuit, a walk to the Wellness Plateau, or rest in your villa.",
  },
  {
    day: "Day 4",
    title: "Apart, Then Together",
    desc:
      "Mornings diverge. One of you begins with a private yoga session; the other with a Watsu session in the warm pool — a form of aquatic bodywork that holds and stretches the body in water. You do not see each other until lunch at Saratô, where the conversation is different from breakfast. The afternoon brings a Chakra Balancing Therapy for one, and a Himalayan Salt Stone Massage for the other. You compare notes over tea at Shay Waard. The differences in your experiences become a conversation.",
  },
  {
    day: "Day 5",
    title: "Creating Something",
    desc:
      "You cook together. At Nakeha Studio, a chef guides you through a meal that you will eat that evening. The focus is collaboration over technique — how you divide tasks, how you communicate, how you laugh when something goes wrong. It is a mirror for your relationship in a low-stakes setting. The rest of the day is unscheduled. Some couples return to the beach. Others book an additional shared treatment. The programme breathes here on purpose.",
  },
  {
    day: "Day 6",
    title: "The Deeper Work",
    desc:
      "Today includes a guided relationship session with a counsellor. This is optional. Most couples who reach Day 6 choose it. The conversation is structured: what has surfaced during the week, what patterns have become visible, what each person needs going forward. It is honest without being clinical. Afterwards, you share a long afternoon in the hydrothermal circuit — moving through heat, steam, and cold in sequence, saying little, reconnecting through presence.",
  },
  {
    day: "Day 7",
    title: "Walking Out Together",
    desc:
      "Your final morning begins with a reflection walk on the Wellness Plateau. The wellness team joins you briefly to ask one question: what do you want to carry home? Your final meal is at Saratô, unhurried beneath the morning light. You pack slowly. The departure transfer arrives, and the desert opens up again. The week has done its work. You both know it, though neither of you says so yet.",
  },
];

const programmeMayInclude = [
  "QALBAIN (Two Hearts) — 120-minute sacred ritual for couples",
  "Crystal Aroma Massage",
  "Himalayan Salt Stone Massage",
  "Watsu (aquatic bodywork)",
  "Chakra Balancing Therapy",
  "Couples hydrothermal circuit",
  "Guided breathwork session",
  "Pranayama",
  "Nutritional consultation",
  "Relationship counselling session",
  "Cooking class at Nakeha Studio",
];

const alsoConsider = [
  {
    name: "As a Woman",
    desc: "A dedicated programme for women seeking hormonal balance, aesthetic renewal, and reconnection with themselves.",
  },
  {
    name: "As a Leader",
    desc: "For couples where one or both carry the demands of leadership. Combine executive performance with shared restoration.",
  },
];

/* ── Component ── */

const RetreatDetailsAsAPair = () => {
  return (
    <WireLayout>
      {/* Breadcrumb */}
      <div className="px-8 py-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link>
        {" → "}
        <Link to="/retreat-finder" className="hover:underline">Retreats</Link>
        {" → "}
        As a Pair
      </div>

      {/* ── Hero ── */}
      <div className="relative">
        <WireImage className="h-[500px] w-full" label="Hero — As a Pair" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end pb-16 px-8">
          <div className="max-w-6xl mx-auto w-full">
            <p className="text-xs tracking-widest uppercase mb-2 text-white/70">Couples Retreat · 4 / 7 / 10 / 14 Nights</p>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-3">As a Pair</h1>
            <p className="text-sm text-white/80 max-w-xl">Feels like profound connection, relaxing together and renewal.</p>
          </div>
        </div>
      </div>

      {/* ── Overview ── */}
      <section className="px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Overview</p>
          <h2 className="text-2xl font-light text-foreground mb-6">Strengthen Your Bond</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            As a Pair is intended for two people or a couple, deeply invested in their togetherness. The retreat encourages individual growth to strengthen the bond, improve communication, align goals, and explore healthier relationship dynamics in a supportive environment free from daily pressures.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Workshops deepen trust and intimacy and improve understanding, sustaining connection beyond the retreat.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            The programme is built on a simple conviction: relationships, like bodies, benefit from focused, unhurried attention. Over your stay, a Wellness Advisor will come to know you as a pair — your rhythms, your patterns, the spaces where you meet and the ones where you pass each other by — and will adjust each day's shape in response. Some mornings you will sit together; other mornings you will practice apart and return to each other with something new to bring.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Alongside the couples-focused work, each of you receives the full depth of the Jayasom offering as individuals. Your bodies are cared for with the same rigour as any other retreat — diagnostics, bodywork, movement, culinary nourishment, and rest — so that what you give to one another comes from a replenished place. Every element is evidence-based, practitioner-led, and tailored to who you are today.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The result is a retreat that is neither a romantic escape nor a therapeutic intervention, but a considered period of reconnection — honest, restorative, and designed to send you home with rituals and language you can continue to use in daily life.
          </p>
        </div>
      </section>

      {/* ── Two People, One Intention (Expanded Overview) ── */}
      <section className="px-8 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <WireImage className="h-96" label="Couple at Jayasom — Phoenix Garden" />
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Expanded Overview</p>
            <h2 className="text-2xl font-light text-foreground mb-6">Two People, One Intention</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              You arrived here because something between you needed tending. Perhaps the daily rhythm of work and obligation had quietly drawn you apart. Perhaps you are closer than ever and want to deepen what you have already built. The reason matters less than the recognition — that you chose to come here together.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              At Jayasom, As a Pair creates space for two people to slow down side by side. Your Wellness Advisor will learn how you move through a day as a couple, your habits, your tensions, your unspoken patterns, and shape a programme around what surfaces. Some sessions happen together: shared breathwork at dawn, a couples treatment in the hydrothermal circuit, an evening walk through the Phoenix Garden. Others happen apart, giving each of you room to process, rest, and return to the other with something renewed.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is not a romantic holiday dressed up in wellness language. It is a structured, guided period of reconnection — honest, sometimes confronting, and supported at every stage by practitioners who understand how relationships work from the inside out.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Experience: Your Days Together ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">The Experience</p>
            <h2 className="text-2xl font-light text-foreground mb-6">Your Days Together</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Mornings begin gently — perhaps with a guided breathwork session on the terrace or a private yoga practice by the sea. Your guide will have designed a rhythm for your days that balances shared experiences with moments of individual reflection.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Afternoons may bring a couples spa ritual, a nutritional workshop, or time in the hydrothermal facilities. Evenings are yours — a sunset walk along the Red Sea shore, a wellness cuisine dinner, or simply the quiet company of each other.
            </p>
          </div>
          <WireImage className="h-96" label="Sunset walk — Red Sea shore" />
        </div>
      </section>

      {/* ── Image Gallery Strip ── */}
      <section className="py-1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          <WireImage className="h-56" label="Couples Treatment Room" />
          <WireImage className="h-56" label="Hydrothermal Circuit" />
          <WireImage className="h-56" label="Saratô Dining" />
          <WireImage className="h-56" label="Private Yoga by the Sea" />
        </div>
      </section>

      {/* ── Programme Inclusions Table ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">What Is Included</p>
          <h2 className="text-2xl font-light text-foreground mb-3">Programme Inclusions</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Inclusions as per your Wellness Advisor consultation.
          </p>

          <div className="border border-border overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 font-bold text-foreground">Component</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">4 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">7 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">10 Nights</th>
                  <th className="text-center px-4 py-3 font-bold text-foreground">14 Nights</th>
                </tr>
              </thead>
              <tbody>
                {programmeInclusions.map((row) => (
                  <tr key={row.component} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{row.component}</td>
                    <td className="px-4 py-3 text-center text-foreground">{row.n4}</td>
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

      {/* ── A Week at Jayasom — Day-by-Day Timeline ── */}
      <section className="px-8 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">A Week at Jayasom</p>
          <h2 className="text-2xl font-light text-foreground mb-3">As a Pair — Day by Day</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-2xl">
            A representative seven-night journey. Your Wellness Advisor will shape the rhythm around what surfaces.
          </p>
          <div className="mb-10">
            <WireButton>Download Programme</WireButton>
          </div>
          <div className="space-y-0">
            {weekAtJayasom.map((phase, i) => (
              <div key={phase.day} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-foreground bg-background" />
                  {i < weekAtJayasom.length - 1 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-10">
                  <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">{phase.day}</p>
                  <h3 className="text-sm font-bold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Your Programme May Include ── */}
      <section className="px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">Sessions &amp; Rituals</p>
          <h2 className="text-2xl font-light text-foreground mb-3">Your Programme May Include</h2>
          <p className="text-sm text-muted-foreground mb-10 max-w-2xl">
            Your guide will shape these around your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programmeMayInclude.map((item) => (
              <div key={item} className="border border-border bg-background p-5">
                <p className="text-xs text-foreground leading-relaxed">{item}</p>
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
              Every As a Pair programme is tailored following your initial consultation with your Wellness Advisor. The sessions and schedules shown represent the core programme — your team may recommend additional or alternative experiences based on what surfaces during your time together.
            </p>
          </div>
        </div>
      </section>

      {/* ── You May Also Consider ── */}
      <WireSection
        label="You May Also Consider"
        title="Other Retreats"
        subtitle="Programmes that complement or continue your time together."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alsoConsider.map((r) => (
            <div key={r.name} className="border border-border group">
              <WireImage className="h-44" label={r.name} />
              <div className="p-5">
                <h4 className="text-sm font-bold text-foreground mb-2">{r.name}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default RetreatDetailsAsAPair;
