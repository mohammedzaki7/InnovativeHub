import classes from "./ApplicationsList.module.css";

export default function ApplicationItem({ application }) {
  return (
    <>
      <img src={application.image} alt={application.title} />
      <div className={classes.content}>
        <h2>{application.title}</h2>
        <h4>{application.description}</h4>
        <h4>{application.price}$</h4>
        <h4>Investments: {application.investments}$</h4>
        <date>Available from: {application.expectedReleaseDate}</date>
      </div>
    </>
  );
}
