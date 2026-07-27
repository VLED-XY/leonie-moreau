import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Services } from "@/components/Services"
import { Impressions } from "@/components/Impressions"
import { Contact } from "@/components/Contact"
import type { Metadata } from "next";
import { DEFAULT_DESCRIPTION, pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero />
      <About />
      <Services />
      <Impressions />
      <Contact />
    </main>
  );
}
