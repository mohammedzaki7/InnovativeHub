import ApplicationsList from "./ApplicationsList";
import { json } from "react-router-dom";
export default function Applications({ applications }) {
  return <ApplicationsList applications={applications} />;
}


