/**
 * FilterBar Component
 * 
 * - a reusable, configuration-driven filter UI component
 * 
 * props:
 * - filters: array describing inputs to render (search/select)
 * - values: current filter state object
 * - onChange: function to update filter state (key, value)
 * - onClear: function to reset all filters
 * 
 * this component is supposed to be generic so that it can be reused across different pages
 */
export default function FilterBar({ filters, values, onChange, onClear }) {
  return (
    <div className="w-full rounded-xl bg-white shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-5">
        
        {/* Dynamically render filter controls based on config */}
        {filters.map((f) => {

          /** 
           * Search input
           * 
           * - renders a text input for searching
           * - controlled input: value comes from parent state
           */
          if (f.type === "search") {
            return (
              <div key={f.key} className="relative flex-1 min-w-[260px]">
                <input
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full h-11 rounded-xl border border-gray-200 bg-white px-5 pr-12 text-sm outline-none"
                />

                {/* Magnifier Icon */}
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {/* magnifier */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            );
          }

          /**
           * Select Dropdown
           * 
           * - renders a dropdown based on provided options
           * - supports both string options and { value, label } objects
           */
          if (f.type === "select") {
            return (
              <div key={f.key} className="min-w-[200px]">
                <select
                  value={values[f.key] ?? "all"}
                  onChange={(e) => onChange(f.key, e.target.value)}
                  className="w-full h-14 rounded-xl border border-gray-200 bg-white px-5 text-sm outline-none"
                >
                  {/* Default "All" option */}
                  <option value="all">{f.label}</option>

                  {/* Render configured options */}
                  {f.options.map((opt) => {
                    const value = typeof opt === "string" ? opt : opt.value;
                    const label = typeof opt === "string" ? opt : opt.label;

                    return (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          }

          return null;
        })}

        {/* Clear Filters Button */}
        <button
          onClick={onClear}
          className="h-10 rounded-lg border border-red-500 px-4 text-sm font-medium text-red-600 hover:bg-red-50 transition" 
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}