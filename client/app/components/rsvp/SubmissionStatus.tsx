interface Props {
  status: string;
  errorMessage?: string;
  onTryAgain: () => void;
}

export default function SubmissionStatus({
  status,
  errorMessage,
  onTryAgain,
}: Props) {
  const isApproved = status === "APPROVED";
  const isPending = status === "PENDING";
  const isError = status === "ERROR";

  return (
    <div className="rsvp-step submission-status">
      {isApproved && (
        <>
          <div className="status-icon success">✓</div>
          <h2 className="rsvp-title">RSVP Confirmed!</h2>
          <p>
            Thank you! Your spot is confirmed. We can't wait to celebrate with
            you.
          </p>
        </>
      )}
      {isPending && (
        <>
          <div className="status-icon pending">…</div>
          <h2 className="rsvp-title">We've Received Your RSVP</h2>
          <p>
            Thank you! Your RSVP is pending approval. We'll notify you via
            email/SMS once it's confirmed.
          </p>
        </>
      )}
      {isError && (
        <>
          <div className="status-icon error">!</div>
          <h2 className="rsvp-title">Something Went Wrong</h2>
          <p className="status-error-message">
            {errorMessage || "We couldn't process your RSVP. Please try again."}
          </p>
          <button onClick={onTryAgain} className="rsvp-button">
            Try Again
          </button>
        </>
      )}
    </div>
  );
}
