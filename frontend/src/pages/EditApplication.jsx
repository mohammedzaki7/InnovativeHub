import ApplicationForm from "../components/ApplicationForm";
import { useLoaderData, redirect } from "react-router-dom";
import { getAuthToken } from "../util/auth";

export default function EditApplication() {
  const data = useLoaderData();
  const application = data.application;
  return (
    <>
      <ApplicationForm application={application} />
    </>
  );
}
export async function Action({ request, params }) {
  const formData = await request.formData();
  const applicationId = params.applicationId;

  // Existing form data
  const title = formData.get("title");
  const description = formData.get("description");
  const price = formData.get("price");
  const maxInvestments = formData.get("maxInvestments");
  const percentageGivenAway = formData.get("percentageGivenAway");
  const released = formData.get("released");
  const expectedReleaseDate = formData.get("expectedReleaseDate");
  const additionalInfo = formData.get("additionalInfo");
  const isReleased = released === "on";

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
  );
  submissionFormData.append("additionalInfo", additionalInfo);

  // Append existing image URLs to FormData
  const existingImages = formData.getAll("existingImages");
  if (existingImages.length > 0) {
    existingImages.forEach((imageUrl) => {
      submissionFormData.append("existingImages", imageUrl);
    });
  }

  // Append new image files to FormData
  const images = formData.getAll("images");
  images.forEach((imgFile) => {
    submissionFormData.append("images", imgFile);
  });

  const authToken = getAuthToken();

  const response = await fetch(
    `http://localhost:3000/admin/update-application/${applicationId}`,
    {
      method: "PUT",
      body: submissionFormData,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );

  if (response.status === 422) {
    const errorData = await response.json();
    return errorData;
  }
  if (!response.ok) {
    throw json(
      { message: "Could not update this application" },
      { status: "500" }
    );
  }
  return redirect("/");
}

export async function Loader({ request, params }) {
  const applicationId = params.applicationId;
  const response = await fetch(
    `http://localhost:3000/application/${applicationId}`
  );

  if (!response.ok) {
    // throw new Response(JSON.stringify({message: "could not fetch events"}), {
    //   status: 500
    // });
    throw json(
      { message: "could not fetch the selected application" },
      { status: 500 }
    );
  } else {
    const data = await response.json(); // Parse the response to JSON
    return data; // Return parsed data
  }
}
