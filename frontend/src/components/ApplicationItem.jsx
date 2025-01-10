import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import classes from "./Item.module.css";
import Modal from "./Modal"; // Import the Modal component
import Comment from "./Comment";
import { useRouteLoaderData, json, useNavigate } from "react-router-dom";
import Vote from "./Vote";
import { MdEdit } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { getAuthToken } from "../util/auth";

export default function ApplicationItem({ application, onAddToCart }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [invest, setInvest] = useState(false);
  const [comments, setComments] = useState(application.comments);
  const [investsAmount, setInvestsAmount] = useState(application.investments);
  const [votes, setVotes] = useState(application.votes); // Track votes
  const token = useRouteLoaderData("root");

  const navigate = useNavigate(); // Add useNavigate

  let userId;
  if (token) {
    // Decode token to get user ID
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId; // Assuming the token has a userId field
  }
  const formattedDate = application.expectedReleaseDate
    ? new Date(application.expectedReleaseDate).toLocaleDateString()
    : "TBA";

  const openModal = (index) => {
    if (index !== undefined) {
      setCurrentImageIndex(index);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInvest(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % application.imagesUrl.length
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + application.imagesUrl.length) %
        application.imagesUrl.length
    );
  };

  // Function to update the comments after adding a new comment
  const handleUpdateComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/application/${application._id}`
      );
      const response_json = await response.json();
      const updatedComments = response_json.application.comments;
      setComments(updatedComments); // Update the comments state with fresh data from the backend
    } catch (error) {
      console.error("Failed to fetch updated comments:", error);
    }
  };

  // Function to update the invests after adding a new invests
  const handleUpdateInvests = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/application/${application._id}`
      );
      const response_json = await response.json();
      const updatedInvests = response_json.application.investments;
      setInvestsAmount(updatedInvests); // Update the comments state with fresh data from the backend
    } catch (error) {
      console.error("Failed to fetch updated comments:", error);
    }
  };

  const handleVoteUpdate = (updatedVotes) => {
    setVotes(updatedVotes);
  };

  const handleEditApplication = () => {
    navigate("/applications/edit/" + application._id);
  };
  const handleDeleteApplication = async () => {
    setErrorMessage("");
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (isConfirmed) {
      try {
        const authToken = getAuthToken();
        const response = await fetch(
          "http://localhost:3000/admin/delete-application/" + application._id,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (
          response.status === 403 ||
          response.status === 404 ||
          response.status === 401
        ) {
          const errorData = await response.json(); // Parse the response body
          setErrorMessage(errorData.message);
          return errorData;
        }
        if (!response.ok) {
          throw json(
            { message: `Could not delete for application` },
            { status: "500" }
          );
        }
        navigate("/");
      } catch (error) {
        console.error("Error submitting vote:", error);
      }
    }
  };

  // Clear error message on any interaction
  const handleInteraction = () => {
    setErrorMessage("");
  };

  return (
    <div className={classes.container} onClick={handleInteraction}>
      <div className={classes.images}>
        {application.imagesUrl && application.imagesUrl.length > 0 ? (
          <div className={classes.imageRoll}>
            <button onClick={handlePreviousImage} className={classes.arrow}>
              &#9650; {/* Up arrow */}
            </button>
            <div className={classes.imageContainer}>
              {application.imagesUrl.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`image-${index}`}
                  className={`${classes.image} ${
                    index === currentImageIndex ? classes.activeImage : ""
                  }`}
                  onClick={() => openModal(index)}
                  style={{ zIndex: index === currentImageIndex ? 10 : 1 }}
                />
              ))}
            </div>
            <button onClick={handleNextImage} className={classes.arrow}>
              &#9660; {/* Down arrow */}
            </button>
          </div>
        ) : (
          <div>No images available</div>
        )}
      </div>

      <div className={classes.content}>
        <div className={classes.titleContainer}>
          <h2 className={classes.title}>{application.title}</h2>
          {application.owner._id === userId && (
            <div className={classes.icons}>
              <MdEdit
                className={classes.icon}
                onClick={handleEditApplication}
              />
              <FaTrashAlt
                className={`${classes.icon} ${classes["icon-delete"]}`}
                onClick={handleDeleteApplication}
              />
            </div>
          )}
        </div>

        <p className={classes.description}>{application.description}</p>

        <div className={classes.properties}>
          <p className={classes.property}>
            <strong>Votes: </strong>
            {votes}
          </p>
          <p className={classes.property}>
            <strong>Price:</strong> {application.price}$
          </p>
          <p className={classes.property}>
            <strong>Investments: </strong>
            {investsAmount}$
          </p>
          <p className={classes.property}>
            <strong>Maximum amount for investment: </strong>
            {application.maxInvestments}$
          </p>
          <p className={classes.property}>
            <strong>Percentage of revenue shared among all investors: </strong>
            {application.percentageGivenAway}
          </p>
          {application.released ? (
            <p className={classes.property}>
              <strong>Application is currently available</strong>
            </p>
          ) : (
            <p className={classes.property}>
              <strong>Available from: </strong>
              {formattedDate}
            </p>
          )}
          <p className={classes.property}>
            <strong>Additional Info: </strong>
            {application.additionalInfo || "N/A"}
          </p>
          <p className={classes.property}>
            <strong>Owner: </strong>
            {application.owner.name}
          </p>
          <div className={classes.property}>
            <strong>Developers: </strong>
            {application.developers.map((developer, index) => (
              <p className={classes.property} key={index}>
                {developer.name}
              </p>
            ))}
          </div>
        </div>

        {token && (
          <div className={classes.buttons}>
            <button
              className={classes.addToCartButton}
              onClick={() => onAddToCart(application)}
            >
              Add to Cart
            </button>
            <button
              className={classes.investButton}
              onClick={() => {
                setInvest(true);
                openModal(currentImageIndex);
              }}
            >
              Invest
            </button>
          </div>
        )}
      </div>

      <div className={classes.comments}>
        {/* Star for voting */}
        {token && (
          <>
            <Vote
              item={application}
              onVote={handleVoteUpdate}
              type="application"
            />
          </>
        )}

        <Comment
          type="application"
          itemId={application._id}
          comments={comments}
          onNewComment={handleUpdateComments}
        />
      </div>

      {/* Modal for Enlarged Image */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={application.imagesUrl[currentImageIndex]}
        title={application.title}
        invest={invest}
        itemId={application._id}
        handleUpdateInvests={handleUpdateInvests}
      />

      <div>{errorMessage ? <p role="alert">{errorMessage}</p> : ""}</div>
    </div>
  );
}
