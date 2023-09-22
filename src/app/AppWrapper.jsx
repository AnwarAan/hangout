import { Fragment, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import useToken from "../hooks/useToken";

const App = lazy(() => import("./App"));
const Home = lazy(() => import("../page/Home"));
const EventForm = lazy(() => import("../page/form/EventForm"));
const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const AuthPage = lazy(() => import("../components/auth/AuthPage"));

const AppWrapper = () => {
  const { token, setToken } = useToken();
  console.log("token", token);

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register routing="path" path="/sign-up" />} />

            <Route
              path="/event-form"
              element={
                <AuthPage>
                  <EventForm />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Fragment>
  );
};

export default AppWrapper;
