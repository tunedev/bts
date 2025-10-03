import { useState, useEffect } from "react";

const weddingDate = new Date("2025-11-22T00:00:00+01:00");
const oneWeekBefore = new Date(weddingDate);
oneWeekBefore.setDate(weddingDate.getDate() - 7);

export default function HeroDetails() {
  const [timeLeft, setTimeLeft] = useState(() => getDiffTime(weddingDate));
  const isCloseToWedding = new Date() > oneWeekBefore;

  useEffect(() => {
    const timer = setInterval(() => {}, 1000);
    setTimeLeft(getDiffTime(weddingDate));

    return () => clearInterval(timer);
  });
  return (
    <section className="content-section hero-details-container">
      <img
        src="/images/hero-greenery.webp"
        alt=""
        className="hero-background-artwork"
      />

      <div className="hero-content">
        <h2 className="event-date">Saturday, November 22, 2025</h2>
        <p className="event-location">
          Nelo's Place Events Center, <br />
          Mobolaji Bank Anthony Way, Ikeja, Nigeria
        </p>
        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">DAYS</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.hours}</span>
            <span className="countdown-label">HRS</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.minutes}</span>
            <span className="countdown-label">MINS</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.seconds}</span>
            <span className="countdown-label">SECS</span>
          </div>
        </div>
        {isCloseToWedding ? (
          <a
            href="https://www.google.com/maps/place/Nelo's+Place+Events+Center/@6.5868712,3.3535966,1519m/data=!3m2!1e3!4b1!4m6!3m5!1s0x103b9215440f7661:0xd7d5642cbc510856!8m2!3d6.5868712!4d3.3584675!16s%2Fg%2F11f1nhm7r2?entry=ttu&g_ep=EgoyMDI1MDkxNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="rsvp-button locate-butten"
          >
            Locate Venue
          </a>
        ) : (
          <a href="/rsvp" className="rsvp-button">
            RSVP
          </a>
        )}
      </div>
    </section>
  );
}

function getDiffTime(weddingDate: Date) {
  const now = new Date();
  const difference = weddingDate.getTime() - now.getTime();

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 69 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return { days, hours, minutes, seconds };
  } else {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
}
