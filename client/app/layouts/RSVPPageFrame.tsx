import React from "react";
import { Outlet, Link } from "react-router";
import RSVPFlow from "../components/rsvp/RSVPFlow"; // Import the RSVPFlow component
import useWindowSize from "../hooks/useWindowSize"; // Import the window size hook

export default function RSVPPageFrame() {
  const { width } = useWindowSize();
  const isMobile = width <= 900;

  return (
    <main className="main-container rsvp-layout">
      <div
        className="left-panel rsvp-left-panel"
        style={{ backgroundImage: `url('/images/rsvp-background.jpg')` }}
      >
        <Link to="/" className="home-logo-link">
          BTS
        </Link>

        {isMobile ? (
          <div className="mobile-rsvp-form-container">
            <RSVPFlow />
          </div>
        ) : (
          <div className="left-panel-content">
            <h1>Join Us</h1>
            <p>
              Your presence is the greatest gift of all. Please let us know if
              you can make it.
            </p>
          </div>
        )}
      </div>

      <div className="right-panel rsvp-right-panel">
        <Outlet />
      </div>
    </main>
  );
}
