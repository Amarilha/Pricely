import React from "react"
import Header from "@/components/site/header"
import HeroContent from "@/components/site/hero-content"
import ShaderBackground from "@/components/site/shader-background"

export function HeroSection() {
  return (
    <ShaderBackground>
      <Header />
      <HeroContent />
    </ShaderBackground>
  )
}
