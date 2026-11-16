import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import {
  AgentPrompt,
  Benchmark,
  FinalCta,
  HowItWorks,
  Stats,
  Scenarios,
  Status,
  Vocabulary,
  WorksWith,
} from "@/components/sections";

export default function PattieLanding() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <WorksWith />
        <Stats />
        <Scenarios />
        <HowItWorks />
        <Benchmark />
        <Vocabulary />
        <Status />
        <AgentPrompt />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
