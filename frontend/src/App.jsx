import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login, { action as loginUserAction } from "./pages/Login";
import Signup, { action as createUserAction } from "./pages/Signup";
import Root from "./pages/Root";
import Error from "./pages/Error";
import Projects from "./pages/Projects";
import Applications from "./pages/Applications";
import NewApplication from "./pages/NewApplication";
import ApplicationDetail, {
  Loader as ApplicationDetailLoader,
} from "./pages/ApplicationDetail";

import ProjectDetail, {
  Loader as ProjectDetailLoader,
} from "./pages/ProjectDetail";

import { Loader as applicationsLoader } from "./components/ApplicationsList";
import { Loader as projectsLoader } from "./components/ProjectsList";

const MAX_ITEMS_HOME = 3;
const MAX_ITEMS_APPS = 9;
// Combine both loaders into one
async function homeLoaders() {
  const [applications, projects] = await Promise.all([
    applicationsLoader({ maxItems: MAX_ITEMS_HOME }),
    projectsLoader({ maxItems: MAX_ITEMS_HOME }),
  ]);

  return { applications, projects };
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home />, loader: homeLoaders },
      { path: "/login", element: <Login />, action: loginUserAction },
      { path: "/signup", element: <Signup />, action: createUserAction },
      {
        path: "/projects",
        children: [
          {
            index: true,
            element: <Projects />,
            loader: (args) =>
              projectsLoader({ ...args, maxItems: MAX_ITEMS_APPS }),
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
              applicationsLoader({ ...args, maxItems: MAX_ITEMS_APPS }),
          },
          {
            path: "new-application",
            element: <NewApplication />,
          },
          {
            path: ":applicationId",
            element: <ApplicationDetail />,
            loader: ApplicationDetailLoader,
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
