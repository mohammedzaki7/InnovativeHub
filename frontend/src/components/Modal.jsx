import React, { useState, useEffect } from "react";
import classes from "./Modal.module.css";
import { Link, json } from "react-router-dom";
import Invest from "./Invest";
const Modal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  invest,
  itemId,
  handleUpdateInvests,
}) => {
  if (!isOpen) return null;

  return (
    <div className={classes.overlay} onClick={onClose}>
      <div
        className={`${classes.modal} ${classes.investModal}`}
        onClick={(e) => e.stopPropagation()}
      >
        {invest ? (
          <Invest
            isOpen={isOpen}
            itemId={itemId}
            title={title}
            handleUpdateInvests={handleUpdateInvests}
          />
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
