import { Link, useLoaderData, useNavigation } from "react-router-dom";
import Projects from "../components/Projects";
import Applications from "../components/Applications";
import classes from "./Home.module.css";
import { getAuthToken } from "../util/auth";

export default function Assets() {
  const navigation = useNavigation();
  const { applications, projects } = useLoaderData(); // Get both applications and projects data

  return (
    <>
      {navigation.state === "loading" ? (
        <div className={classes["loading-container"]}>
          <h1 className={classes["main-heading"]}>Loading now!</h1>
        </div>
      ) : (
        <div className={classes["content-container"]}>
          <div className={classes["grid-container"]}>
            <div className={classes["applications-container"]}>
              <h2>My Applications</h2>
              <Applications applications={applications} myAssets={true}/>
            </div>
            <div className={classes["projects-container"]}>
              <h2>My Projects</h2>
              <Projects projects={projects} myAssets={true}/>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export async function MyPurchasesLoader() {
  const token = getAuthToken();
  const response = await fetch("http://localhost:3000/admin/my-purchases", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // throw new Response(JSON.stringify({message: "could not fetch events"}), {
    //   status: 500
    // });
    throw json(
      { message: "could not retrieve any applications" },
      { status: 500 }
    );
  } else {
    const res = await response.json(); // Parse the response to JSON
    return res; // Return parsed data
  }
}
