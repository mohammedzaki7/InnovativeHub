import { useLoaderData } from "react-router-dom";
import ApplicationItem from "../components/ApplicationItem";

export default function ApplicationDetail() {
  const data = useLoaderData();
  const application = data.application;

  return <ApplicationItem application={application} />;
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
