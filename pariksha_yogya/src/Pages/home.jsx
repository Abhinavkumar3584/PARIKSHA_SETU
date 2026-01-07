import { Hero } from "@/components/Hero/hero";
import InfinityImgScroll from "@/components/Infinityimgscroll/infinityimgscroll";
// import FeatureSection from "@/components/Featurecards/cardscontent";
import InfinityExams from "@/components/Infinityexams/infinityexams";
import FAQS from "@/components/FAQS/faqs";
import Footer from "@/components/Footer/footer";
import { GlowingEffectDemo } from "../components/Featurecards/cardscontent";
import StatsAnalytics from "@/components/Stat/stat";

function Home() {
  return (
    <>
      <div className="w-full mx-0 px-0">
        <Hero />
      </div>

      <div>
        <StatsAnalytics/>
      </div>

      <div>
        <InfinityImgScroll />
      </div>

      <div className="w-full p-4 m-auto overflow-hidden">
        <GlowingEffectDemo />
      </div>

      <div className="w-full mx-0 px-0">
        <InfinityExams />
      </div>

      <div className="w-full p-4 pb-0 pt-0 m-auto">
        <FAQS />
      </div>

      <div className="w-full p-4 pt-0 m-auto">
        <Footer />
      </div>
    </>
  );
}

export default Home;