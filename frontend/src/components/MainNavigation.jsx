import { NavLink, Form, useRouteLoaderData } from "react-router-dom";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const token = useRouteLoaderData("root");

  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/applications"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Applications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Projects
            </NavLink>
          </li>
        </ul>

        <div className={classes.rightSection}>
          <ul className={classes.list}>
            {token && (
              <>
                <li>
                  <NavLink
                    to="/my-assets"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    My Assets
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/my-purchases"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    Purchases
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className={classes.searchBar}
          />

          <ul className={classes.list}>
            {!token && (
              <>
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    Signup
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? classes.active : undefined
                    }
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}
            {token && (
              <li className={classes.list}>
                <Form
                  action="/logout"
                  method="post"
                  className={classes.authForm}
                >
                  <button className={classes.authButton}>Logout</button>
                </Form>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;
