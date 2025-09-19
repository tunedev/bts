import { Outlet, Link } from "react-router";

export default function RSVPPageFrame() {
  return (
    <main className="main-container rsvp-layout">
      <div
        className="left-panel rsvp-left-panel"
        style={{
          backgroundImage: `url('/images/rsvp-background.jpg')`,
        }}
      >
        <Link to="/" className="home-logo-link">
          BTS
        </Link>

        <div className="left-panel-content">
          <h1>Join Us</h1>
          <p>
            Your presence is the greatest gift of all. Please let us know if you
            can make it.
          </p>
        </div>
      </div>

      <div className="right-panel rsvp-right-panel">
        <Outlet />
      </div>
    </main>
  );
}
