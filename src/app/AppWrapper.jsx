import { Fragment, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import useToken from "../hooks/useToken";

const App = lazy(() => import("./App"));
const Home = lazy(() => import("../page/Home"));
const EventForm = lazy(() => import("../page/form/EventForm"));
const Login = lazy(() => import("../components/auth/Login"));
const Register = lazy(() => import("../components/auth/Register"));
const AuthPage = lazy(() => import("../components/auth/AuthPage"));
const Profile = lazy(() => import("../page/profile"));
const MyEvent = lazy(() => import("../page/profile/page/myEvent"));
const MyReferals = lazy(() => import("../page/profile/page/myReferals"));
const MyFavorites = lazy(() => import("../page/profile/page/myFavorites"));
const EventDetails = lazy(() => import("../page/event/EventDetails"));
const Dashboard = lazy(() => import("../page/dashboard/page"));
const ErrorPage = lazy(() => import("../page/ErrorPage"));
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

            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<ErrorPage />} />

            <Route path="/profile/" element={<Profile />}>
              {/* <Route path="my-events" element={<MyEvent />} /> */}
              <Route path="my-referals" element={<MyReferals />} />
              {/* <Route path="my-favorites" element={<MyFavorites />} /> */}
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Fragment>
  );
};

export default AppWrapper;
