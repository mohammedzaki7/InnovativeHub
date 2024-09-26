import classes from "./Form.module.css";
import { Link, Form, useActionData } from "react-router-dom";

export default function UserForm() {
  const data = useActionData();

  return (
    <div>
      <Form method="post">
        <div className={classes.form}>
          <h2>Welcome to Innovative Hub!</h2>
          <p>
            We just need a little bit of data from you to get you started 🚀
          </p>
          <div className={classes["one-field"]}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required />
          </div>
          {/* <div className="group-fields"> */}
          <div className={classes["one-field"]}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={8}
            />
          </div>

          <div>
            {data && data.message && (
              <ul>
                <li>{data.message}</li>
              </ul>
            )}
          </div>
          <p className={classes["form-actions"]}>
            <button
              type="reset"
              className={`${classes.button} ${classes["button-danger"]}`}
            >
              Reset
            </button>
            <button type="submit" className={classes.button}>
              Login
            </button>
            <div className={classes["login-link"]}>
              <p>Don't have an account yet?</p>
              <Link to="/signup">Sign up</Link>
            </div>
          </p>
        </div>
      </Form>
    </div>
  );
}
