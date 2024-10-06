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
          <div className={classes["input-container"]}>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder=" " /* Empty space used as placeholder to trigger the label */
            />
            <label htmlFor="name">Name</label>
          </div>

          <div className={classes["input-container"]}>
            <input
              id="dateOfBirth"
              type="date"
              name="dateOfBirth"
              required
              placeholder=" " /* Empty space used as placeholder to trigger the label */
            />
            <label htmlFor="dateOfBirth">Date of birth</label>
          </div>

          <div>
            {data && data.data && <h5>Failed to create a new user</h5>}
            {data &&
              data.data &&
              Object.values(data.data).map((err) => (
                <li className={classes.li} key={err}>
                  {err.msg}
                </li>
              ))}
          </div>
            <button type="submit" className={classes["button-confirm"]}>
              Sign up
            </button>
          <div className={classes["login-link"]}>
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
