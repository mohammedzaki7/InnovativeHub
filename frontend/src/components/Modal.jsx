import React, { useState, useEffect } from "react";
import classes from "./Modal.module.css";
import { Link, json } from "react-router-dom";

const Modal = ({ isOpen, onClose, imageUrl, title, invest, itemId }) => {
  const [amountToInvest, setAmountToInvest] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showLoginLink, setShowLoginLink] = useState(false);

  // Reset the error and success messages when the modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(""); // Clear the error message when the modal opens
      setSuccessMessage(""); // Clear the success message when the modal opens
      setAmountToInvest(""); // Optionally clear the input as well
      setShowLoginLink(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInvest = async () => {
    // Confirm with the user before proceeding with the investment
    const confirmed = window.confirm(
      `Are you sure you want to invest ${amountToInvest} in ${title}?`
    );
    if (!confirmed) {
      return; // If the user cancels, exit the function
    }

    const amountToInvestInItem = { amountToInvest: parseFloat(amountToInvest) }; // Parse the value to ensure it's a number
    const response = await fetch("http://localhost:3000/invest/" + itemId, {
      method: "POST",
      body: JSON.stringify(amountToInvestInItem),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vaGFtbWVkemFraTJAeWFob28uY29tIiwidXNlcklkIjoiNjZhODRmOWUwMWI1ZjcxZDNiOTkyYmZjIiwiaWF0IjoxNzI4MjA4NDc1LCJleHAiOjE3MjgyNDQ0NzV9.1dZ20wBnXxq78_WuEx16uzwVXBhj90IjjwWSjkr_WRg",
      },
    });

    if (response.status === 422) {
      setErrorMessage(
        "Please make sure that you enter a number greater than 0"
      );
      return;
    }

    if (response.status === 401) {
      setShowLoginLink(true);
      setErrorMessage("You are not logged in to invest");
      return;
    }

    if (response.status === 404 || response.status === 400) {
      const errorData = await response.json();
      setErrorMessage(errorData.message);
      return errorData;
    }

    if (!response.ok) {
      // console.log("hii");
      // throw json({ message: "Could not invest in the application" }, { status: "500" });
      setErrorMessage("Could not invest in this application");
      return;
    }

    // If the investment is successful, show a success message
    setSuccessMessage(
      `You have successfully invested ${amountToInvest}$ in ${title}!`
    );
    setAmountToInvest(""); // Clear the input after investing
    setErrorMessage(""); // Clear any error message
    // onClose(); // Optionally close the modal after a successful investment
  };

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div
        className={`${classes.modal} ${classes.investModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        {invest ? (
          <div className={classes.investContainer}>
            <h2>Invest in {title}</h2>
            <label htmlFor="amountToInvest" className={classes.label}>
              Amount to Invest:
            </label>
            <input
              id="amountToInvest"
              type="number"
              name="amountToInvest"
              value={amountToInvest}
              onChange={(e) => setAmountToInvest(e.target.value)}
              placeholder="Enter amount to invest"
              className={classes.input}
            />
            <button onClick={handleInvest} className={classes.investButton}>
              Invest
            </button>
            {errorMessage && (
              <div className={classes["error-message"]}>
                <h3>{errorMessage}</h3>
                {showLoginLink && <Link to="/login">Login</Link>}
              </div>
            )}
            {successMessage && (
              <div className={classes["success-message"]}>
                <h3>{successMessage}</h3>
              </div>
            )}
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Enlarged"
            className={classes.enlargedImage}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
