import ProjectsList from "./ProjectsList";
import { json } from "react-router-dom";
export default function Projects({ projects }) {
  return <ProjectsList projects={projects} />;
}

