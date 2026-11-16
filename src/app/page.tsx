import { Compare } from "@/components/compare";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Lifecycle } from "@/components/lifecycle";
import { Nav } from "@/components/nav";
import { Faq, FinalCta, Scenarios, Status } from "@/components/sections";

export default function PattieLanding() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Lifecycle />
        <Compare />
        <Scenarios />
        <Status />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
