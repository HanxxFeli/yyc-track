import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "leaflet/dist/leaflet.css";
import StationFilter from "../components/map/StationFilter";
import CalgaryMap from "../components/map/CalgaryMap";

export default function Home() {
  // Filters are owned here and passed down to both StationFilter and CalgaryMap
  const [filters, setFilters] = useState({
    searchQuery: "",
    transitLine: "all",
    category: "",
    ceiRange: "",
    sortBy: "none",
  });

  const { user } = useAuth();

  return (
    <div className="w-full h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 h-full">
        {/* Filter sidebar */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 h-auto lg:h-full lg:max-h-full overflow-hidden">
          <StationFilter onFilterChange={setFilters} isAuthenticated={!!user} />
        </div>

        {/* Map */}
        <div className="flex-1 h-[500px] lg:h-full bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <CalgaryMap filters={filters} />
        </div>
      </div>
    </div>
  );
}
