import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import { ToastContainer } from "react-toastify";
import TourCard from "./TourCard";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext"; 

const API_URL = import.meta.env.VITE_API_URL;

export default function ToursList() {
  const { user } = useContext(UserContext); 
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("title_asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set()); 

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      const [sort_field, sort_direction] = sortOption.split("_");

      try {
        const response = await axios.get(`${API_URL}/tours`, {
          params: {
            search,
            category,
            sort_field,
            sort_direction,
            page,
            limit,
          },
          withCredentials: true,
        });
        setTours(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error(error.message);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookmarks = async () => {
      if (!user) return;
      try {
        const res = await axios.get(`${API_URL}/bookmarks`, {
          withCredentials: true,
        });
        const ids = res.data.data.map((b) => b.tour_id);
        setBookmarkedIds(new Set(ids));
      } catch (err) {
        console.error("Nepavyko gauti bookmarkų");
      }
    };

    fetchTours();
    fetchBookmarks(); // ➕ Pridėta
  }, [search, category, sortOption, page, limit, user]);

  const handleBookmarkToggle = (tourId, isBookmarked) => {
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      isBookmarked ? updated.add(tourId) : updated.delete(tourId);
      return updated;
    });

    // Atvaizdavimui išlaikyti ir seną būdą
    setTours((prevTours) =>
      prevTours.map((tour) =>
        tour.id === tourId ? { ...tour, isBookmarked } : tour
      )
    );
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Ar tikrai norite ištrinti šią pocedura?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/tours/${id}`, {
        withCredentials: true,
      });
      setTours((prevTours) => prevTours.filter((tour) => tour.id !== id));
      toast.success('Procedura sėkmingai ištrinta');
    } catch (error) {
      console.error('Klaida trynimo metu:', error);
      toast.error('Nepavyko ištrinti proceduros');
    }
  };

  return (
    <>
      <Navigation />
      <ToastContainer />
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by title or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Categories</option>
            <option value="individual">Individualios</option>
            <option value="groups">Grupinės</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="title_asc">Title A–Z</option>
            <option value="title_desc">Title Z–A</option>
            <option value="rating_asc">Rating ↑</option>
            <option value="rating_desc">Rating ↓</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-8 justify-center">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : tours.length === 0 ? (
            <p>No procedures found.</p>
          ) : (
            tours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                onDelete={() => handleDelete(tour.id)}
                isBookmarked={bookmarkedIds.has(tour.id)} 
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))
          )}
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={page >= totalPages}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
