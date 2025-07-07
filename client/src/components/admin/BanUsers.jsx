import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../Navigation";
import AdminNavigation from "./AdminNavigation";

const API_URL = import.meta.env.VITE_API_URL;

export default function BanUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/all`, {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (err) {
      setError("Nepavyko gauti vartotojų sąrašo.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBanToggle = async (userId, currentlyBanned) => {
    setLoading(true);
    try {
      if (currentlyBanned) {
        await axios.put(`${API_URL}/admin/unban/${userId}`, null, {
          withCredentials: true,
        });
      } else {
        await axios.put(`${API_URL}/admin/ban/${userId}`, null, {
          withCredentials: true,
        });
      }
      await fetchUsers(); 
    } catch (err) {
      setError("Klaida keičiant vartotojo būseną.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Navigation />
      <AdminNavigation />

      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Vartotojų valdymas</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Vardas</th>
                <th className="p-3 border-b">El. paštas</th>
                <th className="p-3 border-b">Rolė</th>
                <th className="p-3 border-b">Statusas</th>
                <th className="p-3 border-b">Veiksmas</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="text-sm text-gray-800 hover:bg-gray-50 transition"
                >
                  <td className="p-3 border-b">{user.id}</td>
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b capitalize">{user.role}</td>
                  <td className="p-3 border-b">
                    {user.is_banned ? (
                      <span className="text-red-600 font-medium">Užblokuotas</span>
                    ) : (
                      <span className="text-green-600 font-medium">Aktyvus</span>
                    )}
                  </td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleBanToggle(user.id, user.is_banned)}
                      className={`px-3 py-1 rounded font-medium text-white ${
                        user.is_banned ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                      disabled={loading}
                    >
                      {user.is_banned ? "Atblokuoti" : "Užblokuoti"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
