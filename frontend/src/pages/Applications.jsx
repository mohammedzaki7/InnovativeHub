import { useLoaderData, NavLink } from "react-router-dom";
import ApplicationsList from "../components/ApplicationsList";
import classes from "./Items.module.css";
import { IoIosAddCircle } from "react-icons/io"; // Import Font Awesome Plus icon

export default function Applications() {
  const applications = useLoaderData(); // Load application data

  return (
    <>
      <div className={classes["title-add-button"]}>
        <h2>Applications</h2>
        <NavLink to="new-application">
          <IoIosAddCircle className={classes.addIcon} />
        </NavLink>
      </div>
      <ApplicationsList applications={applications} />
    </>
  );
}
