import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navigation from "./Navigation";
import { ToastContainer } from "react-toastify";
import ProcedureCard from "./ProcedureCard";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProceduresList() {
  const { user } = useContext(UserContext);
  const [procedures, setProcedures] = useState([]);
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
    const fetchProcedures = async () => {
      setLoading(true);
      const [sort_field, sort_direction] = sortOption.split("_");

      try {
        const response = await axios.get(`${API_URL}/procedures`, {
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
        setProcedures(response.data.data);
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
        const ids = res.data.data.map((b) => b.procedure_id);
        setBookmarkedIds(new Set(ids));
      } catch (err) {
        console.error("Nepavyko gauti bookmarkų");
      }
    };

    fetchProcedures();
    fetchBookmarks(); 
  }, [search, category, sortOption, page, limit, user]);

  const handleBookmarkToggle = (procedureId, isBookmarked) => {
    setBookmarkedIds((prev) => {
      const updated = new Set(prev);
      isBookmarked ? updated.add(procedureId) : updated.delete(procedureId);
      return updated;
    });

    setProcedures((prevProcedures) =>
      prevProcedures.map((procedure) =>
        procedure.id === procedureId
          ? { ...procedure, isBookmarked }
          : procedure
      )
    );
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Ar tikrai norite ištrinti šią pocedura?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/procedures/${id}`, {
        withCredentials: true,
      });
      setProcedures((prevProcedures) =>
        prevProcedures.filter((procedure) => procedure.id !== id)
      );
      toast.success("Procedura sėkmingai ištrinta");
    } catch (error) {
      console.error("Klaida trynimo metu:", error);
      toast.error("Nepavyko ištrinti proceduros");
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
          ) : procedures.length === 0 ? (
            <p>No procedures found.</p>
          ) : (
            procedures.map((procedure) => (
              <ProcedureCard
                key={procedure.id}
                procedure={procedure}
                onDelete={() => handleDelete(procedure.id)}
                isBookmarked={bookmarkedIds.has(procedure.id)}
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
            onClick={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
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
