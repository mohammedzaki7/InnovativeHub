import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login, { action as loginUserAction } from "./pages/Login";
import Signup, { action as createUserAction } from "./pages/Signup";
import Root from "./pages/Root";
import Error from "./pages/Error";
import Projects from "./pages/Projects";
import Applications from "./pages/Applications";
import NewApplication, {
  action as newApplicationAction,
} from "./pages/NewApplication";
import ApplicationDetail, {
  Loader as ApplicationDetailLoader,
} from "./pages/ApplicationDetail";

import ProjectDetail, {
  Loader as ProjectDetailLoader,
} from "./pages/ProjectDetail";

import { Loader as ApplicationsLoader } from "./components/ApplicationsList";
import { Loader as ProjectsLoader } from "./components/ProjectsList";
import { action as logoutAction } from "./pages/Logout";
import { tokenLoader, checkAuthLoader } from "./util/auth";
import EditApplication, {
  Loader as EditApplicationLoader,
  Action as editApplicationAction,
} from "./pages/EditApplication";

import Assets, {
  MyAssetsLoader as myAssetsLoader,
} from "./pages/Assets";

import Purchases, {
  MyPurchasesLoader as myPurchasesLoader,
} from "./pages/Purchases";

const MAX_ITEMS_HOME = 6;
const MAX_ITEMS_APPS = 9;
// Combine both loaders into one
async function homeLoaders() {
  const [applications, projects] = await Promise.all([
    ApplicationsLoader({ maxItems: MAX_ITEMS_HOME }),
    ProjectsLoader({ maxItems: MAX_ITEMS_HOME }),
  ]);

  return { applications, projects };
}

// async function myAssetsLoaders() {
//   const [applications, projects] = await Promise.all([
//     myAssetsApplicationLoader(),
//     myAssetsProjectLoader(),
//   ]);

//   return { applications, projects };
// }

async function myPurchasesLoaders() {
  const [applications, projects] = await Promise.all([
    myPurchasesApplicationLoader(),
    myPurchasesProjectLoader(),
  ]);

  return { applications, projects };
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    id: "root",
    loader: tokenLoader,
    children: [
      { path: "/", element: <Home />, loader: homeLoaders },
      { path: "/logout", action: logoutAction },
      { path: "/login", element: <Login />, action: loginUserAction },
      { path: "/signup", element: <Signup />, action: createUserAction },
      { path: "/my-assets", element: <Assets />, loader: myAssetsLoader },
      { path: "/my-purchases", element: <Purchases />, loader: myPurchasesLoader },
      {
        path: "/projects",
        children: [
          {
            index: true,
            element: <Projects />,
            loader: (args) =>
              ProjectsLoader({ ...args, maxItems: MAX_ITEMS_APPS }),
          },
          {
            path: ":projectId",
            element: <ProjectDetail />,
            loader: ProjectDetailLoader,
          },
        ],
      },
      {
        path: "/applications",
        children: [
          {
            index: true,
            element: <Applications />,
            loader: (args) =>
              ApplicationsLoader({ ...args, maxItems: MAX_ITEMS_APPS }),
          },
          {
            path: "new-application",
            element: <NewApplication />,
            loader: checkAuthLoader,
            action: newApplicationAction,
          },
          {
            path: ":applicationId",
            element: <ApplicationDetail />,
            loader: ApplicationDetailLoader,
          },
          {
            path: "edit/:applicationId",
            element: <EditApplication />,
            loader: EditApplicationLoader,
            action: editApplicationAction,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
