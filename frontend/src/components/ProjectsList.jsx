import classes from "./ApplicationsList.module.css";
import { Link } from "react-router-dom";

export default function ProjectsList({ projects, myAssets }) {
  return (
    <>
      <div className={classes.apps}>
        {/* Check if there are any projects */}
        {projects.length === 0 ? (
          myAssets? 
          <h3>
            <strong>
              You don't have any projects
            </strong>
          </h3>
          :
          <h3>
            <strong>
              No projects available at the moment. Please check back later!
            </strong>
          </h3>
        ) : (
          <ul className={classes.list}>
            {projects.map((project) => (
              <li key={project.id} className={classes.item}>
                <Link to={"/projects/" + project._id}>
                  {project.imagesUrl.length > 0 ? (
                    <img src={project.imagesUrl[0]} alt={project.title} />
                  ) : (
                    <img src="/images/project.png" alt="Project" />
                  )}
                  <div className={classes.content}>
                    <h2>{project.title}</h2>
                    <h4>{project.description}</h4>
                    <h4>Price: {project.price}$</h4>
                    <h4>Votes: {project.votes}</h4>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export async function Loader({ maxItems = 3 }) {
  let fetchUrl = "http://localhost:3000/projects";
  if (maxItems) {
    fetchUrl += `?maxItems=${maxItems}`;
  }
  const response = await fetch(fetchUrl);

  if (!response.ok) {
    // throw new Response(JSON.stringify({message: "could not fetch events"}), {
    //   status: 500
    // });
    throw json({ message: "could not fetch projects" }, { status: 500 });
  } else {
    const data = await response.json(); // Parse the response to JSON
    return data.projects; // Return parsed data
  }
}
