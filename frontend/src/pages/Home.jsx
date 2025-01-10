import { Link, useLoaderData, useNavigation } from "react-router-dom";
import Projects from "../components/Projects";
import Applications from "../components/Applications";
import classes from "./Home.module.css";

function Home() {
  const navigation = useNavigation();
  const { applications, projects } = useLoaderData(); // Get both applications and projects data

  return (
    <>
      {navigation.state === "loading" ? (
        <div className={classes["loading-container"]}>
          <h1 className={classes["main-heading"]}>Loading now!</h1>
          <h1 className={classes["sub-heading"]}>
            Start now and share your innovative thoughs!
          </h1>
        </div>
      ) : (
        <div className={classes["content-container"]}>
          <h1 className={classes["main-heading"]}>
            Start now and share your innovative thoughs!
          </h1>
          <div className={classes["grid-container"]}>
            <div className={classes["applications-container"]}>
              <h2>Top Applications</h2>
              <Applications applications={applications} />
            </div>
            <div className={classes["projects-container"]}>
              <h2>Top Projects</h2>
              <Projects projects={projects} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
