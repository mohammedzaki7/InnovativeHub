import { Link, useLoaderData, useNavigation } from "react-router-dom";
import Projects from "../components/Projects";
import Applications from "../components/Applications";

function Home() {
  const navigation = useNavigation();
  const { applications, projects } = useLoaderData(); // Get both applications and projects data

  return (
    <>
      {navigation.state === "loading" ? (
        <h1>Loading now!</h1>
      ) : (
        <>
          <Applications applications={applications} />
          <Projects projects={projects} />
        </>
      )}
    </>
  );
}

export default Home;
