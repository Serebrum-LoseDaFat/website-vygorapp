import { Hero } from "@/components/Hero";
import { AiModules } from "@/components/AiModules";
import { WhyVygor } from "@/components/WhyVygor";
import { OneApp } from "@/components/OneApp";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Personalization } from "@/components/Personalization";
import { EmotionalBenefit } from "@/components/EmotionalBenefit";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { DownloadCta } from "@/components/DownloadCta";
import { JsonLd } from "@/components/JsonLd";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Hero />
      {/* #features — the six tools, click-to-switch. */}
      <AiModules />
      <WhyVygor />
      <OneApp />
      {/* #how-it-works */}
      <HowItWorks />
      <ProductShowcase />
      {/* #why-ai — hyper-personalization. */}
      <Personalization />
      <EmotionalBenefit />
      {/* Renders only when real reviews exist in content/testimonials.ts. */}
      <Testimonials />
      {/* #pricing */}
      <Pricing />
      {/* #faq */}
      <Faq />
      {/* #contact */}
      <Contact />
      {/* The single closing CTA. */}
      <DownloadCta />
    </>
  );
}
