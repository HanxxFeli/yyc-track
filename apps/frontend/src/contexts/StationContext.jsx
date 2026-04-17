import { createContext, useContext, useEffect, useState } from "react";

const StationContext = createContext(null);

export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stations`);
      if (!res.ok) throw new Error("Failed to fetch stations");
      const data = await res.json();
      setStations(data.stations);
    } catch (err) {
      console.error("StationContext error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  return (
    <StationContext.Provider
      value={{ stations, loading, error, refreshStations: fetchStations }}>
      {children}
    </StationContext.Provider>
  );
};

export const useStations = () => {
  const context = useContext(StationContext);
  if (!context)
    throw new Error("useStations must be used within a StationProvider");
  return context;
};
