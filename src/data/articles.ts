export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  desc: string;
  author: string;
  readTime: string;
  body: { type: "p" | "h2" | "quote"; text: string }[];
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const raw: Omit<Article, "id">[] = [
  {
    title: "The Science of Sleep at Jayasom",
    category: "Wellness",
    date: "March 2026",
    desc: "How circadian design and personalised sleep protocols help our guests rediscover deep, restorative rest.",
    author: "Dr. Aisha Rahman",
    readTime: "6 min read",
    body: [
      { type: "p", text: "Sleep is the single most powerful, freely available tool we have to restore the body and mind. Yet for many of our guests, it has become the most elusive. At Jayasom, we treat sleep not as an afterthought but as the foundation of every wellness protocol we design." },
      { type: "h2", text: "The Architecture of Rest" },
      { type: "p", text: "Every residence at Jayasom is built around circadian principles. Tuneable lighting mimics the slow warmth of sunrise and the amber hush of dusk. Blackout systems seal out ambient light at night. Acoustic detailing quiets the room to a whisper. These are not luxuries — they are the physiological cues your body requires to release melatonin on schedule." },
      { type: "quote", text: "When the environment aligns with your biology, sleep stops being something you chase — it becomes something that finds you." },
      { type: "h2", text: "A Personalised Protocol" },
      { type: "p", text: "On arrival, our sleep team conducts a comprehensive assessment — looking at your chronotype, recent stress history, caffeine and alcohol patterns, and any underlying hormonal or metabolic factors. From this we design a tailored programme that may include light therapy, evening breathwork, targeted supplementation, and structured wind-down rituals." },
      { type: "p", text: "Within three to four nights most guests report a measurable shift: deeper slow-wave sleep, fewer wakings, and a sense of genuine refreshment on waking. Over a seven-night stay, the changes can be transformative." },
    ],
  },
  {
    title: "Farm-to-Table: Our Garden Story",
    category: "Home",
    date: "February 2026",
    desc: "A look inside Jayasom's organic gardens and how they shape every meal on your wellness journey.",
    author: "Leena Darwish",
    readTime: "5 min read",
    body: [
      { type: "p", text: "Long before a plate reaches a guest, it begins in our garden. Two hectares of organic beds sit behind the wellness centre, quietly producing the leafy greens, herbs, edible flowers, and heirloom vegetables that define every menu at Jayasom." },
      { type: "h2", text: "Soil as the First Ingredient" },
      { type: "p", text: "We take a soil-first approach. No synthetic inputs, no shortcuts — just compost, cover crops, and the kind of patience that modern agriculture has largely forgotten. The result is produce with measurably higher mineral and phytonutrient density, and flavour that needs very little culinary intervention." },
      { type: "quote", text: "The shortest supply chain is a walk across the garden path." },
      { type: "h2", text: "A Dialogue with the Kitchen" },
      { type: "p", text: "Our chefs meet with the horticulture team each morning to walk the beds and decide what will be harvested for the day. Menus flex around what is ready, not the other way around. Guests often find that a dish they loved yesterday has subtly changed today — a reflection of what the garden is offering in that moment." },
    ],
  },
  {
    title: "A Conversation with Our Founder",
    category: "Health",
    date: "January 2026",
    desc: "Karen Campbell shares the vision behind Jayasom and what it means to create a heart-centred wellness destination.",
    author: "Editorial Team",
    readTime: "8 min read",
    body: [
      { type: "p", text: "We sat down with Karen Campbell in the library at Jayasom to talk about the long road from concept to opening, and the principles she has refused to compromise on." },
      { type: "h2", text: "Why a Destination, Not a Spa" },
      { type: "p", text: "\"A spa can give you a treatment. A destination can give you a shift,\" Karen tells us. For her, the difference is everything. Jayasom was designed from the first sketch to hold guests in a complete environment — one where every meal, every pathway, every room is part of the therapy." },
      { type: "quote", text: "Wellness without soul is just wellness marketing. What we are building here has to be felt before it is understood." },
      { type: "h2", text: "Heart-Centred Hospitality" },
      { type: "p", text: "She returns often to the phrase \"heart-centred.\" It shapes how the team is trained, how spaces are staffed, and how success is measured. Occupancy is a number; transformation is the goal." },
    ],
  },
  {
    title: "Movement as Medicine",
    category: "Wellness",
    date: "January 2026",
    desc: "Exploring the role of intentional movement — from yoga to aquatic therapy — in holistic healing.",
    author: "Marco Silva",
    readTime: "5 min read",
    body: [
      { type: "p", text: "The human body is not designed to sit. It is designed to move — gracefully, often, and with intention. At Jayasom, we treat movement as medicine, prescribing it with the same care we give any clinical intervention." },
      { type: "h2", text: "The Right Dose" },
      { type: "p", text: "Not everyone needs the same movement protocol. A guest recovering from burnout may need restorative yoga and gentle walking. An athlete resetting their nervous system may need breathwork, mobility, and carefully programmed strength. Our movement specialists assess each guest individually." },
      { type: "quote", text: "The best exercise is the one you can sustain — and that your body is asking for today." },
      { type: "h2", text: "Water as a Partner" },
      { type: "p", text: "Our aquatic therapy pools allow us to unload joints, regulate the nervous system, and create conditions for movement that are impossible on land. For many guests with chronic pain or stiffness, the water is where the journey begins." },
    ],
  },
  {
    title: "Building Community at Amaala",
    category: "Destination",
    date: "December 2025",
    desc: "How Jayasom is fostering a connected, wellness-led community along the Red Sea coast.",
    author: "Editorial Team",
    readTime: "6 min read",
    body: [
      { type: "p", text: "Amaala is more than a location. It is a deliberate experiment in what a wellness-led community can look like when given a clean slate along one of the world's most pristine coastlines." },
      { type: "h2", text: "Designed for Encounter" },
      { type: "p", text: "From shared dining pavilions to open gardens and evening gathering spaces, Jayasom is built to encourage the quiet, unplanned conversations that guests often describe as the most memorable part of their stay." },
      { type: "quote", text: "Healing deepens in the presence of kindred company." },
    ],
  },
  {
    title: "The Art of Doing Nothing",
    category: "Wellness",
    date: "November 2025",
    desc: "Why stillness is the most radical act of self-care, and how Jayasom creates space for it.",
    author: "Dr. Aisha Rahman",
    readTime: "4 min read",
    body: [
      { type: "p", text: "In a culture that prizes productivity above almost everything, choosing to do nothing can feel transgressive. At Jayasom, we believe it is essential." },
      { type: "h2", text: "Why Stillness Works" },
      { type: "p", text: "The nervous system does its most important repair work in parasympathetic mode — the state we enter when we are safe, unhurried, and unstimulated. Chronic doing keeps us out of this state. Structured nothingness invites us back in." },
      { type: "quote", text: "Rest is not a reward for work completed. It is the ground from which good work grows." },
    ],
  },
  {
    title: "Desert Healing Traditions",
    category: "Destination",
    date: "October 2025",
    desc: "Ancient Arabian wellness practices that inspire the therapeutic programmes at Jayasom.",
    author: "Leena Darwish",
    readTime: "7 min read",
    body: [
      { type: "p", text: "The Arabian peninsula holds one of the oldest continuous healing traditions in the world. From date and honey therapeutics to sand baths and aromatic resins, these practices shaped medicine long before the term existed." },
      { type: "h2", text: "Honouring the Source" },
      { type: "p", text: "Our programmes at Jayasom draw on these traditions respectfully, working with local practitioners and regional botanical experts to ensure the practices we offer are both authentic and clinically sound." },
      { type: "quote", text: "The desert teaches that less, done with intention, is almost always more." },
    ],
  },
  {
    title: "Nutrition for Longevity",
    category: "Health",
    date: "September 2025",
    desc: "Evidence-based dietary strategies our nutritionists use to support long-term vitality.",
    author: "Dr. Aisha Rahman",
    readTime: "6 min read",
    body: [
      { type: "p", text: "Longevity research has matured rapidly in the last decade. What was once speculation is now increasingly supported by rigorous studies in metabolism, inflammation, and cellular health." },
      { type: "h2", text: "The Core Principles" },
      { type: "p", text: "We focus on four pillars: protein adequacy, glycaemic stability, polyphenol diversity, and meal timing. These are unglamorous, but they are the levers that move the largest biomarkers for healthy ageing." },
      { type: "quote", text: "You cannot supplement your way out of a poor foundation. Food remains the primary tool." },
    ],
  },
  {
    title: "Designing Spaces That Heal",
    category: "Home",
    date: "August 2025",
    desc: "How biophilic architecture and circadian lighting transform residences into healing environments.",
    author: "Marco Silva",
    readTime: "5 min read",
    body: [
      { type: "p", text: "Architecture is medicine when done well, and a low-grade stressor when done poorly. The research on how the built environment shapes our physiology is now impossible to ignore." },
      { type: "h2", text: "Biophilia in Practice" },
      { type: "p", text: "We bring nature inside at Jayasom through natural materials, living walls, water features, and sightlines that always lead the eye back to the landscape. The effects on heart rate variability and stress hormones are measurable within days." },
      { type: "quote", text: "A home that heals is one that the body recognises before the mind does." },
    ],
  },
  {
    title: "Mindfulness in Modern Life",
    category: "Wellness",
    date: "July 2025",
    desc: "Practical mindfulness techniques you can integrate into your daily routine beyond the retreat.",
    author: "Marco Silva",
    readTime: "4 min read",
    body: [
      { type: "p", text: "Mindfulness is often taught as a practice that requires cushions, candles, and uninterrupted hours. In reality, the most durable gains come from small practices threaded through the day." },
      { type: "h2", text: "Micro-Practices That Stick" },
      { type: "p", text: "A single mindful breath before opening your laptop. A two-minute body scan before a meeting. A phoneless walk between appointments. These tiny interventions compound — and they survive the transition home in a way that longer retreats sometimes do not." },
      { type: "quote", text: "The practice you will actually do is worth more than the practice you admire from a distance." },
    ],
  },
  {
    title: "The Red Sea Ecosystem",
    category: "Destination",
    date: "June 2025",
    desc: "Exploring the marine biodiversity that makes Amaala one of the world's most pristine coastal destinations.",
    author: "Editorial Team",
    readTime: "6 min read",
    body: [
      { type: "p", text: "The Red Sea is one of the most biologically distinct bodies of water on the planet. Its reefs are warmer, saltier, and more resilient than most — and its biodiversity rivals the richest tropical systems in the world." },
      { type: "h2", text: "A Partner in Wellness" },
      { type: "p", text: "Proximity to a thriving marine ecosystem is itself therapeutic. The sound, the negative ions, the rhythmic motion, and the visual depth all work on the nervous system in quiet, compounding ways." },
      { type: "quote", text: "To be near the sea is to be reminded that you are part of something larger." },
    ],
  },
  {
    title: "Hormonal Health at Every Age",
    category: "Health",
    date: "May 2025",
    desc: "Understanding hormonal shifts and how integrative approaches support women through every life stage.",
    author: "Dr. Aisha Rahman",
    readTime: "7 min read",
    body: [
      { type: "p", text: "Hormonal health is a lifelong conversation, not a problem to be solved at midlife. Our approach at Jayasom is preventative, personalised, and grounded in comprehensive diagnostics." },
      { type: "h2", text: "The Integrative Lens" },
      { type: "p", text: "We combine advanced lab work with lifestyle assessment — sleep, stress, nutrition, movement, and relationships all influence hormonal balance as much as any specific intervention. A programme that addresses only one variable usually underperforms." },
      { type: "quote", text: "Hormones are messengers. When the message changes, the whole system responds." },
    ],
  },
];

export const articles: Article[] = raw.map((a) => ({ ...a, id: slugify(a.title) }));
