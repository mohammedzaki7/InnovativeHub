import { useLoaderData } from "react-router-dom";
import ApplicationsList from "../components/ApplicationsList";

export default function Applications() {
  const applications = useLoaderData();

  return <ApplicationsList applications={applications}/>;
}
