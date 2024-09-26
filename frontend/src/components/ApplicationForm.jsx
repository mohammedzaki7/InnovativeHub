import classes from "./Form.module.css";
import { Form, useActionData, Link } from "react-router-dom";

export default function ApplicationForm() {
  const data = useActionData();
  return (
    <div>
      <Form method="post">
        <div className={classes.form}>
          <h2>Create your new application!</h2>
          <div className={classes["one-field"]}>
            <label htmlFor="email">Title</label>
            <input id="title" type="text" name="title" required />
          </div>

          <div className={classes["one-field"]}>
            <label htmlFor="email">Description</label>
            <input id="description" type="text" name="description" required />
          </div>

          <div className={classes["one-field"]}>
            <label htmlFor="price">Price</label>
            <input
              id="price"
              type="number"
              name="price"
              required
              min="0"
              step="0.01" // Allows decimal values like 10.99
            />
          </div>

          <div className={classes["one-field"]}>
            <label htmlFor="email">Maximun Investments</label>
            <input
              id="maxInvestments"
              type="number"
              name="maxInvestments"
              required
              min="0"
              step="0.01" // Allows decimal values like 10.99
            />
          </div>

          <div className={classes["one-field"]}>
            <label htmlFor="email">Percentage Given Away</label>
            <input
              id="percentageGivenAway"
              type="number"
              name="percentageGivenAway"
              required
              min="0"
              step="0.01" // Allows decimal values like 10.99
            />
          </div>

          <div className={classes["one-field"]}>
            <label htmlFor="email">Additional Information</label>
            <input
              id="additionalInfo"
              type="text"
              name="additionalInfo"
              required
            />
          </div>

          <div>
            {data &&
              data.data &&
              Object.values(data.data).map((err) => (
                <li className={classes.li} key={err}>
                  {err.msg}
                </li>
              ))}
          </div>
          <p className={classes["form-actions"]}>
            <button
              type="reset"
              className={`${classes.button} ${classes["button-danger"]}`}
            >
              Reset
            </button>
            <button type="submit" className={classes.button}>
              Sign up
            </button>
          </p>
        </div>
      </Form>
    </div>
  );
}
