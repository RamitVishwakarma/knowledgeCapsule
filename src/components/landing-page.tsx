"use client";

import { signIn } from "next-auth/react";
import { appRoutes } from "@/utils/routes/routes";
import { NavBar } from "@/components/landing/nav-bar";
import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { QuoteSection } from "@/components/landing/quote-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export function LandingPage() {
  const handleSignIn = () => {
    signIn("google", { callbackUrl: appRoutes.dashboard });
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      <NavBar onSignIn={handleSignIn} />
      <HeroSection onSignIn={handleSignIn} />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <QuoteSection />
      <CTASection onSignIn={handleSignIn} />
      <Footer />
    </div>
  );
}
