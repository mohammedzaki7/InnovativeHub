import { Outlet, useLoaderData, useNavigation } from "react-router-dom"; // outlet marks where the children components should be rendered
import MainNavigation from "../components/MainNavigation";
import { useSubmit } from "react-router-dom";
import { useEffect } from "react";
import { getTokenDuration } from "../util/auth";

function Root() {
  const navigation = useNavigation();
  const submit = useSubmit();
  const token = useLoaderData();
  useEffect(() => {
    
    if (!token) return;

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return;
    }
    const tokenDuration = getTokenDuration();
    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <main>
        {navigation.state === "loading" ? <h1>Loading now!</h1> : <Outlet />}
      </main>
    </>
  );
}

export default Root;
