import classes from "./Form.module.css";
import { useState } from "react";
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
            <input
              id="email"
              type="email"
              name="email"
              required
            />
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

          {/* <div className="group-fields"> */}
          <div className={classes["one-field"]}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
            />
          </div>

          <div className={classes["one-field"]}>
            <label htmlFor="dateOfBirth">Date of birth</label>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
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
            <div className={classes["login-link"]}>
              <p>Already have an account?</p>
              <Link to="/login">Login</Link>
            </div>
          </p>
        </div>
      </Form>
    </div>
  );
}
