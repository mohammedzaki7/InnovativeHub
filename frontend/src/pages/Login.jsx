import LoginForm from "../components/LoginForm";
import { redirect } from "react-router-dom";

export default function Login() {
  return <LoginForm />;
}

export async function action({ request, params }) {
  const userData = await request.formData();

  const userToLogin = {
    email: userData.get("email"),
    password: userData.get("password"),
  };

  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    body: JSON.stringify(userToLogin),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 401) {
    const errorData = await response.json(); // Parse the response body
    return errorData; // Return error data to be handled by useActionData
  }
  if (!response.ok) {
    throw json({ message: "Could not login" }, { status: "500" });
  }
  // Successful login: Extract token from response
  const data = await response.json();
  const token = data.token; // Assuming the token is in the 'token' field

  // Optionally store the token in localStorage or sessionStorage
  localStorage.setItem("authToken", token);

  // Redirect after successful login
  return redirect("/");
}
