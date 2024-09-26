import { Outlet, useNavigation } from "react-router-dom"; // outlet marks where the children components should be rendered
import MainNavigation from "../components/MainNavigation";

function Root() {
  const navigation = useNavigation();
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
