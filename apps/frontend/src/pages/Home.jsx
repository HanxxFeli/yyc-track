import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import 'leaflet/dist/leaflet.css';
import StationFilter from "../components/map/StationFilter";
import CalgaryMap from "../components/map/CalgaryMap";

export default function Home() { 
  // Filter state: search query, category, and transit line
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: '',
    transitLine: 'all'
  });

  const {user} =useAuth()

  // Update filters when user interacts with StationFilter component
  const handleFilterChange = (newFilters) => { 
    console.log("Filters applied:", newFilters);
    setFilters(newFilters);
  };

  return ( 
    // Main container: proper viewport height calculation
    <div className="w-full h-[calc(100vh-64px)] px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8">
      {/* Content wrapper with responsive layout */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6 h-full">
        
        {/* Filter Component - constrained height to prevent overflow */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 h-auto lg:h-full lg:max-h-full overflow-hidden">
          <StationFilter
            onFilterChange={handleFilterChange}
            isAuthenticated={user? true : false}
          />
        </div>
      
        {/* Map Panel */}
        <div className="flex-1 h-[500px] lg:h-full bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <CalgaryMap filters={filters} />
        </div>

      </div>
    </div>    
  );
}