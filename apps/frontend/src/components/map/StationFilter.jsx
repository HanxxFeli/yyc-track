// ============================================================================
// Station Filter Component
// ============================================================================
// Search and filter form for CTrain stations by name, category, line, and CEI rating
// Props: { onFilterChange, isAuthenticated } - callback and auth status
// ============================================================================

import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

// Values for the transit lines for mapping in radio button 
const TRANSIT_LINES = [
    { value: 'all', label: 'All Lines' },
    { value: 'red', label: 'Red Line' },
    { value: 'blue', label: 'Blue Line' }
];

// Radio button style for selected and unselected
const RADIO_STYLES = { 
    selected: 'bg-[#BC0B2A] border-2 border-[#BC0B2A]',
    unselected: 'border border-gray-300 bg-transparent'
}

const StationFilter = ({ onFilterChange, isAuthenticated = false }) => { 
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [transitLine, setTransitLine] = useState('all');

    const handleSearchChange = (e) => { 
        setSearchQuery(e.target.value);
    }
    const handleCategoryChange = (e) => { 
        setCategory(e.target.value);
    }
    const handleTransitLineChange = (e) => { 
        setTransitLine(e.target.value);
    }

    const handleApplyFilter = () => { 
        onFilterChange({
            searchQuery, 
            category,
            transitLine
        });
    }

    return ( 
        // Container with proper height constraints - max-height on desktop to prevent overflow
        <div className="w-full h-auto lg:h-full lg:max-h-full bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col overflow-hidden">
            
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                    Find a CTrain Station
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                    Search and filter stations by category and CEI rating.
                </p>
            </div>

            {/* Scrollable content area - takes remaining space and allows scrolling */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                <div className="space-y-5">
                    
                    {/* Search Station */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Search Station
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition-all"
                            placeholder="e.g., Chinook, City Hall"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-md text-sm text-gray-900 bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#BC0B2A] focus:border-transparent transition-all"
                                value={category}
                                onChange={handleCategoryChange}
                            >
                                <option value="" disabled hidden>Select one...</option>
                                <option value="residential">Cleanliness</option>
                                <option value="commercial">Crowding</option>
                                <option value="mixed">Accessibility</option>
                                <option value="transit-hub">Safety</option>
                            </select>
                            {/* Dropdown icon using react-icons */}
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                        </div>
                    </div>

                    {/* Transit Line */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Transit Line
                        </label>
                        <div className="flex flex-col gap-3">
                            {TRANSIT_LINES.map(({ value, label }) => (
                                <label key={value} className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="transitLine"
                                        value={value}
                                        checked={transitLine === value}
                                        onChange={handleTransitLineChange}
                                        className="sr-only"
                                    />
                                    <span className={`w-5 h-5 rounded-full mr-2.5 transition-all ${
                                        transitLine === value ? RADIO_STYLES.selected : RADIO_STYLES.unselected
                                    }`} />
                                    <span className="text-sm text-gray-800">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* CEI Range */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            CEI Range
                        </label>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-green-500 mr-2.5"></span>
                                <span className="text-sm text-gray-800">Good (4-5)</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-amber-500 mr-2.5"></span>
                                <span className="text-sm text-gray-800">Moderate (2-4)</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-4 h-4 rounded-full bg-red-500 mr-2.5"></span>
                                <span className="text-sm text-gray-800">Poor (0-2)</span>
                            </div>
                        </div>
                    </div>

                    {/* Login/Register Alert - only show when not authenticated */}
                    {!isAuthenticated && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm font-semibold text-gray-800 mb-1">
                                Want to leave feedback?
                            </p>
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                Login or register to share your station experience.
                            </p>
                            <div className="flex gap-2">
                                <button className="flex-1 px-4 py-2 bg-[#BC0B2A] text-white text-sm font-semibold rounded-md hover:bg-[#A30A26] transition-colors">
                                    Login
                                </button>
                                <button className="flex-1 px-4 py-2 bg-white text-[#BC0B2A] text-sm font-semibold rounded-md border border-[#BC0B2A] hover:bg-red-50 transition-colors">
                                    Register
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Apply Filter Button - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-gray-200">
                <button
                    onClick={handleApplyFilter}
                    className="w-full px-4 py-3 bg-[#BC0B2A] text-white text-sm sm:text-base font-semibold rounded-md hover:bg-[#A30A26] active:translate-y-px transition-all"
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
}

export default StationFilter;