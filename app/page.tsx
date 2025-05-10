import { HeroSection } from "@/components/site/hero-section"
import { FeaturesSection } from "@/components/site/features-section"
import { TestimonialsSection } from "@/components/site/testimonials-section"
import { PricingPreviewSection } from "@/components/site/pricing-preview-section"
import { PartnersSection } from "@/components/site/partners-section"
import { CTASection } from "@/components/site/cta-section"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        {/* <TestimonialsSection /> */}
        <PricingPreviewSection />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  )
}
