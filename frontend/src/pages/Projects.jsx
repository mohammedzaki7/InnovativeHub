import { useLoaderData } from "react-router-dom";
import ProjectsList from "../components/ProjectsList";

export default function Projects() {
  const projects = useLoaderData();

  return (
    <>
      <h2>Projects</h2>
      <ProjectsList projects={projects} />
    </>
  );
}
