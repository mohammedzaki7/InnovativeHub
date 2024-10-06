import { useState } from "react";
import classes from "./Comment.module.css";

export default function Comment({ type, itemId, comments, onNewComment }) {
  const [newComment, setNewComment] = useState(""); // State to hold the new comment
  const [errorMessage, setErrorMessage] = useState("");
  const handleAddComment = async () => {
    setErrorMessage("");
    const comment = {
      comment: newComment,
    };
    const response = await fetch(
      "http://localhost:3000/" + type + "-add-comment/" + itemId,
      {
        method: "POST",
        body: JSON.stringify(comment),
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtbWVkemFraTJAeWFob28uY29tIiwidXNlcklkIjoiNjZhODRmOWUwMWI1ZjcxZDNiOTkyYmZjIiwiaWF0IjoxNzI4MjA4NDc1LCJleHAiOjE3MjgyNDQ0NzV9.1dZ20wBnXxq78_WuEx16uzwVXBhj90IjjwWSjkr_WRg",
        },
      }
    );
    if (response.status === 401) {
      setErrorMessage("You are not logged in!");
      return;
    }
    if (response.status === 404) {
      setErrorMessage("Application is not found!");
      return;
    }
    if (!response.ok) {
      setErrorMessage("Unable to post the comment");
      return;
    }
    const newCommentData = await response.json(); // Assuming the new comment data is returned in response

    onNewComment(newCommentData); // Update the parent state with the new comment
    setNewComment(""); // Clear input field
  };

  return (
    <>
      <h3>Comments</h3>
      {comments && comments.length > 0 ? (
        <div className={classes.commentsWrapper}>
          {comments.map((comment, index) => (
            <div key={index} className={classes.comment}>
              <span className={classes.commentUserMail}>
                {comment.userMail}
              </span>
              <span className={classes.commentDate}>
                {new Date(comment.date).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long", // Full month name like "October"
                  day: "numeric", // Day of the month
                  hour: "2-digit", // 2-digit hour
                  minute: "2-digit", // 2-digit minute
                  hour12: true, // Use 12-hour format (e.g., AM/PM)
                })}
              </span>
              <span className={classes.commentText}>{comment.comment}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No comments yet</p>
      )}
      {/* Add comment input */}
      <textarea
        className={classes.commentInput}
        placeholder="Add a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button className={classes.submitComment} onClick={handleAddComment}>
        Submit
      </button>
      {errorMessage && (
        <div className={classes["error-message"]}>
          <h3>{errorMessage}</h3>
        </div>
      )}
    </>
  );
}
