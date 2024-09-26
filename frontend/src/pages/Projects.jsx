import { useLoaderData } from "react-router-dom";
import ProjectsList from "../components/ProjectsList";

export default function Projects() {
  const projects = useLoaderData();

  return <ProjectsList projects={projects}/>;
}
