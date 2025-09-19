import React from "react";
import { Outlet } from "react-router";

import useImageFadeOnScroll from "../hooks/useImageFadeOnScroll";
import useWindowSize from "../hooks/useWindowSize";

const sectionImages: { [key: string]: string } = {
  hero: "/images/couple-photo-1.jpg",
  story: "/images/story-photo.jpg",
};

const sectionIds = Object.keys(sectionImages);

export default function WelcomePageFrame() {
  const [currentImage, setCurrentImage] = React.useState(sectionImages["hero"]);
  const [opacity, setOpacity] = React.useState(1);
  const { width } = useWindowSize();

  const visibleSection = useImageFadeOnScroll(sectionIds, {
    rootMargin: "-50% 0px -50% 0px",
  });

  React.useEffect(() => {
    if (width <= 900) {
      setCurrentImage(sectionImages["hero"]);
      setOpacity(1);
      return;
    }
    if (visibleSection && sectionImages[visibleSection]) {
      setOpacity(0);

      const timeoutId = setTimeout(() => {
        setCurrentImage(sectionImages[visibleSection]);
        setOpacity(1);
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [visibleSection]);
  return (
    <main className="main-container">
      <div
        className="left-panel"
        style={{
          backgroundImage: `url(${currentImage})`,
          opacity: opacity,
        }}
      >
        <div className="left-panel-content welcome-content">
          <h1>Becoming The Sanusi's</h1>
          <p>
            We can't wait to share our special day with you. Help us capture our
            wedding with Joy.
          </p>
        </div>
      </div>
      <div className="right-panel">
        <Outlet />
      </div>
    </main>
  );
}
