import classes from "./ApplicationsList.module.css";
import { Link } from "react-router-dom";

export default function ApplicationsList({ applications, myAssets }) {
  return (
    <>
      <div className={classes.apps}>
        {/* Check if there are any projects */}
        {applications.length === 0 ? (
          myAssets ? (
            <h3>
              <strong>You don't have any applications</strong>
            </h3>
          ) : (
            <h3>
              <strong>
                No applications available at the moment. Please check back later!
              </strong>
            </h3>
          )
        ) : (
          <ul className={classes.list}>
            {applications.map((application) => (
              <li key={application._id} className={classes.item}>
                <Link to={"/applications/" + application._id}>
                  {application.imagesUrl.length > 0 ? (
                    <img
                      src={application.imagesUrl[0]}
                      alt={application.title}
                    />
                  ) : (
                    <img src="/images/application.jpeg" alt="Application" />
                  )}
                  {/* <img src={application.image} alt={application.title} /> */}
                  <div className={classes.content}>
                    <h2>{application.title}</h2>
                    <h4>{application.description}</h4>
                    <h4>Price: {application.price}$</h4>
                    <h4>Investments: {application.investments}$</h4>
                    <h4>Votes: {application.votes}</h4>
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
