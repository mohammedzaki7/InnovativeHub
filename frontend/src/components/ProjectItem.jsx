import { useState } from "react";
import { useRouteLoaderData } from "react-router-dom";
import classes from "./Item.module.css";
import Vote from "./Vote";
import Modal from "./Modal"; // Import the Modal component
import Comment from "./Comment";


export default function ProjectItem({ project, onAddToCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState(project.comments);
  const [votes, setVotes] = useState(project.votes); // Track votes
  const token = useRouteLoaderData("root");

  const formattedDate = project.expectedReleaseDate
    ? new Date(project.expectedReleaseDate).toLocaleDateString()
    : "TBA";

  const openModal = (index) => {
    if (index !== undefined) {
      setCurrentImageIndex(index);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % project.imagesUrl.length
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + project.imagesUrl.length) % project.imagesUrl.length
    );
  };

  // Function to update the comments after adding a new comment
  const handleUpdateComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/project/${project._id}`
      );
      const response_json = await response.json();
      const updatedComments = response_json.project.comments;
      setComments(updatedComments); // Update the comments state with fresh data from the backend
    } catch (error) {
      console.error("Failed to fetch updated comments:", error);
    }
  };

  const handleVoteUpdate = (updatedVotes) => {
    setVotes(updatedVotes);
  };

  return (
    <div className={classes.container}>
      <div className={classes.images}>
        {project.imagesUrl && project.imagesUrl.length > 0 ? (
          <div className={classes.imageRoll}>
            <button onClick={handlePreviousImage} className={classes.arrow}>
              &#9650; {/* Up arrow */}
            </button>
            <div className={classes.imageContainer}>
              {project.imagesUrl.map((imageUrl, index) => (
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
        <h2 className={classes.title}>{project.title}</h2>
        <p className={classes.description}>{project.description}</p>

        <div className={classes.properties}>
          <p className={classes.property}>
            <strong>Votes: </strong>
            {votes}
          </p>
          <p className={classes.property}>
            <strong>Price:</strong> {project.price}$
          </p>

          {project.forSell ? (
            <p className={classes.property}>
              <strong>This project is available for selling</strong>
            </p>
          ) : (
            <p className={classes.property}>
              <strong>This project is not available for selling</strong>
            </p>
          )}

          <p className={classes.property}>
            <strong>Additional Info: </strong>
            {project.additionalInfo || "N/A"}
          </p>
          <p className={classes.property}>
            <strong>Owner: </strong>
            {project.owner.name}
          </p>
          <div className={classes.property}>
            <strong>Worker: </strong>
            {project.workers.map((worker, index) => (
              <p className={classes.property} key={index}>
                {worker.name}
              </p>
            ))}
          </div>
        </div>

        {token && (
          <div className={classes.buttons}>
            <button
              className={classes.addToCartButton}
              onClick={() => onAddToCart(project)}
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
      <div className={classes.comments}>
        {/* Star for voting */}
        {token && (
          <>
            <Vote item={project} onVote={handleVoteUpdate} type="project" />
          </>
        )}

        <Comment
          type={"project"}
          itemId={project._id}
          comments={comments}
          onNewComment={handleUpdateComments}
        />
      </div>

      {/* Modal for Enlarged Image */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={project.imagesUrl[currentImageIndex]}
        title={project.title}
        itemId={project._id}
      />
    </div>
  );
}
