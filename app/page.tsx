import { AboutSection } from "./_components/home/AboutSection";
import { ClosingSection } from "./_components/home/ClosingSection";
import { HeroSection } from "./_components/home/HeroSection";
import { ProjectsSection } from "./_components/home/ProjectsSection";
import { SiteFooter } from "./_components/home/SiteFooter";
import { SiteHeader } from "./_components/home/SiteHeader";

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <ProjectsSection />
        <AboutSection />
        <ClosingSection />
      </main>
      <SiteFooter />
    </div>
  );
}
