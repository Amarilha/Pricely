import { HeroSection } from "@/components/site/hero-section"
import { FeaturesSection } from "@/components/site/features-section"
import { TestimonialsSection } from "@/components/site/testimonials-section"
import { PricingPreviewSection } from "@/components/site/pricing-preview-section"
import { PartnersSection } from "@/components/site/partners-section"
import { CTASection } from "@/components/site/cta-section"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { PricingSection } from "@/components/site/pricing-section"
import { DashboardPreview } from "@/components/site/dashboard-preview"
import { BentoSection } from "@/components/site/bento-section"
import { AnimatedSection } from "@/components/site/animated-section"
import { FooterSection } from "@/components/site/footer-section"
import { SocialProof } from "@/components/site/social-proof"
import type { Metadata } from "next/types"

export default function HomePage() {
  return (
    // Adicione a classe 'dark' no div principal
    <div className="min-h-screen bg-background relative overflow-hidden pb-0 dark">
      <div className="relative z-10">
        <main className="max-w-auto mx-auto relative">
          <HeroSection />
          {/* Dashboard Preview Wrapper */}
          <div className="absolute bottom-[-150px] md:bottom-[-400px] left-1/2 transform -translate-x-1/2 z-30">
            <AnimatedSection>
              <DashboardPreview />
            </AnimatedSection>
          </div>
        </main>
        <AnimatedSection id="features-section" className="relative z-10 max-w-[1320px] mx-auto px-6 mt-[411px] md:mt-[400px]" delay={0.2}>
          <BentoSection />
        </AnimatedSection>
        <AnimatedSection
          id="pricing-section"
          className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16"
          delay={0.2}
        >
          <PricingSection />
        </AnimatedSection>
        <AnimatedSection id="faq-section" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <CTASection />
        </AnimatedSection>
      </div>
      <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <FooterSection />
      </AnimatedSection>
    </div>

  )
}