import {
  ClerkProvider, SignIn, SignUp,
} from "@clerk/clerk-react";
import { Route, Routes, useNavigate } from "react-router-dom";

import Home from "./page/Home";
import EventDetails from "./page/event/EventDetails";
import EventCategory from "./page/event/CategoryMusic";
import EventForm from "./page/form/EventForm";
import AuthContainer from "./components/auth/SignIn";
import ProtectedRoutes from "./components/shared/ProtectedRoutes";
import Profile from "./page/profile";
import MyEvent from "./page/profile/page/myEvent";
import MyReferals from "./page/profile/page/myReferals";
import ErrorPage from "./page/ErrorPage";
import MyFavorites from "./page/profile/page/myFavorites";
import Dashboard from "./page/dashboard/page";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const ClerkProviderRouter = () => {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={to => navigate(to)}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sign-in/*"
          element={<AuthContainer><SignIn routing="path" path="/sign-in" /></AuthContainer>}
        />
        <Route
          path="/sign-up/*"
          element={<AuthContainer><SignUp routing="path" path="/sign-up" /></AuthContainer>}
        />
        <Route path="/event-form" element={<ProtectedRoutes><EventForm /></ProtectedRoutes>} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/event/category/:eventCategory" element={<EventCategory />} />
        <Route path="/profile/" element={<Profile />} >
          <Route path="my-events" element={<MyEvent />} />
          <Route path="my-referals" element={<MyReferals />} />
          <Route path="my-favorites" element={<MyFavorites />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </ClerkProvider>
  );
}
export default ClerkProviderRouter