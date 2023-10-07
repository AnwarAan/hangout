import { Fragment, Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import useToken from "../hooks/useToken"

const App = lazy(() => import("./App"))
const Home = lazy(() => import("../page/Home"))
const EventForm = lazy(() => import("../page/form/EventForm"))
const Login = lazy(() => import("../components/auth/Login"))
const Register = lazy(() => import("../components/auth/Register"))
const AuthPage = lazy(() => import("../components/auth/AuthPage"))
const Profile = lazy(() => import("../page/profile"))
const MyEvent = lazy(() => import("../page/profile/page/myEvent"))
const MyReferals = lazy(() => import("../page/profile/page/myReferals"))
const MyFavorites = lazy(() => import("../page/profile/page/myFavorites"))
const EventDetails = lazy(() => import("../page/event/EventDetails"))
const Dashboard = lazy(() => import("../page/dashboard/page"))
const VerifyEmail = lazy(() => import("../components/auth/VerifyEmail"))
const SendEmail = lazy(() => import("../components/auth/SendEmail"))
const ResetPassword = lazy(() => import("../components/auth/ResetPassword"))
const ErrorPage = lazy(() => import("../page/ErrorPage"))
const CategoryMusic = lazy(() => import("../page/event/CategoryMusic")) 
const CategoryHealth = lazy(() => import("../page/event/CategoryHealth")) 
const CategoryVisual = lazy(() => import("../page/event/CategoryVisual")) 
const CategoryHoliday = lazy(() => import("../page/event/CategoryHoliday")) 
const CategoryFoodDrink = lazy(() => import("../page/event/CategoryFoodDrink")) 
const CategorySportFit = lazy(() => import("../page/event/CategorySportFit")) 
const CategoryHobbies = lazy(() => import("../page/event/CategoryHobbies")) 
const CategoryBusiness = lazy(() => import("../page/event/CategoryBusiness")) 


const AppWrapper = () => {
  const { setToken } = useToken()

  return (
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route
              path="/register"
              element={<Register routing="path" path="/sign-up" />}
            />

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
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/send-email" element={<SendEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<ErrorPage />} />

            <Route path="/profile/" element={<Profile />}>
              <Route path="my-events" element={<MyEvent />} />
              <Route path="my-referals" element={<MyReferals />} />
              <Route path="my-favorites" element={<MyFavorites />} />
            </Route>
            <Route
              path="/event/category/music"
              element={
                  <CategoryMusic/>
              }
            />
            <Route
              path="/event/category/business"
              element={
                  <CategoryBusiness/>
              }
            />
            <Route
              path="/event/category/health"
              element={
                  <CategoryHealth/>
              }
            />
            <Route
              path="/event/category/visual"
              element={
                  <CategoryVisual/>
              }
            />
            <Route
              path="/event/category/holiday"
              element={
                  <CategoryHoliday/>
              }
            />
            <Route
              path="/event/category/health"
              element={
                  <CategoryHealth/>
              }
            />
            <Route
              path="/event/category/sportFitness"
              element={
                  <CategorySportFit/>
              }
            />
            <Route
              path="/event/category/foodDrink"
              element={
                  <CategoryFoodDrink/>
              }
            />
            <Route
              path="/event/category/hobbies"
              element={
                  <CategoryHobbies/>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Fragment>
  )
}

export default AppWrapper
