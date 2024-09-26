import classes from "./ApplicationsList.module.css";
import { Link } from "react-router-dom";

export default function ProjectsList({ projects }) {
  return (
    <div className={classes.apps}>
      <h2>Top 3 Projects</h2>
      {/* Check if there are any projects */}
      {projects.length === 0 ? (
        <p>No projects available at the moment. Please check back later!</p>
      ) : (
        <ul className={classes.list}>
          {projects.map((projects) => (
            <li key={projects.id} className={classes.item}>
              <Link to={"/projects/" + projects._id}>
                <img src={projects.image} alt={projects.title} />
                <div className={classes.content}>
                  <h2>{projects.title}</h2>
                  <h4>{projects.description}</h4>
                  <h4>{projects.price}$</h4>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
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
