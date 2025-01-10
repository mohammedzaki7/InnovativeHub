import ProjectsList from "./ProjectsList";
import { json } from "react-router-dom";

export default function Projects({ projects, myAssets }) {
  return <ProjectsList projects={projects} myAssets={myAssets}/>;
}

