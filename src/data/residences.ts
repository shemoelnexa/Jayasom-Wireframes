export interface Residence {
  id: string;
  name: string;
  size: string;
  priceFrom: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  tenure: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  wellnessInclusions: string;
}

export const residences: Residence[] = [
  {
    id: "one-bedroom-apartment",
    name: "One-Bedroom Apartment",
    size: "From 95 sqm",
    priceFrom: "From $X.XM",
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 1,
    tenure: "Freehold",
    shortDesc: "An intimate wellness residence with sea-facing balcony and integrated biophilic design.",
    longDesc: "The One-Bedroom Apartment is a thoughtfully compact wellness residence designed for individuals and couples. Floor-to-ceiling glazing frames uninterrupted Red Sea views, while a sea-facing balcony extends the living area outdoors. Biophilic detailing, circadian lighting, and a dedicated in-home wellness corner make daily rituals effortless.",
    features: [
      "Sea-facing balcony",
      "Circadian lighting system",
      "Air & water purification",
      "In-home wellness corner",
      "Integrated smart home",
      "Biophilic finishes",
      "Acoustic sleep zoning",
      "Private storage",
    ],
    wellnessInclusions: "Resident membership to the Jayasom wellness ecosystem, including treatment credits, advisory sessions, organic grocery programme, and access to all shared amenities across the community.",
  },
  {
    id: "two-bedroom-penthouse",
    name: "Two-Bedroom Penthouse",
    size: "From 180 sqm",
    priceFrom: "From $X.XM",
    bedrooms: 2,
    bathrooms: 2,
    parkingSpaces: 2,
    tenure: "Freehold",
    shortDesc: "A dual-aspect penthouse with wraparound terrace, plunge pool, and panoramic coastal views.",
    longDesc: "Occupying upper-level positions across the development, the Two-Bedroom Penthouse offers a dual-aspect layout with a wraparound terrace and private plunge pool. Generous proportions, a dedicated media room, and an open-plan kitchen with chef's pantry make it ideal for both quiet days at home and elegant entertaining.",
    features: [
      "Wraparound terrace",
      "Private plunge pool",
      "Chef's pantry kitchen",
      "Dedicated media room",
      "Walk-in dressing rooms",
      "Smart climate zoning",
      "Private lift lobby",
      "Premium sound system",
    ],
    wellnessInclusions: "Enhanced wellness membership including priority treatment bookings, personalised nutrition programme, in-home wellness consultation, and dedicated concierge services.",
  },
  {
    id: "three-bedroom-villa",
    name: "Three-Bedroom Villa",
    size: "From 320 sqm",
    priceFrom: "From $X.XM",
    bedrooms: 3,
    bathrooms: 3,
    parkingSpaces: 2,
    tenure: "Freehold",
    shortDesc: "A standalone beachfront villa with private wellness garden, lap pool, and direct shoreline access.",
    longDesc: "The Three-Bedroom Villa is a standalone beachfront residence designed for multi-generational family living. Set within its own walled garden, the villa features a private lap pool, outdoor wellness pavilion, and direct shoreline access. Three en-suite bedroom suites, a separate guest wing, and an open living pavilion flow seamlessly into the landscape.",
    features: [
      "Private lap pool",
      "Outdoor wellness pavilion",
      "Direct shoreline access",
      "Walled private garden",
      "Three en-suite bedrooms",
      "Separate guest wing",
      "Outdoor kitchen & dining",
      "Home gym & treatment room",
    ],
    wellnessInclusions: "Signature resident package including unlimited shared amenity access, in-villa wellness sessions, family concierge, dedicated wellness advisor, and priority event invitations across the community.",
  },
];
