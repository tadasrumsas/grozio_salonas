import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Navigation from "./Navigation";
import ReviewsOneProcedure from "./ReviewsOneProcedure";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProcedureDetails() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const { id } = useParams();
  const [procedure, setProcedure] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("lt-LT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/procedures/procedure/${id}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.data && response.data.data.length > 0) {
          setProcedure(response.data.data[0]);
        } else {
        }
      } catch (error) {
        setError("Įvyko klaida kraunant procedurą. Bandykite dar kartą.");
      } finally {
        setLoading(false);
      }
    };
    fetchProcedures();
  }, [id]);

  const handleRegister = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!selectedDate) {
      setError("Pasirinkite datą registracijai.");
      return;
    }

    // Surasti pasirinktos datos ID
    const selectedDateObj = procedure.dates.find(
      (d) => d.date_time === selectedDate
    );
    if (!selectedDateObj) {
      setError("Pasirinkta data neegzistuoja.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/registrations`,
        {
          procedure_date_id: selectedDateObj.id,
        },
        {
          withCredentials: true,
        }
      );
      setSuccessMessage("Sėkmingai užsiregistravote!");
    } catch (err) {
      console.error(err);
      setError("Nepavyko užsiregistruoti. Galbūt jau esate užsiregistravęs.");
    }
  };

  if (loading) return <div>Kraunama...</div>;
  if (error && !procedure) return <div>{error}</div>;
  if (!procedure) return <div>Procedūra nerasta.</div>;

  return (
    <section>
      <Navigation />
      <div className="max-w-7xl mx-auto p-4">
        {/* Procedure display */}
        <div className="flex w-full flex-col md:flex-row bg-white border-2 border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
          <div className="w-full md:w-1/2 p-4">
            <img
              className="w-full h-[24rem] sm:h-[20rem] object-cover rounded-lg shadow-sm"
              src={procedure.image}
              alt={procedure.title}
            />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h2 className="font-bold text-2xl sm:text-3xl text-gray-800 truncate">
              {procedure.title}
            </h2>
            <p className="text-gray-600 text-base mt-2 leading-relaxed">
              {procedure.description}
            </p>
          </div>
        </div>

        {/* Date selection */}
        <div className="mt-4">
          <label
            htmlFor="date-select"
            className="block text-gray-700 text-sm font-semibold mb-1"
          >
            Pasirinkite datą:
          </label>
          <select
            id="date-select"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">-- Pasirinkite --</option>
            {procedure.dates.map((date) => (
              <option key={date.id} value={date.date_time}>
                {formatDate(date.date_time)}
              </option>
            ))}
          </select>
          {procedure.dates.length === 0 && (
            <p className="text-red-500 text-sm mt-2">Nėra galimų datų.</p>
          )}
        </div>

        {/* Messages */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {successMessage && (
          <p className="text-green-600 mt-2">{successMessage}</p>
        )}

        {/* Register button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRegister}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-base font-semibold"
          >
            Užsakyti
          </button>
        </div>
      </div>
      <ReviewsOneProcedure procedureId={procedure.id} />
    </section>
  );
}
