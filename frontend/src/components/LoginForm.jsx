import classes from "./Form.module.css";
import { Link, Form, useActionData } from "react-router-dom";

export default function UserForm() {
  const data = useActionData();

  return (
    <div>
      <Form method="post">
        <div className={classes.form}>
          <h2>Login</h2>
          <div className={classes["input-container"]}>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder=" " /* Empty space used as placeholder to trigger the label */
            />
            <label htmlFor="email">Email</label>
          </div>
          {/* <div className="group-fields"> */}
          <div className={classes["input-container"]}>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={8}
              placeholder=" " /* Empty space used as placeholder to trigger the label */
            />
            <label htmlFor="password">Password</label>
          </div>

          <div>
            {data && data.message && <h5>Login failed</h5>}
            {data && data.message && <li>{data.message}</li>}
          </div>
          {/* <button
            type="reset"
            className={`${classes.button} ${classes["button-danger"]}`}
          >
            Reset Password
          </button> */}
          <button type="submit" className={classes["button-confirm"]}>
            Login
          </button>
          <div className={classes["login-link"]}>
            <p>Don't have an account yet?</p>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
