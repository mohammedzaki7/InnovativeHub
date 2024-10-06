import { useState } from "react";
// import UserData from "../components/User";
import { Link, redirect } from "react-router-dom";
import UserForm from "../components/UserForm";
import { json } from "react-router-dom";


export default function Signup() {
  return (
    <>
      <UserForm />
    </>
  );
}

//  receiving the form data from User component and fetching the request to sign up a user 
export async function action({ request, params }) { 
  const userData = await request.formData();

  const newUser = {
    email: userData.get("email"),
    password: userData.get("password"),
    name: userData.get("name"),
    dateOfBirth: userData.get("dateOfBirth"),
  };
  const response = await fetch("http://localhost:3000/auth/signup", {
    method: "PUT",
    body: JSON.stringify(newUser),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 422) {
    const errorData = await response.json(); // Parse the response body
    return errorData; // Return error data to be handled by useActionData
  }
  if (!response.ok) {
    throw json({ message: "Could not sign up user" }, { status: "500" });
  }
  return redirect("/login");
}
