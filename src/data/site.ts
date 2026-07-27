export const galleryImages = [
  "https://leonie-moreau.designbykiara.com/DSC_1559.jpg",
  "https://leonie-moreau.designbykiara.com/DSC_2720.jpg",
  "https://leonie-moreau.designbykiara.com/DSC_2459.jpg",
  "https://leonie-moreau.designbykiara.com/DSC_3226.jpg",
  "https://leonie-moreau.designbykiara.com/DSC_3275.jpg",
  "https://leonie-moreau.designbykiara.com/DSC_4717.jpeg",
  "https://leonie-moreau.designbykiara.com/DSC_1957.jpg",
  "https://leonie-moreau.designbykiara.com/DSC_7744.JPG",
  "https://leonie-moreau.designbykiara.com/DSC_7854.JPG",
] as const satisfies readonly string[];

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  eyebrow: string;
  introduction: string;
  details: string[];
  price: string;
  /** Entry price in GBP, for schema.org Offer. Keep in sync with `price`. */
  priceFrom: number;
  priceNote: string;
  images: string[];
};

export const services: Service[] = [
  {
    slug: "photo-shoot",
    name: "Photo Shoot",
    shortDescription: "Portraits & personal stories",
    eyebrow: "Portrait sessions",
    introduction:
      "Relaxed portrait sessions shaped around you, your story and the way you want to be seen.",
    details: [
      "A preparation call and visual direction",
      "A relaxed session in Edinburgh, Paris or on location",
      "A curated gallery of fully edited high-resolution images",
    ],
    price: "From £250 / €290",
    priceFrom: 250,
    priceNote: "Final quote depends on location, duration and image usage.",
    images: [galleryImages[0], galleryImages[4], galleryImages[6]],
  },
  {
    slug: "weddings",
    name: "Weddings",
    shortDescription: "Honest, editorial wedding stories",
    eyebrow: "Wedding photography",
    introduction:
      "Editorial images with real feeling — the atmosphere, the people and all the moments in between.",
    details: [
      "A planning call and tailored photography timeline",
      "Coverage from intimate ceremonies to full wedding days",
      "A private online gallery with print-ready photographs",
    ],
    price: "From £1,450 / €1,690",
    priceFrom: 1450,
    priceNote: "Elopements and shorter coverage are quoted separately.",
    images: [galleryImages[1], galleryImages[2], galleryImages[8]],
  },
  {
    slug: "events",
    name: "Events",
    shortDescription: "Brand & private events",
    eyebrow: "Brand & private events",
    introduction:
      "Distinctive event coverage for brands, cultural projects and private celebrations.",
    details: [
      "Pre-event briefing and a clear shot list",
      "Documentary coverage with polished editorial portraits",
      "A fast-turnaround gallery ready for press, social and print",
    ],
    price: "From £350 / €410",
    priceFrom: 350,
    priceNote: "Half-day, full-day and recurring brand coverage available.",
    images: [galleryImages[3], galleryImages[5], galleryImages[7]],
  },
];

export const prints = [
  {
    title: "Blue Hour",
    image: galleryImages[0],
    price: "From £65 / €75",
  },
  {
    title: "Afterlight",
    image: galleryImages[3],
    price: "From £65 / €75",
  },
  {
    title: "Sunday",
    image: galleryImages[5],
    price: "From £75 / €85",
  },
  {
    title: "Still Life",
    image: galleryImages[7],
    price: "From £65 / €75",
  },
  {
    title: "Night Study",
    image: galleryImages[8],
    price: "From £75 / €85",
  },
  {
    title: "In Motion",
    image: galleryImages[2],
    price: "From £65 / €75",
  },
];
