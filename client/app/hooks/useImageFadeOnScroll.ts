import * as React from 'react'

export default function useImageFadeOnScroll(sectionIds: string[], options: IntersectionObserverInit) {
  const [visibleSection, setVisibleSection] = React.useState<string|null>(null);
  const observer = React.useRef<IntersectionObserver | null>(null)

  React.useEffect(() => {
    console.log("=====>>>>>>>>>>>>>>>",sectionIds)
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      const intersectionEntry = entries.find((entry) =>  entry.isIntersecting);

      if (intersectionEntry) {
        setVisibleSection(intersectionEntry.target.id);
      }
    }, options);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      console.log("working ===>>>>>", id, element)
      if (element) {
        observer.current?.observe(element);
      }
    })


    return () => {
      observer.current?.disconnect()
    }
  }, [sectionIds, options])

  return visibleSection;
}