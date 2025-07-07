import { Routes, Route } from "react-router"
import LoginForm from "./components/LoginForm"
import SignupForm from "./components/SignupForm"
import ToursList from "./components/ToursList"
import AdminDashboard from "./components/AdminDashboard"
import MyTours from "./components/MyTours"
import UpdateTour from "./components/UpdateTour"
import TourDetails from "./components/TourDetails"
import CreateTour from "./components/CreateTour"
import RegistrationsList from "./components/admin/RegistrationList"
import BanUsers from "./components/admin/BanUsers"
import MyReviews from "./components/MyReviews"
import MyBookmarks from "./components/MyBookmarks"



function App() {
  

  return (
    <>
     <Routes>
     <Route 
        path="/login" 
        element={<LoginForm />} />

        <Route 
        path="/signup" 
        element={<SignupForm />} /> 

        <Route 
        path="/" 
        element={<ToursList />} />

        <Route
        path="/dashboard"
        element={<AdminDashboard/>}
        />
        <Route
        path="/my-tours"
        element={<MyTours/>}
        />
        <Route
        path="/my-reviews"
        element={<MyReviews/>}
        />
        <Route
        path="/my-bookmarks"
        element={<MyBookmarks/>}
        />
        <Route
        path="/create"
        element={<CreateTour/>}
        />
        <Route
        path="/registrations"
        element={<RegistrationsList/>}
        />
        <Route
        path="/update/:id"
        element={<UpdateTour/>}
        />
        <Route
        path="/tour/:id"
        element={<TourDetails/>}
        />
        <Route
        path="/ban"
        element={<BanUsers/>}
        />

     </Routes>
    </>
  )
}

export default App
