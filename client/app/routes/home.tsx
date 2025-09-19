import StorySection from "../components/Story";
import HeroDetails from "../components/Hero";

export default function Index() {
  return (
    <>
      <div id="hero">
        <HeroDetails />
      </div>
      <div id="story">
        <StorySection />
      </div>
    </>
  );
}
