export const homeHeroImage = "/images/home-car.jpg";

const photoShootImages = [
  "/images/photo-shoot-01.jpg",
  "/images/photo-shoot-02.jpg",
  "/images/photo-shoot-03.jpg",
  "/images/photo-shoot-04.jpg",
  "/images/photo-shoot-05.jpg",
  "/images/photo-shoot-06.jpg",
  "/images/photo-shoot-07.jpg",
  "/images/photo-shoot-08.jpg",
  "/images/photo-shoot-09.jpg",
];

const weddingImages = [
  "/images/weddings-01.jpg",
  "/images/weddings-02.jpg",
  "/images/weddings-03.jpg",
  "/images/weddings-04.jpg",
  "/images/weddings-05.jpg",
  "/images/weddings-06.jpg",
];

const eventImages = [
  "/images/events-01.jpg",
  "/images/events-02.jpg",
  "/images/events-03.jpg",
  "/images/events-04.jpg",
  "/images/events-05.jpg",
  "/images/events-06.jpg",
];

export const instagramUrl = "https://www.instagram.com/leoniem.photographer/";

export const printEnquiryService = "Print order";

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
      "A collaborative exchange to define the visual concept",
      "A relaxed session in Edinburgh, Paris or on location",
      "A curated gallery of fully edited high-resolution images",
    ],
    price: "From £150 / €175",
    priceFrom: 150,
    priceNote: "Final quote depends on location, duration and image usage.",
    images: photoShootImages,
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
    price: "From £900 / €1,050",
    priceFrom: 900,
    priceNote: "Elopements and shorter coverage are quoted separately.",
    images: weddingImages,
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
    price: "From £200 / €235",
    priceFrom: 200,
    priceNote: "Half-day, full-day and recurring brand coverage available.",
    images: eventImages,
  },
];

export const prints = [
  {
    title: "Blue Hour",
    image: "/images/prints-01.jpg",
    price: "From £65 / €75",
  },
  {
    title: "Afterlight",
    image: homeHeroImage,
    price: "From £65 / €75",
  },
  {
    title: "Sunday",
    image: "/images/prints-03.jpg",
    price: "From £75 / €85",
  },
  {
    title: "Still Life",
    image: "/images/prints-04.jpg",
    price: "From £65 / €75",
  },
  {
    title: "Night Study",
    image: "/images/prints-05.jpg",
    price: "From £75 / €85",
  },
  {
    title: "In Motion",
    image: "/images/prints-06.jpg",
    price: "From £65 / €75",
  },
];
