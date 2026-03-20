// mock monitoring station data
export const MOCK_MONITORING_STATIONS = [
  { id: "brentwood", name: "Brentwood Station", line: "Red", cei: 86, ceiStatus: "stable", trend: [62,66,66,68,70,72,74,76,78,80,83,86] },
  { id: "chinook", name: "Chinook Station", line: "Red", cei: 74, ceiStatus: "moderate", trend: [82,80,78,76,74,73,73,73,73,73,74,74] },
  { id: "cityhall", name: "City Hall Station", line: "Dual", cei: 59, ceiStatus: "poor", trend: [78,74,70,66,65,64,63,62,61,60,59,59] },
  { id: "saddletowne", name: "Saddletowne Station", line: "Blue", cei: 74, ceiStatus: "moderate", trend: [60,62,64,66,68,69,70,71,72,73,74,74] },
  { id: "university", name: "University Station", line: "Red", cei: 86, ceiStatus: "stable", trend: [58,60,62,66,66,68,70,72,76,80,83,86] },
  { id: "marlborough", name: "Marlborough Station", line: "Blue", cei: 74, ceiStatus: "moderate", trend: [78,77,76,75,74,74,74,74,74,74,74,74] },
];

export const MOCK_FLAGGED_STATIONS = [
  { station: "City Hall", line: "Dual", avgCei: 64, issue: "CEI dropped below 65", lastUpdated: "2 hours ago", action: "Review" },
  { station: "Marlborough", line: "Blue", avgCei: 66, issue: "Multiple user safety concerns", lastUpdated: "1 day ago", action: "Investigate" },
  { station: "Crowfoot", line: "Red", avgCei: 78, issue: "CEI trend decreasing", lastUpdated: "3 days ago", action: "View Details" },
  { station: "Sunnyside", line: "Red", avgCei: 68, issue: "Increased crowding during morning rush", lastUpdated: "5 days ago", action: "Review" },
  { station: "Franklin", line: "Blue", avgCei: 57, issue: "CEI dropped below threshold", lastUpdated: "1 week ago", action: "Investigate" },
  { station: "Southland", line: "Red", avgCei: 62, issue: "Accessibility complaints", lastUpdated: "1 week ago", action: "Investigate" },
];