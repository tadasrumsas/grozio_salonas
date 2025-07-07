import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { FaStar, FaHeart } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../contexts/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProcedureCard({
  procedure,
  onDelete,
  isBookmarked: isBookmarkedProp,
  onBookmarkToggle,
}) {
  const { user } = useContext(UserContext);
  const isAdmin = user && user.role === "admin";
  const isLoggedIn = !!user;
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedProp ?? false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsBookmarked(isBookmarkedProp ?? false);
  }, [isBookmarkedProp]);

  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) {
      toast.error("Prisijunkite, kad galėtumėte pridėti bookmarką");
      return;
    }
    try {
      if (isBookmarked) {
        await axios.delete(`${API_URL}/bookmarks/${procedure.id}`, {
          withCredentials: true,
        });
        setIsBookmarked(false);
        toast.success("Procedūra pašalinta iš bookmarkų");
        onBookmarkToggle?.(procedure.id, false); 
      } else {
        await axios.post(
          `${API_URL}/bookmarks/${procedure.id}`,
          {},
          {
            withCredentials: true,
          }
        );
        setIsBookmarked(true);
        toast.success("Procedūra pridėta prie bookmarkų");
        onBookmarkToggle?.(procedure.id, true); 
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Nepavyko atnaujinti bookmarko";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 min-w-[250px] bg-white border-2 border-gray-200 rounded-xl shadow-md p-4 mb-4 hover:scale-105 transition-all duration-300">
      <div className="relative">
        <img
          className="w-full h-[16rem] sm:h-[14rem] object-cover rounded-lg shadow-sm"
          src={procedure.image}
          alt={procedure.title}
        />
        {isLoggedIn && (
          <button
            onClick={handleBookmarkToggle}
            className="absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors"
            title={
              isBookmarked ? "Pašalinti iš bookmarkų" : "Pridėti prie bookmarkų"
            }
          >
            <FaHeart
              className={isBookmarked ? "text-red-500" : "text-gray-400"}
              size={24}
            />
          </button>
        )}
      </div>
      <div className="mt-3">
        <h2 className="font-bold text-xl sm:text-2xl text-gray-800 truncate">
          {procedure.title}
        </h2>
        <p className="text-gray-600 text-sm mt-1">{procedure.duration} min</p>
        <p className="text-gray-600 text-sm mt-1">{procedure.category_name}</p>
        <p className="text-gray-600 text-sm mt-1">{procedure.location}</p>
        <p className="text-gray-800 font-semibold text-lg">
          {procedure.price}€
        </p>
        <p className="flex items-center text-gray-600 text-sm mt-1">
          {procedure.rating}
          <FaStar className="text-yellow-400 ml-1" />
        </p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex flex-wrap gap-2 mt-4">
          <Link to={`/procedure/${procedure.id}`} className="flex-1">
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200">
              Details
            </button>
          </Link>
          {isAdmin && (
            <Link to={`/update/${procedure.id}`} className="flex-1">
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                Update
              </button>
            </Link>
          )}
          {isAdmin && (
            <button
              onClick={onDelete}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
