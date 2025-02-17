import ApplicationForm from "../components/ApplicationForm";
import { getAuthToken } from "../util/auth";
import { redirect } from "react-router-dom";


export default function NewApplication() {
  return <ApplicationForm />;
}
export async function action({ request, params }) {
  const formData = await request.formData();

  // Access the text input data
  const title = formData.get("title");
  const description = formData.get("description");
  const price = formData.get("price");
  const maxInvestments = formData.get("maxInvestments");
  const percentageGivenAway = formData.get("percentageGivenAway");
  const released = formData.get("released");
  const expectedReleaseDate = formData.get("expectedReleaseDate");
  const additionalInfo = formData.get("additionalInfo");
  const images = formData.getAll("images"); // Array of uploaded files
  const isReleased = released === "on";


  // Creating a new FormData to submit to the backend
  const submissionFormData = new FormData();
  submissionFormData.append("title", title);
  submissionFormData.append("description", description);
  submissionFormData.append("price", price);
  submissionFormData.append("maxInvestments", maxInvestments);
  submissionFormData.append("percentageGivenAway", percentageGivenAway);
  submissionFormData.append("released", isReleased);
  submissionFormData.append(
    "expectedReleaseDate",
    isReleased ? null : expectedReleaseDate
  ); // Only add if not released
  submissionFormData.append("additionalInfo", additionalInfo);

  // Append image files to the form data
  images.forEach((imgFile) => {
    submissionFormData.append("images", imgFile);
  });

  const authToken = getAuthToken();

  const response = await fetch(
    "http://localhost:3000/admin/upload-application",
    {
      method: "POST",
      body: submissionFormData, // FormData is used directly here
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Do NOT add 'Content-Type' header when sending FormData,
        // the browser will automatically set it, including the correct boundary.
      },
    }
  );

  if (response.status === 422) {
    const errorData = await response.json(); // Parse the response body
    return errorData; // Return error data to be handled by useActionData
  }
  if (!response.ok) {
    throw json(
      { message: "Could not upload this application" },
      { status: "500" }
    );
  }
  // should return to owned page
  return redirect("/");
  

  // Handle success as needed
}
