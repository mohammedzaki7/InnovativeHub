import { useState, useEffect } from "react";
import classes from "./Vote.module.css";
import { getAuthToken } from "../util/auth";

export default function Vote({ item, onVote, type }) {
  const [isVotted, setIsVotted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVoteStatus = async () => {
      const voted = await checkIfAlreadyVoted();
      setIsVotted(voted); // Update the state with the result
    };
    fetchVoteStatus();
  }, [item._id]); // Dependency array to re-fetch if application changes

  // Handle vote submission
  const handleVote = async () => {
    setErrorMessage("");
    try {
      let votingDetails = {};
      if (type === "application") {
        votingDetails = {
          itemType: "Application",
          itemId: item._id,
        };
      } else if (type === "project") {
        votingDetails = {
          itemType: "Project",
          itemId: item._id,
        };
      }
      const authToken = getAuthToken();
      const response = await fetch(`http://localhost:3000/vote`, {
        method: "POST", // Assuming you use POST for voting
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Send token for authentication
        },
        body: JSON.stringify(votingDetails), // Payload (vote increment)
      });
      const result = await response.json();
      console.log(result);
      if (response.status === 404) {
        setErrorMessage(result.message);
        // console.log(result);
      }
      if (!response.ok) {
        throw json(
          { message: `Could not vote for ${type}` },
          { status: "500" }
        );
      }
      setIsVotted((prev) => !prev);
      // Call the onVote function passed from ApplicationItem
      onVote(result.votes);
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const checkIfAlreadyVoted = async () => {
    const authToken = getAuthToken();
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:3000/auth/", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      });
      const result = await response.json();
      if (response.status === 404) {
        setErrorMessage(`${type} is not found`);
      }
      if (!response.ok) {
        throw new Error(`Could not vote for ${type}`);
      }
      let votes;
      if (type === "application") {
        votes = result.user.votes.applications;
      } else if (type === "project") {
        votes = result.user.votes.projects;
      }
      // Check if the application._id exists in the votes array
      let hasVoted;
      if (type === "application") {
        hasVoted = votes.some((vote) => vote.applicationId === item._id);
      } else if (type === "project") {
        hasVoted = votes.some((vote) => vote.projectId === item._id);
      }
      return hasVoted;
    } catch (error) {
      console.error("Error submitting vote:", error);
      return false; // Handle the error case appropriately
    }
  };

  return (
    <>
      <div
        className={isVotted ? classes["star-voted"] : classes["star-not-voted"]}
        onClick={async () => await handleVote()} // await checkIfAlreadyVoted(); }
      >
        ★ {/* Star icon */}
      </div>
      {errorMessage && <p>{errorMessage}</p>}
    </>
  );
}
