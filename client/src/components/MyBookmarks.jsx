import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import ProcedureCard from "./ProcedureCard";
import UserContext from "../contexts/UserContext";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

export default function MyBookmarks() {
  const { user } = useContext(UserContext);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${API_URL}/bookmarks`, {
          withCredentials: true,
        });

        const transformed = res.data.data.map((bookmark) => ({
          ...bookmark,
          id: bookmark.procedure_id,
          isBookmarked: true,
        }));

        setBookmarks(transformed);
      } catch (err) {
        const msg = err.response?.data?.message || "Nepavyko gauti bookmarkų";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleBookmarkToggle = (procedureId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.id !== procedureId)
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/procedures/${id}`, {
        withCredentials: true,
      });
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      toast.success("Procedūra sėkmingai ištrinta");
    } catch (err) {
      const msg = err.response?.data?.message || "Klaida trinant procedūrą";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <>
      <Navigation />
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Mano bookmarkai
        </h2>

        {!user ? (
          <p className="text-gray-600">
            Prisijunkite, kad peržiūrėtumėte savo bookmarkus.
          </p>
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-gray-600">Neturite bookmarkuotų procedūrų.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <ProcedureCard
                key={bookmark.id}
                procedure={bookmark}
                isBookmarked={bookmark.isBookmarked}
                onBookmarkToggle={handleBookmarkToggle}
                onDelete={() => handleDelete(bookmark.id)}
                isAdmin={user.role === "admin"}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
