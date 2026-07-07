import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { HowItWorks } from "@/components/home/HowItWorks";
import { SampleHeroes } from "@/components/home/SampleHeroes";
import { Partners } from "@/components/home/Partners";
import { Sponsors } from "@/components/home/Sponsors";
import { CtaStrip } from "@/components/home/CtaStrip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <HowItWorks />
      <SampleHeroes />
      <Partners />
      <Sponsors />
      <CtaStrip />
    </>
  );
}
