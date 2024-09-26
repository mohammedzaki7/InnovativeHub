import { useLoaderData } from "react-router-dom";
import ProjectItem from "../components/ProjectItem";

export default function ProjectDetail() {
  const data = useLoaderData();
  const project = data.project;

  return <ProjectItem project={project} />;
}

export async function Loader({ request, params }) {
  const projectId = params.projectId;
  const response = await fetch(
    `http://localhost:3000/project/${projectId}`
  );

  if (!response.ok) {
    // throw new Response(JSON.stringify({message: "could not fetch events"}), {
    //   status: 500
    // });
    throw json(
      { message: "could not fetch the selected project" },
      { status: 500 }
    );
  } else {
    const data = await response.json(); // Parse the response to JSON
    return data; // Return parsed data
  }
}
