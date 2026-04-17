// ============================================================================
// Calgary Map Component
// ============================================================================
// Displays OpenStreetMap centered on downtown Calgary.
// Props: { filters } — filter criteria from StationFilter (real-time)
//
// Filter fields used:
//   searchQuery  — station name
//   transitLine  — "all" | "red" | "blue" | "both"
//   category     — "" | "cleanliness" | "safety" | "accessibility" | "crowding"
//   ceiRange     — "" | "good" | "moderate" | "poor"
//   sortBy       — "none" | "cei_desc" | "cei_asc" | "name_asc" | "feedback"
//
// Map icons and popups are unchanged.
// ============================================================================

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useStations } from "../../contexts/StationContext";
import { useNavigate } from "react-router-dom";

// Set the map view on mount
const SetViewOnMount = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const redIcon = createIcon("red");
const blueIcon = createIcon("blue");
const purpleIcon = createIcon("violet");

const getIcon = (line) => {
  if (line === "Red") return redIcon;
  if (line === "Blue") return blueIcon;
  return purpleIcon;
};

const CalgaryMap = ({ filters = {} }) => {
  const calgaryCenter = [51.0447, -114.0719];
  const defaultZoom = 12;

  const { stations, loading } = useStations();
  const navigate = useNavigate();

  const {
    searchQuery = "",
    transitLine = "all",
    category = "",
    ceiRange = "",
    sortBy = "none",
  } = filters;

  const filteredStations = useMemo(() => {
    let data = stations.filter((station) => {
      if (
        searchQuery &&
        !station.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (transitLine !== "all") {
        const stationLine = station.line?.toLowerCase();
        if (transitLine === "both") {
          if (stationLine !== "both") return false;
        } else {
          if (stationLine !== transitLine && stationLine !== "both")
            return false;
        }
      }

      if (category) {
        const score = station.averageRatings?.[category];
        if (score == null || score < 3.5) return false;
      }

      if (ceiRange) {
        const overall = station.averageRatings?.overall;
        if (overall == null) return false;
        if (ceiRange === "good" && overall < 3.5) return false;
        if (ceiRange === "moderate" && (overall < 2 || overall >= 3.5))
          return false;
        if (ceiRange === "poor" && overall >= 2) return false;
      }

      return true;
    });

    switch (sortBy) {
      case "cei_desc":
        data = [...data].sort(
          (a, b) =>
            (b.averageRatings?.overall ?? -1) -
            (a.averageRatings?.overall ?? -1),
        );
        break;
      case "cei_asc":
        data = [...data].sort(
          (a, b) =>
            (a.averageRatings?.overall ?? 999) -
            (b.averageRatings?.overall ?? 999),
        );
        break;
      case "name_asc":
        data = [...data].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "feedback":
        data = [...data].sort(
          (a, b) => (b.totalFeedback ?? 0) - (a.totalFeedback ?? 0),
        );
        break;
      default:
        break;
    }

    return data;
  }, [stations, searchQuery, transitLine, category, ceiRange, sortBy]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={calgaryCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
        minZoom={10}
        maxZoom={16}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <SetViewOnMount center={calgaryCenter} zoom={defaultZoom} />

        {!loading &&
          filteredStations.map((station) => {
            const { lat, lng } = station.coordinates;
            return (
              <Marker
                key={station._id}
                position={[lat, lng]}
                icon={getIcon(station.line)}>
                <Popup>
                  <div className="w-48">
                    <h3 className="font-bold text-sm mb-1">{station.name}</h3>
                    <p className="text-xs text-gray-600">
                      CEI: {station.averageRatings?.overall ?? "N/A"}
                    </p>
                    <p className="text-xs text-gray-600 mb-2">
                      Feedback: {station.totalFeedback ?? 0}
                    </p>
                    <button
                      onClick={() => navigate(`/stations/${station._id}`)}
                      className="w-full px-4 py-2 bg-[#BC0B2A] text-white text-sm font-semibold rounded-md hover:bg-[#A30A26] transition-colors">
                      View Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default CalgaryMap;