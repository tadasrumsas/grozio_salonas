import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "./Navigation";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyProcedures() {
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [newDateId, setNewDateId] = useState(null);
  const [dateChangeError, setDateChangeError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`${API_URL}/registrations/registrations`, {
          withCredentials: true,
        });
        console.log("Registracijos:", res.data.data);
        setRegistrations(res.data.data);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          `Klaida: ${err.response?.status || ""} ${err.message}`;
        setError(msg);
      }
    };
    fetchRegistrations();
  }, []);

  const openModal = (procedureId) => {
    setSelectedProcedure(procedureId);
    setRating(0);
    setComment("");
    setReviewError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProcedure(null);
    setRating(0);
    setComment("");
    setReviewError("");
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      setReviewError("Pasirinkite įvertinimą nuo 1 iki 5 žvaigždučių.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/reviews/${selectedProcedure}`,
        { rating, comment },
        { withCredentials: true }
      );
      closeModal();
      alert("Ačiū už įvertinimą!");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Nepavyko pateikti atsiliepimo.";
      setReviewError(msg);
    }
  };

  const openDateModal = async (registration) => {
    try {
      const res = await axios.get(
        `${API_URL}/registrations/${registration.registration_id}/date`,
        {
          withCredentials: true,
        }
      );
      setAvailableDates(res.data.data);
      setSelectedRegistration(registration);
      setNewDateId(null);
      setDateChangeError("");
      setShowDateModal(true);
    } catch (err) {
      setDateChangeError("Nepavyko gauti datų.");
    }
  };

  const handleChangeDate = async () => {
    if (!newDateId) {
      setDateChangeError("Pasirinkite datą.");
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/registrations/${selectedRegistration.registration_id}/date`,
        { procedure_date_id: newDateId },
        { withCredentials: true }
      );
      setShowDateModal(false);
      alert("Data pakeista sėkmingai.");
      window.location.reload();
    } catch (err) {
      setDateChangeError("Nepavyko atnaujinti datos.");
    }
  };

  // Nauja funkcija atšaukimui
  const handleCancelRegistration = async (registrationId) => {
    if (!confirm("Ar tikrai norite atšaukti šią registraciją?")) return;
    try {
      await axios.patch(
        `${API_URL}/registrations/${registrationId}`,
        { status: "cancelled" },
        { withCredentials: true }
      );
      alert("Registracija sėkmingai atšaukta.");
      // Atnaujiname registracijas po atšaukimo
      const res = await axios.get(`${API_URL}/registrations/registrations`, {
        withCredentials: true,
      });
      setRegistrations(res.data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Nepavyko atšaukti registracijos.";
      setError(msg);
    }
  };

  const getStatusStyle = (s) =>
    ({
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300", // Pridėta cancelled būsena
    }[s] || "bg-gray-100 text-gray-800 border-gray-300");

  const getStatusLabel = (s) =>
    ({
      pending: "Laukiama patvirtinimo",
      approved: "Patvirtinta",
      completed: "Įvykdyta",
      cancelled: "Atšaukta", // Pridėta cancelled būsena
    }[s] || s);

  return (
    <>
      <Navigation />

      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Mano registracijos
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {registrations.length === 0 ? (
          <p className="text-gray-600">Neturite registracijų.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => (
              <div
                key={reg.registration_id}
                className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={reg.image}
                  alt={reg.title}
                  className="w-full h-44 object-cover rounded-t-2xl"
                />
                <div className="p-4 flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {reg.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lokacija: {reg.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Data: {new Date(reg.date_time).toLocaleString("lt-LT")}
                  </p>

                  <span
                    className={`mt-2 inline-block w-fit px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(
                      reg.status
                    )}`}
                  >
                    {getStatusLabel(reg.status)}
                  </span>

                  {(reg.status === "pending" || reg.status === "approved") && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDateModal(reg)}
                        className="mt-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                      >
                        Keisti datą
                      </button>
                      <button
                        onClick={() =>
                          handleCancelRegistration(reg.registration_id)
                        }
                        className="mt-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Atšaukti
                      </button>
                    </div>
                  )}

                  {reg.status === "completed" && (
                    <button
                      onClick={() => openModal(Number(reg.procedure_id))}
                      className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                    >
                      Įvertinti turą
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Atsiliepimo modalas */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">Įvertinkite turą</h2>

            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className={`text-2xl ${
                    rating >= n ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Komentaras..."
              className="w-full border rounded p-2 mb-4"
              rows={3}
            />

            {reviewError && <p className="text-red-600 mb-3">{reviewError}</p>}

            <button
              onClick={handleSubmitReview}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Pateikti
            </button>
          </div>
        </div>
      )}

      {/* Datos keitimo modalas */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowDateModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Pasirinkite naują datą
            </h2>

            {availableDates.length === 0 ? (
              <p className="text-gray-600">Nėra galimų datų</p>
            ) : (
              <select
                value={newDateId || ""}
                onChange={(e) => setNewDateId(Number(e.target.value))}
                className="w-full border rounded p-2 mb-4"
              >
                <option value="">-- Pasirinkite datą --</option>
                {availableDates.map((date) => (
                  <option key={date.id} value={date.id}>
                    {new Date(date.date_time).toLocaleString("lt-LT")}
                  </option>
                ))}
              </select>
            )}

            {dateChangeError && (
              <p className="text-red-600 mb-3">{dateChangeError}</p>
            )}

            <button
              onClick={handleChangeDate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Atnaujinti datą
            </button>
          </div>
        </div>
      )}
    </>
  );
}
