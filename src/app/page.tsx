import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Services } from "@/components/Services"
import { Impressions } from "@/components/Impressions"
import { Contact } from "@/components/Contact"

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
