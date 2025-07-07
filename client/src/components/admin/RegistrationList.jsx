import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "../Navigation";
import AdminNavigation from "./AdminNavigation";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegistrationsList() {
  const [registrations, setRegistrations] = useState([]);

  // Visi pasirinkti statusai (pagal registracijos ID)
  const [statusUpdates, setStatusUpdates] = useState({});

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get(`${API_URL}/registrations`, {
        withCredentials: true,
      });
      setRegistrations(response.data.data);

      // Inicializuojam pasirinktus statusus pagal dabartinius
      const initialStatuses = {};
      response.data.data.forEach((r) => {
        initialStatuses[r.registration_id] = r.registration_status;
      });
      setStatusUpdates(initialStatuses);
    } catch (error) {
      console.error("Klaida:", error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const status = statusUpdates[id];
      await axios.patch(
        `${API_URL}/registrations/${id}`,
        { status },
        { withCredentials: true }
      );
      await fetchRegistrations(); // Atnaujinti po sėkmės
    } catch (error) {
      console.error("Nepavyko atnaujinti statuso:", error);
    }
  };

  return (
    <>
      <Navigation />
      <AdminNavigation />
      <div className="max-w-6xl mx-auto mt-6">
        {/* Header (matomas tik didesniems ekranams) */}
        <div className="hidden lg:grid grid-cols-6 font-semibold border-b pb-2 mb-2 text-gray-700">
          <div>Data</div>
          <div>Turas</div>
          <div>El. paštas</div>
          <div>Statusas</div>
          <div>Naujas statusas</div>
          <div></div>
        </div>

        <div className="space-y-4">
          {registrations.map((registration) => (
            <div
              key={registration.registration_id}
              className="bg-white p-4 rounded shadow-sm hover:bg-gray-50 transition"
            >
              {/* Mobilus arba desktop view */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-2 items-center text-gray-800">
                {/* Data */}
                <div>
                  <span className="font-semibold lg:hidden">Data: </span>
                  {new Date(registration.registration_date).toLocaleDateString(
                    "lt-LT"
                  )}
                </div>

                {/* Turo pavadinimas */}
                <div>
                  <span className="font-semibold lg:hidden">Turas: </span>
                  {registration.procedure_title}
                </div>

                {/* El. paštas */}
                <div>
                  <span className="font-semibold lg:hidden">El. paštas: </span>
                  {registration.user_email}
                </div>

                {/* Esamas statusas */}
                <div>
                  <span className="font-semibold lg:hidden">Statusas: </span>
                  {registration.registration_status}
                </div>

                {/* Select naujam statusui */}
                <div>
                  <span className="font-semibold lg:hidden">
                    Naujas statusas:{" "}
                  </span>
                  <select
                    value={statusUpdates[registration.registration_id] || ""}
                    onChange={(e) =>
                      handleStatusChange(
                        registration.registration_id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Mygtukas */}
                <div>
                  <button
                    onClick={() => handleUpdate(registration.registration_id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition w-full"
                  >
                    Atnaujinti
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
