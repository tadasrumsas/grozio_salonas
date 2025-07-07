import { Routes, Route } from "react-router";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProceduresList from "./components/ProceduresList";
import AdminDashboard from "./components/AdminDashboard";
import MyProcedures from "./components/MyProcedures";
import UpdateProcedure from "./components/UpdateProcedure";
import ProcedureDetails from "./components/ProcedureDetails";
import CreateProcedure from "./components/CreateProcedure";
import RegistrationsList from "./components/admin/RegistrationList";
import BanUsers from "./components/admin/BanUsers";
import MyReviews from "./components/MyReviews";
import MyBookmarks from "./components/MyBookmarks";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route path="/signup" element={<SignupForm />} />

        <Route path="/" element={<ProceduresList />} />

        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/my-procedures" element={<MyProcedures />} />
        <Route path="/my-reviews" element={<MyReviews />} />
        <Route path="/my-bookmarks" element={<MyBookmarks />} />
        <Route path="/create" element={<CreateProcedure />} />
        <Route path="/registrations" element={<RegistrationsList />} />
        <Route path="/update/:id" element={<UpdateProcedure />} />
        <Route path="/procedure/:id" element={<ProcedureDetails />} />
        <Route path="/ban" element={<BanUsers />} />
      </Routes>
    </>
  );
}

export default App;
