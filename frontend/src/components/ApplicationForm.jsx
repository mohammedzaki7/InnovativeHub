import classes from "./Form.module.css";
import { Form, useActionData, Link, useNavigation } from "react-router-dom";
import { useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";

export default function ApplicationForm({ application }) {
  const data = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  // const [imageFiles, setImageFiles] = useState([]); // State to store the selected images
  const [existingImages, setExistingImages] = useState(
    application?.imagesUrl || []
  );
  const [newImages, setNewImages] = useState([]); // State to store new selected images
  const [isReleased, setIsReleased] = useState(false); // State to track if "released" is checked
  const fileInputRef = useRef(null); // Reference for the hidden file input
  const maxImages = 5;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > maxImages) {
      alert(`You can only upload up to ${maxImages} images in total.`);
      e.target.value = ""; // Clear the file input if limit is exceeded
      return;
    }
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReleasedChange = (e) => {
    setIsReleased(e.target.checked);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click(); // Programmatically open the file dialog
  };

  return (
    <div>
      <Form method="post" encType="multipart/form-data">
        <div className={classes.form}>
          <h2>{application ? "Edit Application" : "Create New Application"}</h2>

          <div className={classes["input-container"]}>
            <input
              id="title"
              type="text"
              name="title"
              required
              placeholder=" "
              defaultValue={application ? application.title : ""}
            />
            <label htmlFor="title">Title</label>
          </div>

          <div className={classes["input-container"]}>
            <input
              id="description"
              type="text"
              name="description"
              required
              placeholder=" "
              defaultValue={application ? application.description : ""}
            />
            <label htmlFor="description">Description</label>
          </div>

          <div className={classes["input-container"]}>
            <input
              id="price"
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              placeholder=" "
              defaultValue={application ? application.price : ""}
            />
            <label htmlFor="price">Price</label>
          </div>

          <div className={classes["input-container"]}>
            <input
              id="maxInvestments"
              type="number"
              name="maxInvestments"
              required
              min="0"
              step="0.01"
              placeholder=" "
              defaultValue={application ? application.maxInvestments : ""}
            />
            <label htmlFor="maxInvestments">Maximum Investments</label>
          </div>

          <div className={classes["input-container"]}>
            <input
              id="percentageGivenAway"
              type="number"
              name="percentageGivenAway"
              required
              min="0"
              step="0.01"
              placeholder=" "
              defaultValue={application ? application.percentageGivenAway : ""}
            />
            <label htmlFor="percentageGivenAway">Percentage Given Away</label>
          </div>

          {/* Image Upload Field */}
          {/* <div className={classes["input-container"]}>
            <input
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <label htmlFor="images">Upload Images</label>
            {/* Display the number of selected images 
            {imageFiles.length > 0 && (
              <p>{imageFiles.length} images selected</p>
            )}
            {/* Display existing image URLs if the application has any 
            {application?.imagesUrl?.length > 0 && (
              <div>
                <p>Existing Images:</p>
                <ul>
                  {application.imagesUrl.map((imageUrl, index) => (
                    <li key={index}>{imageUrl}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          */}

          {/* New Images Upload */}
          <div className={classes["input-container"]}>
            <IoMdAddCircle
              className={classes["upload-icon"]}
              onClick={triggerFileInput}
            />
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the actual file input
            />
            <label htmlFor="images">Upload Images</label>

            {/* Display New Images with Remove Option */}
            {newImages.length > 0 && (
              <div>
                <p>
                  <strong>Newly Selected Images:</strong>
                </p>
                <div className={classes["new-selected-images"]}>
                  {newImages.map((img, index) => (
                    <div key={index} className={classes["image-container"]}>
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`New image ${index + 1}`}
                      />
                      <FaTrashAlt
                        className={`${classes.icon} ${classes["icon-delete"]}`}
                        onClick={() => handleRemoveNewImage(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Existing Images Section */}
          {existingImages.length > 0 && (
            <div>
              <p>
                <strong>Existing Images:</strong>
              </p>
              <div className={classes["existing-images"]}>
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className={classes["image-container"]}>
                    <img src={imageUrl} alt={`Existing image ${index + 1}`} />
                    <FaTrashAlt
                      className={`${classes.icon} ${classes["icon-delete"]}`}
                      onClick={() => handleRemoveExistingImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {existingImages.map((imageUrl) => (
            <input
              type="hidden"
              name="existingImages"
              value={imageUrl}
              key={imageUrl}
            />
          ))}

          <br></br>

          {/* Released Checkbox */}
          <div className={classes["input-container"]}>
            <input
              type="checkbox"
              id="released"
              name="released"
              onChange={handleReleasedChange}
              defaultChecked={application ? application.released : false}
            />
            <label htmlFor="released">Released</label>
          </div>

          {/* Expected Release Date with disabled attribute */}
          <div className={classes["input-container"]}>
            <input
              id="expectedReleaseDate"
              type="date"
              name="expectedReleaseDate"
              placeholder=" "
              disabled={isReleased} // Disable when "Released" is checked
              defaultValue={
                application?.expectedReleaseDate
                  ? new Date(application.expectedReleaseDate)
                      .toISOString()
                      .substr(0, 10)
                  : ""
              }
            />
            <label htmlFor="expectedReleaseDate">Expected Release Date</label>
          </div>

          <div className={classes["input-container"]}>
            <input
              id="additionalInfo"
              type="text"
              name="additionalInfo"
              placeholder=" "
              defaultValue={application ? application.additionalInfo : ""}
            />
            <label htmlFor="additionalInfo">Additional Information</label>
          </div>

          {/* Display any form validation errors */}
          <div>
            {data &&
              data.data &&
              Object.values(data.data).map((err) => (
                <li className={classes.li} key={err}>
                  {err.msg}
                </li>
              ))}
          </div>

          {/* Submit Button */}
          <p className={classes["form-actions"]}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={classes["button-confirm"]}
            >
              {isSubmitting
                ? "Submitting..."
                : application
                ? "Update"
                : "Create"}
            </button>
          </p>
        </div>
      </Form>
    </div>
  );
}
