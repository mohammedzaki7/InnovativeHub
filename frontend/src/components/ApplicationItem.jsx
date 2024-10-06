import { useState } from "react";
import classes from "./Item.module.css";
import Modal from "./Modal"; // Import the Modal component
import Comment from "./Comment";

export default function ApplicationItem({ application, onAddToCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [invest, setInvest] = useState(false);
  const [comments, setComments] = useState(application.comments);

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
  const handleUpdateComments = async() => {
    try {
      const response = await fetch(`http://localhost:3000/application/${application._id}`);
      const response_json = await response.json();
      const updatedComments = response_json.application.comments;
      setComments(updatedComments); // Update the comments state with fresh data from the backend
    } catch (error) {
      console.error("Failed to fetch updated comments:", error);
    }
  };

  return (
    <div className={classes.container}>
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
        <h2 className={classes.title}>{application.title}</h2>
        <p className={classes.description}>{application.description}</p>
        <p className={classes.price}>
          <strong>Price:</strong> {application.price}$
        </p>
        <p className={classes.investments}>
          <strong>Investments: </strong>
          {application.investments}$
        </p>
        <p className={classes.votes}>
          <strong>Votes: </strong>
          {application.votes}
        </p>
        <p className={classes.releaseDate}>
          <strong>Available from: </strong>
          {formattedDate}
        </p>
        <p className={classes.additionalInfo}>
          <strong>Additional Info: </strong>
          {application.additionalInfo || "N/A"}
        </p>

        {/* Centered Buttons for Add to Cart and Invest */}
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
      </div>
      <div className={classes.comments}>
        <Comment
          type={"application"}
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
      />
    </div>
  );
}
