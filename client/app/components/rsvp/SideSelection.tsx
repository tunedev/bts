import React from "react";

interface Props {
  onSelect: (side: "BRIDE" | "GROOM") => void;
}

export default function SideSelection({ onSelect }: Props) {
  return (
    <div className="rsvp-step">
      <h2 className="rsvp-title">Are you with the Bride or Groom?</h2>
      <div className="side-selection-buttons">
        <button onClick={() => onSelect("BRIDE")} className="rsvp-button bride">
          Bride's Side
        </button>
        <button onClick={() => onSelect("GROOM")} className="rsvp-button groom">
          Groom's Side
        </button>
      </div>
    </div>
  );
}
