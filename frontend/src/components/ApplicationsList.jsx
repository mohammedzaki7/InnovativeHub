import classes from "./ApplicationsList.module.css";
import { Link } from "react-router-dom";

export default function ApplicationsList({ applications }) {
  return (
    <div className={classes.apps}>
      <h2>Top 3 Applications</h2>
      {/* Check if there are any applications */}
      {applications.length === 0 ? (
        <p>No applications available at the moment. Please check back later!</p>
      ) : (
        <ul className={classes.list}>
          {applications.map((application) => (
            <li key={application._id} className={classes.item}>
              <Link to={"/applications/" + application._id}>
                <img src={application.image} alt={application.title} />
                <div className={classes.content}>
                  <h2>{application.title}</h2>
                  <h4>{application.description}</h4>
                  <h4>{application.price}$</h4>
                  <h4>Investments: {application.investments}$</h4>
                  <date>Available from: {application.expectedReleaseDate}</date>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function Loader({maxItems = 3}) {
  // Build the URL with the manNumber query parameter
  // const maxItems = 5;
  let fetchUrl = "http://localhost:3000/applications";
  if (maxItems) {
    fetchUrl += `?maxItems=${maxItems}`;
  }
  const response = await fetch(fetchUrl);

  if (!response.ok) {
    // throw new Response(JSON.stringify({message: "could not fetch events"}), {
    //   status: 500
    // });
    throw json({ message: "could not fetch applications" }, { status: 500 });
  } else {
    const data = await response.json(); // Parse the response to JSON
    return data.applications; // Return parsed data
  }
}
