import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiUsers,
  FiTrendingUp,
  FiEdit3,
  FiBell,
} from "react-icons/fi";
import CalgaryMap from "../components/map/CalgaryMap";
import "leaflet/dist/leaflet.css";

const LandingPage = () => {
  // Transit updates - normally would fetch from backend API
  const updates = [
    {
      id: 1,
      title: "CEI drops at City Hall",
      description: "Crowding increased during peak hours.",
      time: "2 hours ago",
      dotColor: "bg-red-500",
    },
    {
      id: 2,
      title: "Blue Line Mechanical Delay",
      description: "Minor service disruption earlier today.",
      time: "4 hours ago",
      dotColor: "bg-orange-500",
    },
    {
      id: 3,
      title: "Dalhousie Accessibility Upgrade",
      description: "New elevators now available to public.",
      time: "1 day ago",
      dotColor: "bg-blue-500",
    },
    {
      id: 4,
      title: "CTrain Weekend Maintenance",
      description: "Expect slower travel on Sunday afternoon.",
      time: "2 days ago",
      dotColor: "bg-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - main landing area */}
      <section className="bg-white py-20 sm:py-24 lg:py-32 relative overflow-hidden">
        {/* Grid pattern only in hero section */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {" "}
          {/* z-10 to stay above grid pattern */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {" "}
            {/* 2 columns on desktop, stacks on mobile */}
            {/* Left side - text and buttons */}
            <div>
              {/* Small label at top */}
              <div className="inline-block mb-4">
                <span className="text-sm font-semibold text-[#BC0B2A] uppercase tracking-wide">
                  For Calgary Commuters
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                Track real-time station experiences.
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 mb-8">
                Discover how Calgary commuters rate transit stations for safety,
                cleanliness, accessibility, and crowding.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/map"
                  className="px-8 py-4 bg-[#BC0B2A]  text-white rounded-lg font-semibold hover:bg-red-700 transition text-center"
                >
                  Explore Map
                </Link>
                <Link
                  to="/stations"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            {/* Right side - map preview */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-96">
                {" "}
                {/* Fixed height for map */}
                <CalgaryMap
                  filters={{
                    searchQuery: "",
                    category: "",
                    transitLine: "all",
                  }}
                />
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t">
                <p className="text-xs text-gray-600 text-center">
                  Live data from Calgary Transit Feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - why use this app */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why YYC Track?
            </h2>
            <p className="text-lg text-gray-600">
              Real-time insights to make your commute safer and more informed
            </p>
          </div>

          {/* Feature cards - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FiBarChart2 className="w-6 h-6 text-[#BC0B2A] " />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Station Insights
              </h3>
              <p className="text-gray-600">
                Compare safety, cleanliness, and accessibility ratings across
                all stations to plan your route.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-[#BC0B2A] " />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Community Powered
              </h3>
              <p className="text-gray-600">
                Join thousands of Calgary commuters sharing real experiences to
                improve our transit system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="w-6 h-6 text-[#BC0B2A] " />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Live Updates
              </h3>
              <p className="text-gray-600">
                Get instant notifications when station conditions change
                throughout the day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - 3 step process */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to make your commute better
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#BC0B2A] text-white rounded-full font-bold text-lg mb-6">
                1
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <FiEdit3 className="w-10 h-10 text-[#BC0B2A]  mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Submit Feedback
                </h3>
                <p className="text-gray-600 text-sm">
                  Rate your experience at any CTrain station in seconds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#BC0B2A] text-white rounded-full font-bold text-lg mb-6">
                2
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <FiTrendingUp className="w-10 h-10 text-[#BC0B2A]  mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Real-time Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Our system instantly updates station scores for everyone.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              {/* Number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#BC0B2A] text-white rounded-full font-bold text-lg mb-6">
                3
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <FiBell className="w-10 h-10 text-[#BC0B2A]  mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Stay Informed
                </h3>
                <p className="text-gray-600 text-sm">
                  Get alerts when conditions change at your stations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - encourage sign up */}
      <section className="py-20 sm:py-24 bg-[#BC0B2A]  text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Find your station now
          </h2>

          {/* Description */}
          <p className="text-xl mb-10 text-red-100">
            Search, filter, and explore real-time ratings for every CTrain
            station in Calgary.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              to="/map"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Explore Stations
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Updates - news cards */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Latest Transit Updates
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed about what's happening across Calgary's CTrain
              network
            </p>
          </div>

          {/* News cards grid - 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {updates.map(
              (
                update, // Loop through each update
              ) => (
                <div
                  key={update.id} // Unique key for each card
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                >
                  {/* Header with colored dot and title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-2 h-2 rounded-full ${update.dotColor} mt-2`}
                    ></div>{" "}
                    {/* Status dot */}
                    <h3 className="font-bold text-gray-900 text-sm">
                      {update.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">
                    {update.description}
                  </p>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-400">{update.time}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
