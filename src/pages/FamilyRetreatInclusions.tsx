import { useState, useRef } from "react";
import {
  Clock,
  Users,
  User,
  Baby,
  Dumbbell,
  Palette,
  Waves,
  TreePine,
  Heart,
  Utensils,
  Music,
  Sun,
  Moon,
  Sunrise,
  CalendarDays,
  LayoutGrid,
  List,
  Columns,
  Filter,
  Printer,
  ChevronDown,
  MapPin,
  UserCheck,
  Info,
  X,
} from "lucide-react";
import WireLayout from "@/components/wireframe/WireLayout";
import WireImage from "@/components/wireframe/WireImage";
import WireSection from "@/components/wireframe/WireSection";
import WireButton from "@/components/wireframe/WireButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

type ActivityDetail = {
  activity: string;
  category: string;
  icon: string;
  description: string;
  instructor: string;
  location: string;
};

type TimeSlot = {
  time: string;
  period: "morning" | "midday" | "afternoon" | "evening";
  adult: ActivityDetail;
  child: ActivityDetail & { ageGroup: string; ageRange: [number, number] };
  shared?: boolean;
};

type DaySchedule = {
  day: string;
  theme: string;
  slots: TimeSlot[];
};

const schedule: DaySchedule[] = [
  {
    day: "Day 1",
    theme: "Arrival & Orientation",
    slots: [
      {
        time: "07:00 – 08:00",
        period: "morning",
        adult: { activity: "Sunrise Yoga & Breathwork", category: "Movement", icon: "heart", description: "Begin your day with a gentle Hatha yoga flow on the ocean-view terrace, followed by guided pranayama breathwork to centre the mind and energise the body.", instructor: "Maya Chen — Certified Yoga Instructor (RYT-500)", location: "Ocean Terrace Pavilion" },
        child: { activity: "Morning Nature Walk & Bug Hunt", category: "Nature", icon: "tree", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "An exciting guided walk through the resort's botanical gardens, spotting butterflies, collecting leaves, and learning about local wildlife with magnifying glasses and nature journals.", instructor: "Liam Torres — Children's Nature Educator", location: "Botanical Garden Trail" },
      },
      {
        time: "08:30 – 09:30",
        period: "morning",
        adult: { activity: "Nourishing Breakfast & Wellness Consultation", category: "Nutrition", icon: "utensils", description: "Enjoy a curated wellness breakfast featuring locally sourced organic ingredients, followed by a one-on-one consultation with our nutritionist to personalise your retreat dining plan.", instructor: "Dr. Amira Patel — Clinical Nutritionist", location: "The Garden Restaurant" },
        child: { activity: "Healthy Breakfast & Smoothie Making", category: "Nutrition", icon: "utensils", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "Children enjoy a colourful healthy breakfast then get hands-on making their own fruit smoothies — choosing from tropical fruits, berries, and fun toppings.", instructor: "Chef Rosa Mendez — Junior Cuisine Specialist", location: "Kids' Kitchen Studio" },
      },
      {
        time: "10:00 – 11:30",
        period: "morning",
        adult: { activity: "Spinning Class", category: "Fitness", icon: "dumbbell", description: "High-energy indoor cycling session with curated playlists, personalised intensity coaching, and real-time performance tracking. Suitable for all fitness levels with adjustable resistance.", instructor: "Jake Morrison — Elite Cycling Coach", location: "Fitness Studio A" },
        child: { activity: "Jump Rope Games & Water Aerobics", category: "Fitness", icon: "waves", ageGroup: "Ages 6–12", ageRange: [6, 12], description: "A fun-filled cardio session combining jump rope challenges, relay races on the lawn, followed by a splash into the children's pool for guided water aerobics and games.", instructor: "Sofia Reyes — Children's Fitness Instructor", location: "Kids' Lawn & Children's Pool" },
      },
      {
        time: "12:00 – 13:00",
        period: "midday",
        adult: { activity: "Farm-to-Table Lunch", category: "Nutrition", icon: "utensils", description: "A shared family meal featuring seasonal dishes crafted from ingredients grown in our on-site organic farm. Menus cater to all dietary preferences with kid-friendly options available.", instructor: "Executive Chef Daniel Kwon", location: "The Garden Restaurant" },
        child: { activity: "Farm-to-Table Lunch", category: "Nutrition", icon: "utensils", ageGroup: "All Ages", ageRange: [0, 17], description: "A shared family meal featuring seasonal dishes crafted from ingredients grown in our on-site organic farm. Menus cater to all dietary preferences with kid-friendly options available.", instructor: "Executive Chef Daniel Kwon", location: "The Garden Restaurant" },
        shared: true,
      },
      {
        time: "14:00 – 15:30",
        period: "afternoon",
        adult: { activity: "Deep Tissue Massage & Hydrotherapy", category: "Spa", icon: "heart", description: "A 60-minute deep tissue massage targeting tension areas, followed by a 30-minute hydrotherapy circuit including hot/cold plunge pools and a mineral salt soak.", instructor: "Nadia Volkov — Senior Spa Therapist", location: "Spa & Wellness Centre" },
        child: { activity: "Arts & Crafts Workshop", category: "Creative", icon: "palette", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "A creative session including watercolour painting, leaf printing, shell decorating, and making nature-inspired keepsakes to take home. All materials provided.", instructor: "Emma Li — Children's Art Director", location: "Creative Studio" },
      },
      {
        time: "16:00 – 17:00",
        period: "afternoon",
        adult: { activity: "Guided Meditation & Journaling", category: "Mindfulness", icon: "heart", description: "A calming session in our open-air meditation pavilion with guided visualisation, body scanning, and reflective journaling prompts to deepen self-awareness.", instructor: "Arun Desai — Mindfulness Practitioner", location: "Meditation Pavilion" },
        child: { activity: "Storytelling & Music Circle", category: "Creative", icon: "music", ageGroup: "Ages 4–10", ageRange: [4, 10], description: "An interactive storytelling session with puppets and props, followed by a music circle where children play percussion instruments, sing songs, and create their own short stories.", instructor: "Zara Hughes — Early Years Specialist", location: "Kids' Club Lounge" },
      },
      {
        time: "17:30 – 18:30",
        period: "evening",
        adult: { activity: "Sunset Beach Walk", category: "Nature", icon: "sun", description: "A guided family walk along the shoreline as the sun sets. Includes light stretching, gratitude sharing, and photo opportunities at scenic viewpoints.", instructor: "Resort Wellness Team", location: "Beachfront Promenade" },
        child: { activity: "Sunset Beach Walk", category: "Nature", icon: "sun", ageGroup: "All Ages", ageRange: [0, 17], description: "A guided family walk along the shoreline as the sun sets. Includes light stretching, gratitude sharing, and photo opportunities at scenic viewpoints.", instructor: "Resort Wellness Team", location: "Beachfront Promenade" },
        shared: true,
      },
    ],
  },
  {
    day: "Day 2",
    theme: "Active Exploration",
    slots: [
      {
        time: "07:00 – 08:00",
        period: "morning",
        adult: { activity: "Pilates & Core Conditioning", category: "Fitness", icon: "dumbbell", description: "A mat-based Pilates session focusing on core strength, flexibility, and postural alignment. Reformer upgrades available on request.", instructor: "Clara Bennett — STOTT Pilates Instructor", location: "Movement Studio" },
        child: { activity: "Kids' Obstacle Course & Games", category: "Fitness", icon: "dumbbell", ageGroup: "Ages 5–12", ageRange: [5, 12], description: "An exciting outdoor obstacle course with balance beams, tunnels, climbing walls, and team relay races designed to build coordination and confidence.", instructor: "Marco Silva — Children's Sports Coach", location: "Outdoor Adventure Zone" },
      },
      {
        time: "08:30 – 09:30",
        period: "morning",
        adult: { activity: "Antioxidant Breakfast Bowl Bar", category: "Nutrition", icon: "utensils", description: "Build your own superfood breakfast bowl from a curated selection of açaí, dragon fruit, granola, nuts, seeds, and local honey.", instructor: "Nutrition Team", location: "Wellness Café" },
        child: { activity: "Pancake Art & Fruit Decorating", category: "Nutrition", icon: "utensils", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "Children create edible art — decorating pancakes with fresh fruits, chocolate drizzle, and colourful toppings. A fun, delicious start to the day.", instructor: "Chef Rosa Mendez — Junior Cuisine Specialist", location: "Kids' Kitchen Studio" },
      },
      {
        time: "10:00 – 11:30",
        period: "morning",
        adult: { activity: "Aqua Fitness & Lap Swimming", category: "Fitness", icon: "waves", description: "Low-impact aquatic exercise combining water resistance training with guided lap swimming in the adults' infinity pool. Ideal for joint health and cardiovascular fitness.", instructor: "Tom Richards — Aquatic Fitness Trainer", location: "Adults' Infinity Pool" },
        child: { activity: "Supervised Pool Games & Splash Time", category: "Fitness", icon: "waves", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "Splash time in the dedicated children's pool with pool noodle races, water volleyball, diving ring hunts, and free swim under certified lifeguard supervision.", instructor: "Sofia Reyes — Children's Fitness Instructor", location: "Children's Pool & Water Play Area" },
      },
      {
        time: "12:00 – 13:00",
        period: "midday",
        adult: { activity: "Mediterranean Wellness Lunch", category: "Nutrition", icon: "utensils", description: "A shared family meal featuring Mediterranean-inspired dishes rich in omega-3s, fresh vegetables, and wholesome grains. Kids' portions and preferences accommodated.", instructor: "Executive Chef Daniel Kwon", location: "The Terrace Restaurant" },
        child: { activity: "Mediterranean Wellness Lunch", category: "Nutrition", icon: "utensils", ageGroup: "All Ages", ageRange: [0, 17], description: "A shared family meal featuring Mediterranean-inspired dishes rich in omega-3s, fresh vegetables, and wholesome grains. Kids' portions and preferences accommodated.", instructor: "Executive Chef Daniel Kwon", location: "The Terrace Restaurant" },
        shared: true,
      },
      {
        time: "14:00 – 15:30",
        period: "afternoon",
        adult: { activity: "Facial Treatment & Aromatherapy", category: "Spa", icon: "heart", description: "A luxurious 90-minute facial using botanical extracts and marine minerals, paired with a personalised aromatherapy blend you take home.", instructor: "Nadia Volkov — Senior Spa Therapist", location: "Spa & Wellness Centre" },
        child: { activity: "Pottery & Clay Modelling", category: "Creative", icon: "palette", ageGroup: "Ages 5–12", ageRange: [5, 12], description: "Hands-on pottery session where children learn basic techniques to create bowls, animal figurines, and decorative tiles. Pieces are kiln-fired and delivered to your room.", instructor: "Emma Li — Children's Art Director", location: "Creative Studio" },
      },
      {
        time: "16:00 – 17:00",
        period: "afternoon",
        adult: { activity: "Nutritional Workshop & Tasting", category: "Nutrition", icon: "utensils", description: "Learn about functional nutrition, gut health, and personalised dietary planning. Includes a guided tasting of superfoods, fermented foods, and wellness elixirs.", instructor: "Dr. Amira Patel — Clinical Nutritionist", location: "Wellness Education Room" },
        child: { activity: "Junior Chef Cooking Class", category: "Nutrition", icon: "utensils", ageGroup: "Ages 6–12", ageRange: [6, 12], description: "Hands-on cooking fun — children learn to make healthy mini pizzas, energy balls, and decorate their own desserts under the guidance of our junior chef team.", instructor: "Chef Rosa Mendez — Junior Cuisine Specialist", location: "Kids' Kitchen Studio" },
      },
      {
        time: "17:30 – 18:30",
        period: "evening",
        adult: { activity: "Family Stargazing & Astronomy", category: "Nature", icon: "moon", description: "A magical evening under the stars with telescopes, constellation guides, and storytelling about the night sky. Hot chocolate and blankets provided.", instructor: "Resort Astronomy Guide", location: "Observatory Deck" },
        child: { activity: "Family Stargazing & Astronomy", category: "Nature", icon: "moon", ageGroup: "All Ages", ageRange: [0, 17], description: "A magical evening under the stars with telescopes, constellation guides, and storytelling about the night sky. Hot chocolate and blankets provided.", instructor: "Resort Astronomy Guide", location: "Observatory Deck" },
        shared: true,
      },
    ],
  },
  {
    day: "Day 3",
    theme: "Restoration & Connection",
    slots: [
      {
        time: "07:00 – 08:00",
        period: "morning",
        adult: { activity: "Sound Healing & Meditation", category: "Mindfulness", icon: "music", description: "Immerse yourself in the resonant vibrations of singing bowls, gongs, and tuning forks in a guided sound bath designed to release tension and promote deep relaxation.", instructor: "Arun Desai — Mindfulness Practitioner", location: "Meditation Pavilion" },
        child: { activity: "Gentle Yoga & Breathing Games", category: "Movement", icon: "heart", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "A playful yoga session with animal poses, partner stretches, and fun breathing exercises using pinwheels and bubbles to teach children mindful breathing.", instructor: "Maya Chen — Certified Yoga Instructor", location: "Kids' Movement Room" },
      },
      {
        time: "08:30 – 09:30",
        period: "morning",
        adult: { activity: "Wellness Brunch & Juice Cleanse", category: "Nutrition", icon: "utensils", description: "A light, cleansing brunch paired with fresh-pressed juices designed to support digestion and vitality. Menu curated by our nutritionist.", instructor: "Nutrition Team", location: "Wellness Café" },
        child: { activity: "Fun Fruit Kebab Making", category: "Nutrition", icon: "utensils", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "Children create colourful fruit kebabs using seasonal tropical fruits, learning about nutrition in a fun, hands-on way. Includes yoghurt dipping sauces.", instructor: "Chef Rosa Mendez — Junior Cuisine Specialist", location: "Kids' Kitchen Studio" },
      },
      {
        time: "10:00 – 11:30",
        period: "morning",
        adult: { activity: "Thai Massage & Reflexology", category: "Spa", icon: "heart", description: "A 60-minute traditional Thai massage combining acupressure, stretching, and energy line work, followed by a 30-minute reflexology session targeting key pressure points.", instructor: "Sakda Phan — Thai Massage Master", location: "Spa & Wellness Centre" },
        child: { activity: "Beach Treasure Hunt & Sand Art", category: "Nature", icon: "tree", ageGroup: "Ages 4–12", ageRange: [4, 12], description: "An adventurous treasure hunt along the beach with clues and prizes, followed by a creative sand art session building castles, sculptures, and sand mandalas.", instructor: "Liam Torres — Children's Nature Educator", location: "Resort Beach" },
      },
      {
        time: "12:00 – 13:00",
        period: "midday",
        adult: { activity: "Family Picnic by the Sea", category: "Nutrition", icon: "utensils", description: "A relaxed family picnic on the beach with gourmet hampers, fresh fruit, artisan breads, and refreshing drinks. Blankets and parasols provided.", instructor: "Hospitality Team", location: "Beachfront Picnic Area" },
        child: { activity: "Family Picnic by the Sea", category: "Nutrition", icon: "utensils", ageGroup: "All Ages", ageRange: [0, 17], description: "A relaxed family picnic on the beach with gourmet hampers, fresh fruit, artisan breads, and refreshing drinks. Blankets and parasols provided.", instructor: "Hospitality Team", location: "Beachfront Picnic Area" },
        shared: true,
      },
      {
        time: "14:00 – 15:30",
        period: "afternoon",
        adult: { activity: "Creative Watercolour Session", category: "Creative", icon: "palette", description: "A guided watercolour painting session on the terrace, capturing the resort's landscapes. All materials provided; suitable for all skill levels.", instructor: "Guest Artist — Rotating Programme", location: "Art Terrace" },
        child: { activity: "Finger Painting & Collage Making", category: "Creative", icon: "palette", ageGroup: "Ages 4–10", ageRange: [4, 10], description: "Messy, joyful art! Children explore finger painting, stamp art, and collage-making with natural materials like feathers, leaves, and shells.", instructor: "Emma Li — Children's Art Director", location: "Creative Studio" },
      },
      {
        time: "16:00 – 17:30",
        period: "afternoon",
        adult: { activity: "Family Cooking Class", category: "Nutrition", icon: "utensils", description: "A hands-on cooking experience for the whole family. Learn to prepare a three-course meal together using local ingredients and traditional techniques.", instructor: "Executive Chef Daniel Kwon", location: "Main Kitchen Studio" },
        child: { activity: "Family Cooking Class", category: "Nutrition", icon: "utensils", ageGroup: "All Ages", ageRange: [0, 17], description: "A hands-on cooking experience for the whole family. Learn to prepare a three-course meal together using local ingredients and traditional techniques.", instructor: "Executive Chef Daniel Kwon", location: "Main Kitchen Studio" },
        shared: true,
      },
      {
        time: "18:00 – 19:00",
        period: "evening",
        adult: { activity: "Farewell Dinner & Live Music", category: "Social", icon: "music", description: "A celebratory farewell dinner with a curated multi-course menu, live acoustic music, and a special keepsake for every family member.", instructor: "Hospitality & Entertainment Team", location: "Grand Dining Hall" },
        child: { activity: "Farewell Dinner & Live Music", category: "Social", icon: "music", ageGroup: "All Ages", ageRange: [0, 17], description: "A celebratory farewell dinner with a curated multi-course menu, live acoustic music, and a special keepsake for every family member.", instructor: "Hospitality & Entertainment Team", location: "Grand Dining Hall" },
        shared: true,
      },
    ],
  },
];

const pairedActivities = [
  {
    adultActivity: "Spinning Class",
    adultDesc: "High-energy indoor cycling with curated playlists and personalised intensity coaching.",
    adultInstructor: "Jake Morrison — Elite Cycling Coach",
    adultLocation: "Fitness Studio A",
    childActivity: "Jump Rope & Water Aerobics",
    childDesc: "Fun cardio games in the pool and on the lawn, supervised by certified children's fitness instructors.",
    childInstructor: "Sofia Reyes — Children's Fitness Instructor",
    childLocation: "Kids' Lawn & Children's Pool",
    childAgeGroup: "Ages 6–12",
    childAgeRange: [6, 12] as [number, number],
    category: "Fitness",
    time: "10:00 – 11:30",
  },
  {
    adultActivity: "Deep Tissue Massage",
    adultDesc: "Restorative bodywork targeting tension and promoting deep relaxation with aromatherapy oils.",
    adultInstructor: "Nadia Volkov — Senior Spa Therapist",
    adultLocation: "Spa & Wellness Centre",
    childActivity: "Arts & Crafts Workshop",
    childDesc: "Nature-inspired art projects including watercolours, leaf printing, and shell decorating.",
    childInstructor: "Emma Li — Children's Art Director",
    childLocation: "Creative Studio",
    childAgeGroup: "Ages 4–12",
    childAgeRange: [4, 12] as [number, number],
    category: "Wellness / Creative",
    time: "14:00 – 15:30",
  },
  {
    adultActivity: "Guided Meditation",
    adultDesc: "Breathwork and mindfulness practices in our open-air meditation pavilion overlooking the sea.",
    adultInstructor: "Arun Desai — Mindfulness Practitioner",
    adultLocation: "Meditation Pavilion",
    childActivity: "Storytelling & Music Circle",
    childDesc: "Interactive storytelling with musical instruments, singing, and imaginative play led by our kids' team.",
    childInstructor: "Zara Hughes — Early Years Specialist",
    childLocation: "Kids' Club Lounge",
    childAgeGroup: "Ages 4–10",
    childAgeRange: [4, 10] as [number, number],
    category: "Mindfulness / Creative",
    time: "16:00 – 17:00",
  },
  {
    adultActivity: "Aqua Fitness & Lap Swimming",
    adultDesc: "Low-impact aquatic exercise and guided swimming sessions in the adults' infinity pool.",
    adultInstructor: "Tom Richards — Aquatic Fitness Trainer",
    adultLocation: "Adults' Infinity Pool",
    childActivity: "Supervised Pool Games",
    childDesc: "Splash time, pool noodle races, and water games in the dedicated children's pool area.",
    childInstructor: "Sofia Reyes — Children's Fitness Instructor",
    childLocation: "Children's Pool & Water Play Area",
    childAgeGroup: "Ages 4–12",
    childAgeRange: [4, 12] as [number, number],
    category: "Aquatic",
    time: "10:00 – 11:30",
  },
  {
    adultActivity: "Nutritional Workshop",
    adultDesc: "Learn about functional nutrition, gut health, and personalised dietary planning with our nutritionist.",
    adultInstructor: "Dr. Amira Patel — Clinical Nutritionist",
    adultLocation: "Wellness Education Room",
    childActivity: "Junior Chef Cooking Class",
    childDesc: "Hands-on cooking fun — making healthy pizzas, energy balls, and decorating desserts.",
    childInstructor: "Chef Rosa Mendez — Junior Cuisine Specialist",
    childLocation: "Kids' Kitchen Studio",
    childAgeGroup: "Ages 6–12",
    childAgeRange: [6, 12] as [number, number],
    category: "Nutrition",
    time: "16:00 – 17:00",
  },
  {
    adultActivity: "Facial & Aromatherapy",
    adultDesc: "Luxurious facial treatment with botanical extracts and personalised aromatherapy blends.",
    adultInstructor: "Nadia Volkov — Senior Spa Therapist",
    adultLocation: "Spa & Wellness Centre",
    childActivity: "Pottery & Clay Modelling",
    childDesc: "Get creative with clay — making bowls, animals, and keepsakes to take home.",
    childInstructor: "Emma Li — Children's Art Director",
    childLocation: "Creative Studio",
    childAgeGroup: "Ages 5–12",
    childAgeRange: [5, 12] as [number, number],
    category: "Spa / Creative",
    time: "14:00 – 15:30",
  },
];

const activityCategories = [
  {
    name: "Fitness & Movement",
    icon: "dumbbell",
    adultActivities: ["Spinning", "Pilates", "Aqua Fitness", "Beach HIIT", "TRX Training"],
    childActivities: ["Jump Rope Games", "Obstacle Course", "Pool Splash Time", "Dance Party", "Mini Olympics"],
  },
  {
    name: "Spa & Restoration",
    icon: "heart",
    adultActivities: ["Deep Tissue Massage", "Facial Treatment", "Hydrotherapy", "Thai Massage", "Reflexology"],
    childActivities: ["Arts & Crafts", "Pottery", "Colouring & Drawing", "Sand Art", "Nature Collage"],
  },
  {
    name: "Mindfulness",
    icon: "sunrise",
    adultActivities: ["Guided Meditation", "Sound Healing", "Breathwork", "Journaling", "Yoga Nidra"],
    childActivities: ["Storytelling Circle", "Breathing Games", "Gentle Kids' Yoga", "Music & Singing", "Imagination Play"],
  },
  {
    name: "Nature & Outdoors",
    icon: "tree",
    adultActivities: ["Sunrise Yoga", "Beach Walk", "Hiking Trail", "Garden Tour", "Stargazing"],
    childActivities: ["Bug Hunt", "Beach Treasure Hunt", "Nature Walk", "Rock Painting", "Stargazing"],
  },
  {
    name: "Nutrition & Cooking",
    icon: "utensils",
    adultActivities: ["Nutritional Workshop", "Juice Cleanse", "Wine & Cheese Tasting", "Mindful Eating", "Cooking Demo"],
    childActivities: ["Smoothie Making", "Junior Chef Class", "Pancake Art", "Fruit Kebabs", "Cookie Decorating"],
  },
  {
    name: "Aquatic",
    icon: "waves",
    adultActivities: ["Lap Swimming", "Aqua Aerobics", "Hydrotherapy Circuit", "Float Therapy", "Sea Swimming"],
    childActivities: ["Water Aerobics", "Pool Games", "Splash Races", "Water Balloon Fun", "Snorkelling Intro"],
  },
];

/* ------------------------------------------------------------------ */
/*  AGE GROUPS                                                         */
/* ------------------------------------------------------------------ */

const ageGroups = ["All Ages", "Ages 4–6", "Ages 7–12", "Teens 13–17"] as const;
type AgeGroup = (typeof ageGroups)[number];

const ageGroupRanges: Record<AgeGroup, [number, number] | null> = {
  "All Ages": null,
  "Ages 4–6": [4, 6],
  "Ages 7–12": [7, 12],
  "Teens 13–17": [13, 17],
};

function slotMatchesAge(slot: TimeSlot, group: AgeGroup): boolean {
  if (group === "All Ages") return true;
  if (slot.shared) return true;
  const range = ageGroupRanges[group];
  if (!range) return true;
  const [filterMin, filterMax] = range;
  const [slotMin, slotMax] = slot.child.ageRange;
  return slotMin <= filterMax && slotMax >= filterMin;
}

function pairedMatchesAge(pair: (typeof pairedActivities)[number], group: AgeGroup): boolean {
  if (group === "All Ages") return true;
  const range = ageGroupRanges[group];
  if (!range) return true;
  const [filterMin, filterMax] = range;
  const [slotMin, slotMax] = pair.childAgeRange;
  return slotMin <= filterMax && slotMax >= filterMin;
}

/* ------------------------------------------------------------------ */
/*  ICON HELPER                                                        */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.ReactNode> = {
  dumbbell: <Dumbbell className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  waves: <Waves className="w-4 h-4" />,
  palette: <Palette className="w-4 h-4" />,
  tree: <TreePine className="w-4 h-4" />,
  utensils: <Utensils className="w-4 h-4" />,
  music: <Music className="w-4 h-4" />,
  sun: <Sun className="w-4 h-4" />,
  moon: <Moon className="w-4 h-4" />,
  sunrise: <Sunrise className="w-4 h-4" />,
};

const periodIcon: Record<string, React.ReactNode> = {
  morning: <Sunrise className="w-3.5 h-3.5" />,
  midday: <Sun className="w-3.5 h-3.5" />,
  afternoon: <Sun className="w-3.5 h-3.5" />,
  evening: <Moon className="w-3.5 h-3.5" />,
};

const periodLabel: Record<string, string> = {
  morning: "Morning",
  midday: "Midday",
  afternoon: "Afternoon",
  evening: "Evening",
};

/* ------------------------------------------------------------------ */
/*  VIEW TYPES                                                         */
/* ------------------------------------------------------------------ */

const views = ["Timeline", "Paired Cards", "Activity Grid"] as const;
type View = (typeof views)[number];

const viewIcons: Record<View, React.ReactNode> = {
  Timeline: <Columns className="w-4 h-4" />,
  "Paired Cards": <LayoutGrid className="w-4 h-4" />,
  "Activity Grid": <List className="w-4 h-4" />,
};

/* ------------------------------------------------------------------ */
/*  POPUP DETAIL TYPE                                                  */
/* ------------------------------------------------------------------ */

type PopupDetail = {
  type: "adult" | "child";
  activity: string;
  category: string;
  icon: string;
  description: string;
  instructor: string;
  location: string;
  time: string;
  ageGroup?: string;
} | null;

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

const FamilyRetreatInclusions = () => {
  const [activeView, setActiveView] = useState<View>("Timeline");
  const [activeDay, setActiveDay] = useState(0);
  const [ageFilter, setAgeFilter] = useState<AgeGroup>("All Ages");
  const [popupDetail, setPopupDetail] = useState<PopupDetail>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredSlots = schedule[activeDay].slots.filter((s) => slotMatchesAge(s, ageFilter));
  const filteredPairs = pairedActivities.filter((p) => pairedMatchesAge(p, ageFilter));

  /* Group slots by period for mobile accordion */
  const slotsByPeriod = filteredSlots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = [];
    acc[slot.period].push(slot);
    return acc;
  }, {});

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Family Retreat Itinerary — ${schedule[activeDay].day}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Century Gothic', 'Futura', Arial, sans-serif; color: #444; padding: 40px; line-height: 1.5; }
            h1 { font-size: 24px; font-weight: 300; margin-bottom: 4px; }
            h2 { font-size: 14px; font-weight: 400; color: #888; margin-bottom: 24px; }
            .header { border-bottom: 1px solid #ddd; padding-bottom: 16px; margin-bottom: 24px; }
            .header small { color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; padding: 8px 12px; border-bottom: 2px solid #ddd; }
            td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 12px; vertical-align: top; }
            .time { color: #888; white-space: nowrap; width: 110px; }
            .shared { background: #f9f6f3; }
            .shared-badge { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #999; background: #eee; padding: 2px 8px; border-radius: 10px; }
            .category { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #aaa; display: block; margin-top: 2px; }
            .age { font-size: 9px; color: #aaa; background: #f0ece8; padding: 2px 6px; border-radius: 8px; display: inline-block; margin-top: 4px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 10px; color: #aaa; }
            .legend { display: flex; gap: 24px; margin-top: 8px; }
            .legend span { font-size: 10px; color: #888; }
          </style>
        </head>
        <body>
          <div class="header">
            <small>Jayasom Family Retreat</small>
            <h1>${schedule[activeDay].day} — ${schedule[activeDay].theme}</h1>
            <h2>Sample Parallel Programming Itinerary${ageFilter !== "All Ages" ? " · Filtered: " + ageFilter : ""}</h2>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Adults</th>
                <th>Children</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSlots.map((slot) => `
                <tr class="${slot.shared ? "shared" : ""}">
                  <td class="time">${slot.time}</td>
                  <td>
                    ${slot.adult.activity}
                    <span class="category">${slot.adult.category}</span>
                    ${slot.shared ? '<span class="shared-badge">Shared</span>' : ""}
                  </td>
                  <td>
                    ${slot.child.activity}
                    <span class="category">${slot.child.category}</span>
                    ${!slot.shared ? `<span class="age">${slot.child.ageGroup}</span>` : ""}
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>All activities subject to availability. Children's activities supervised by certified specialists.</p>
            <div class="legend">
              <span>■ Highlighted rows = Shared family time</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const openSlotDetail = (slot: TimeSlot, type: "adult" | "child") => {
    const data = type === "adult" ? slot.adult : slot.child;
    setPopupDetail({
      type,
      activity: data.activity,
      category: data.category,
      icon: data.icon,
      description: data.description,
      instructor: data.instructor,
      location: data.location,
      time: slot.time,
      ageGroup: type === "child" ? slot.child.ageGroup : undefined,
    });
  };

  const openPairedDetail = (pair: (typeof pairedActivities)[number], type: "adult" | "child") => {
    setPopupDetail({
      type,
      activity: type === "adult" ? pair.adultActivity : pair.childActivity,
      category: pair.category,
      icon: type === "adult" ? "heart" : "palette",
      description: type === "adult" ? pair.adultDesc : pair.childDesc,
      instructor: type === "adult" ? pair.adultInstructor : pair.childInstructor,
      location: type === "adult" ? pair.adultLocation : pair.childLocation,
      time: pair.time,
      ageGroup: type === "child" ? pair.childAgeGroup : undefined,
    });
  };

  return (
    <WireLayout>
      {/* ── Hero ── */}
      <div className="relative">
        <WireImage className="h-[480px] w-full" label="Hero — Family playing together at resort, split composition showing adults and children" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-16 px-8">
          <div className="max-w-6xl mx-auto w-full">
            <p className="text-xs tracking-widest uppercase mb-2 text-muted-foreground">Family Retreats</p>
            <h1 className="text-4xl md:text-5xl font-light text-foreground">Parallel Programming</h1>
            <p className="text-sm text-muted-foreground max-w-xl mt-3">
              Every moment is designed so the whole family thrives — adults enjoy restorative wellness while children embark on age-appropriate adventures, all happening simultaneously.
            </p>
          </div>
        </div>
      </div>

      {/* ── Intro — "How it works" ── */}
      <WireSection title="How Family Retreats Work" subtitle="Your family's time is precious. Our parallel programming ensures every member — from toddler to grandparent — has a meaningful, tailored experience at the same time.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Clock className="w-6 h-6" />, title: "Simultaneous Scheduling", text: "Adult and children's activities run at the same time slots, so no one waits and no one misses out." },
            { icon: <Users className="w-6 h-6" />, title: "Shared Family Moments", text: "Meals, sunset walks, and special events bring everyone together — highlighted in our schedule so you can plan your togetherness." },
            { icon: <Heart className="w-6 h-6" />, title: "Age-Appropriate Care", text: "Every children's activity is led by certified specialists, designed for specific age groups, and held in dedicated family-friendly spaces." },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-border mb-4">{item.icon}</div>
              <h3 className="text-sm font-bold mb-2 text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </WireSection>

      {/* ── Controls: View Toggle + Age Filter + Print ── */}
      <div className="px-8 pb-2">
        <div className="max-w-6xl mx-auto space-y-4">
          <p className="text-xs tracking-widest uppercase text-muted-foreground">Explore the programme</p>

          <div className="flex flex-wrap items-center gap-4">
            {/* View toggle */}
            <div className="inline-flex rounded-full bg-muted p-1.5 gap-1">
              {views.map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm tracking-wide transition-all duration-200 ${
                    activeView === view
                      ? "bg-background text-foreground shadow-md font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  {viewIcons[view]}
                  <span className="hidden sm:inline">{view}</span>
                </button>
              ))}
            </div>

            {/* Age filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="inline-flex rounded-full bg-muted p-1 gap-1">
                {ageGroups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setAgeFilter(group)}
                    className={`px-3 py-1.5 rounded-full text-xs tracking-wide transition-all duration-200 ${
                      ageFilter === group
                        ? "bg-background text-foreground shadow-sm font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>

            {/* Print button */}
            {activeView === "Timeline" && (
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Itinerary
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Activity Detail Popup ── */}
      <Dialog open={!!popupDetail} onOpenChange={(open) => !open && setPopupDetail(null)}>
        <DialogContent className="max-w-md">
          {popupDetail && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    popupDetail.type === "adult" ? "bg-foreground/10" : "bg-accent"
                  }`}>
                    {popupDetail.type === "adult"
                      ? <User className="w-4 h-4 text-foreground" />
                      : <Baby className="w-4 h-4 text-foreground" />
                    }
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                    {popupDetail.type === "adult" ? "Adult Activity" : "Children's Activity"}
                  </span>
                </div>
                <DialogTitle className="text-xl font-light">{popupDetail.activity}</DialogTitle>
                <DialogDescription className="sr-only">Details about {popupDetail.activity}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Category + Time + Age */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] uppercase tracking-widest bg-accent px-3 py-1 rounded-full text-foreground">
                    {popupDetail.category}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest bg-muted px-3 py-1 rounded-full text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {popupDetail.time}
                  </span>
                  {popupDetail.ageGroup && (
                    <span className="text-[10px] uppercase tracking-widest bg-muted px-3 py-1 rounded-full text-muted-foreground">
                      {popupDetail.ageGroup}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{popupDetail.description}</p>

                {/* Instructor */}
                <div className="flex items-start gap-3 pt-3 border-t border-border">
                  <UserCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Instructor</p>
                    <p className="text-sm text-foreground">{popupDetail.instructor}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Location</p>
                    <p className="text-sm text-foreground">{popupDetail.location}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── VIEW: Timeline ── */}
      {activeView === "Timeline" && (
        <div key="timeline" className="animate-fade-in-up" ref={printRef}>
          {/* Day Tabs */}
          <div className="px-8 pt-6">
            <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
              {schedule.map((day, i) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(i)}
                  className={`flex items-center gap-2 px-5 py-3 border text-sm transition-all duration-200 ${
                    activeDay === i
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  {day.day}
                  <span className="text-xs opacity-70 hidden sm:inline">· {day.theme}</span>
                </button>
              ))}
            </div>
          </div>

          <WireSection>
            {/* Age filter active indicator */}
            {ageFilter !== "All Ages" && (
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                Showing activities suitable for <strong className="text-foreground">{ageFilter}</strong>
                <button onClick={() => setAgeFilter("All Ages")} className="ml-1 underline hover:text-foreground">Clear filter</button>
              </div>
            )}

            {/* === DESKTOP: Full side-by-side grid === */}
            <div className="hidden md:block">
              {/* Column Headers */}
              <div className="grid grid-cols-[120px_1fr_56px_1fr] gap-0 mb-6">
                <div />
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <User className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">Adults</span>
                </div>
                <div />
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <Baby className="w-4 h-4 text-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-foreground">Children</span>
                </div>
              </div>

              {/* Time Slots */}
              {filteredSlots.map((slot, i) => (
                <div
                  key={slot.time}
                  className={`grid grid-cols-[120px_1fr_56px_1fr] gap-0 ${i < filteredSlots.length - 1 ? "mb-1" : ""}`}
                >
                  {/* Time */}
                  <div className="flex flex-col items-start justify-start pt-4 pr-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {periodIcon[slot.period]}
                      <span className="text-xs font-medium">{slot.time.split(" – ")[0]}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 ml-5">{slot.time.split(" – ")[1]}</span>
                  </div>

                  {/* Adult Activity — clickable */}
                  <button
                    onClick={() => openSlotDetail(slot, "adult")}
                    className={`p-4 border-l-2 text-left transition-colors hover:bg-accent/40 ${
                      slot.shared ? "border-l-foreground/40 bg-accent/50" : "border-l-foreground bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {iconMap[slot.adult.icon]}
                      <span className="text-sm font-medium text-foreground">{slot.adult.activity}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{slot.adult.category}</span>
                    {slot.shared && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-foreground/60 bg-foreground/10 px-2 py-0.5 rounded-full">Shared</span>
                    )}
                  </button>

                  {/* Connector */}
                  <div className="flex items-center justify-center">
                    {slot.shared ? (
                      <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-foreground/60" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-px h-3 bg-border" />
                        <div className="w-1.5 h-1.5 rounded-full bg-border" />
                        <div className="w-px h-3 bg-border" />
                      </div>
                    )}
                  </div>

                  {/* Child Activity — clickable */}
                  <button
                    onClick={() => openSlotDetail(slot, "child")}
                    className={`p-4 border-l-2 text-left transition-colors hover:bg-accent/40 ${
                      slot.shared ? "border-l-foreground/40 bg-accent/50" : "border-l-muted-foreground bg-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {iconMap[slot.child.icon]}
                      <span className="text-sm font-medium text-foreground">{slot.child.activity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{slot.child.category}</span>
                      {!slot.shared && (
                        <span className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-full">{slot.child.ageGroup}</span>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* === MOBILE: Accordion by period === */}
            <div className="md:hidden space-y-2">
              {Object.entries(slotsByPeriod).map(([period, slots]) => (
                <Collapsible key={period} defaultOpen={period === "morning"}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 border border-border bg-accent/30 hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-2">
                      {periodIcon[period]}
                      <span className="text-sm font-medium text-foreground">{periodLabel[period]}</span>
                      <span className="text-xs text-muted-foreground">· {slots.length} activities</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border border-t-0 border-border divide-y divide-border">
                      {slots.map((slot) => (
                        <div key={slot.time} className={`p-4 ${slot.shared ? "bg-accent/30" : ""}`}>
                          {/* Time */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{slot.time}</span>
                            {slot.shared && (
                              <span className="text-[10px] uppercase tracking-wider text-foreground/60 bg-foreground/10 px-2 py-0.5 rounded-full ml-auto">
                                Shared
                              </span>
                            )}
                          </div>

                          {/* Two stacked cards */}
                          <div className="space-y-2">
                            <button
                              onClick={() => openSlotDetail(slot, "adult")}
                              className="w-full text-left p-3 border border-border bg-background hover:bg-accent/30 transition-colors"
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <User className="w-3 h-3 text-muted-foreground" />
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Adult</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {iconMap[slot.adult.icon]}
                                <span className="text-sm text-foreground">{slot.adult.activity}</span>
                              </div>
                            </button>

                            {!slot.shared && (
                              <button
                                onClick={() => openSlotDetail(slot, "child")}
                                className="w-full text-left p-3 border border-border bg-background hover:bg-accent/30 transition-colors"
                              >
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Baby className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Child</span>
                                  <span className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-full ml-auto">{slot.child.ageGroup}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {iconMap[slot.child.icon]}
                                  <span className="text-sm text-foreground">{slot.child.activity}</span>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-0.5 bg-foreground" />
                <span>Independent activity</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-4 h-0.5 bg-foreground/40" />
                <span>Shared family time</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                <span>Click any activity for details</span>
              </div>
            </div>
          </WireSection>
        </div>
      )}

      {/* ── VIEW: Paired Cards ("While you… they…") ── */}
      {activeView === "Paired Cards" && (
        <div key="paired" className="animate-fade-in-up">
          <WireSection
            title="While You Restore, They Explore"
            subtitle="Every adult activity has a perfectly matched children's programme running at the same time. Here's how your day works in parallel."
          >
            {ageFilter !== "All Ages" && (
              <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5" />
                Showing activities suitable for <strong className="text-foreground">{ageFilter}</strong>
                <button onClick={() => setAgeFilter("All Ages")} className="ml-1 underline hover:text-foreground">Clear filter</button>
              </div>
            )}
            <div className="space-y-6">
              {filteredPairs.map((pair) => (
                <div key={pair.adultActivity} className="border border-border overflow-hidden">
                  {/* Header bar */}
                  <div className="bg-accent/60 px-6 py-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground">{pair.category}</span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {pair.time}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Adult side — clickable */}
                    <button
                      onClick={() => openPairedDetail(pair, "adult")}
                      className="p-6 md:border-r border-b md:border-b-0 border-border text-left hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-foreground" />
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">While you enjoy</p>
                      </div>
                      <h4 className="text-base font-medium text-foreground mt-2 mb-2">{pair.adultActivity}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{pair.adultDesc}</p>
                    </button>

                    {/* Child side — clickable */}
                    <button
                      onClick={() => openPairedDetail(pair, "child")}
                      className="p-6 text-left hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Baby className="w-4 h-4 text-foreground" />
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">They experience</p>
                      </div>
                      <h4 className="text-base font-medium text-foreground mt-2 mb-2">{pair.childActivity}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">{pair.childDesc}</p>
                      <span className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-1 rounded-full">{pair.childAgeGroup}</span>
                    </button>
                  </div>
                </div>
              ))}
              {filteredPairs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No paired activities match the selected age group.</p>
                  <button onClick={() => setAgeFilter("All Ages")} className="mt-2 text-xs underline hover:text-foreground">Show all activities</button>
                </div>
              )}
            </div>
          </WireSection>
        </div>
      )}

      {/* ── VIEW: Activity Grid ── */}
      {activeView === "Activity Grid" && (
        <div key="grid" className="animate-fade-in-up">
          <WireSection
            title="Activities by Category"
            subtitle="Browse all included activities organised by type. Each category offers tailored programming for both adults and children."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activityCategories.map((cat) => (
                <div key={cat.name} className="border border-border p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
                      {iconMap[cat.icon]}
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{cat.name}</h4>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Adults</span>
                    </div>
                    <ul className="space-y-1">
                      {cat.adultActivities.map((a) => (
                        <li key={a} className="text-xs text-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-foreground inline-block shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Baby className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Children</span>
                    </div>
                    <ul className="space-y-1">
                      {cat.childActivities.map((a) => (
                        <li key={a} className="text-xs text-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </WireSection>
        </div>
      )}

      {/* ── Sample Day Visual ── */}
      <WireSection label="A Glimpse of Your Day" title="One Day, Two Journeys" subtitle="See how a typical family retreat day unfolds — adults and children on their own paths, reconnecting for shared moments.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border p-6 text-center">
            <WireImage className="h-48 mb-4" label="Morning — Adults in yoga, children on nature walk" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sunrise className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-bold text-foreground">Morning</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Parents start with sunrise yoga while children explore nature trails with our guides. Reunite for a nourishing family breakfast.
            </p>
          </div>
          <div className="border border-border p-6 text-center">
            <WireImage className="h-48 mb-4" label="Afternoon — Adults at spa, children doing crafts" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-bold text-foreground">Afternoon</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Adults indulge in spa treatments and workshops while children dive into creative arts, pool games, or cooking classes.
            </p>
          </div>
          <div className="border border-border p-6 text-center">
            <WireImage className="h-48 mb-4" label="Evening — Family together at sunset" />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-bold text-foreground">Evening</h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The whole family comes together for sunset walks, shared dinners, and special moments like stargazing or live music.
            </p>
          </div>
        </div>
      </WireSection>

      {/* ── What's Included ── */}
      <WireSection title="What's Included in Every Family Retreat">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-foreground" />
              <h4 className="text-sm font-bold text-foreground">For Adults</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Daily wellness activities (yoga, fitness, aquatic)",
                "Two spa treatments per retreat",
                "Personalised wellness consultation",
                "All meals and wellness beverages",
                "Guided meditation and mindfulness sessions",
                "Evening social experiences",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0 mt-1" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Baby className="w-4 h-4 text-foreground" />
              <h4 className="text-sm font-bold text-foreground">For Children</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Full-day supervised programming (9am–5pm)",
                "Age-appropriate fitness and movement",
                "Creative arts and nature activities",
                "All meals and healthy snacks",
                "Certified childcare specialists",
                "Dedicated children's spaces and pool area",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-1" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </WireSection>

      {/* ── CTA ── */}
      <WireSection dark title="Design Your Family's Retreat" subtitle="Our wellness advisors will personalise the programme for every member of your family — from toddlers to grandparents. Tell us about your family and we'll craft the perfect parallel itinerary.">
        <div className="flex flex-wrap gap-4">
          <WireButton dark>Speak with a family advisor</WireButton>
          <WireButton dark>Download sample itinerary</WireButton>
        </div>
      </WireSection>
    </WireLayout>
  );
};

export default FamilyRetreatInclusions;
