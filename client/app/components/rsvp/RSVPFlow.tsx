import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import SideSelection from "./SideSelection";
import GuestDetailsForm from "./GuestDetailsForm";
import SubmissionStatus from "./SubmissionStatus";
import LoadingSpinner from "./LoadingSpinner"; // A new component for loading state

// Define a type for the category metadata we expect from the API
interface CategoryMeta {
  name: string;
  side: string;
  remainingGuests: number;
}

export default function RSVPFlow() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [categoryMeta, setCategoryMeta] = useState<CategoryMeta | null>(null);
  const [rsvpData, setRsvpData] = useState({
    token: "",
    status: "",
    error: "",
  });

  // This effect now handles fetching category data for token-based RSVPs
  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      setRsvpData((prev) => ({ ...prev, token }));

      const fetchCategoryMeta = async () => {
        try {
          // Call your new Go backend endpoint
          const response = await fetch(
            `http://localhost:8091/api/rsvp/meta?token=${token}`,
          );
          if (!response.ok) {
            throw new Error("Invitation not found.");
          }
          const data: CategoryMeta = await response.json();
          setCategoryMeta(data);
          setStep(2); // Move to the form step
        } catch (error: any) {
          setRsvpData((prev) => ({
            ...prev,
            status: "ERROR",
            error: error.message,
          }));
          setStep(3);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategoryMeta();
    } else {
      setIsLoading(false); // No token, so we are not loading anything
      setStep(1); // Start with side selection
    }
  }, [searchParams]);

  const handleSideSelect = (side: "BRIDE" | "GROOM") => {
    setCategoryMeta({ name: `${side}'s Guest`, side, remainingGuests: 0 }); // Create placeholder meta
    setStep(2);
  };

  const handleFormSubmit = (apiResponse: {
    status?: string;
    error?: string;
  }) => {
    if (apiResponse.error) {
      setRsvpData((prev: any) => ({
        ...prev,
        status: "ERROR",
        error: apiResponse.error,
      }));
    } else {
      setRsvpData((prev) => ({
        ...prev,
        status: apiResponse.status || "ERROR",
        error: "",
      }));
    }
    setStep(3);
  };

  const handleTryAgain = () => {
    // This logic can be simplified as the useEffect will handle the reset
    window.location.reload();
  };

  const renderStep = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    switch (step) {
      case 1:
        return <SideSelection onSelect={handleSideSelect} />;
      case 2:
        return (
          <GuestDetailsForm
            onSubmit={handleFormSubmit}
            token={rsvpData.token}
            categoryName={categoryMeta?.name} // Pass the category name to the form
            side={categoryMeta?.side}
          />
        );
      case 3:
        return (
          <SubmissionStatus
            status={rsvpData.status}
            errorMessage={rsvpData.error}
            onTryAgain={handleTryAgain}
          />
        );
      default:
        return <SideSelection onSelect={handleSideSelect} />;
    }
  };

  return <div className="rsvp-container">{renderStep()}</div>;
}
