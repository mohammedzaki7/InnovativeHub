import classes from "./ApplicationsList.module.css";

export default function ProjectItem({ project }) {
  return (
    <>
      <img src={project.image} alt={project.title} />
      <div className={classes.content}>
        <h2>{project.title}</h2>
        <h4>{project.description}</h4>
        <h4>{project.price}$</h4>
        <h4>Investments: {project.investments}$</h4>
        <date>Available from: {project.expectedReleaseDate}</date>
      </div>
    </>
  );
}
