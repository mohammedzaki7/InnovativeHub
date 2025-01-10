import ApplicationsList from "./ApplicationsList";
import { json } from "react-router-dom";
export default function Applications({ applications, myAssets }) {
  return <ApplicationsList applications={applications} myAssets={myAssets}/>;
}


