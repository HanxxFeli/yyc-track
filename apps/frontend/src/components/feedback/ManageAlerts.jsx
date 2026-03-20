import trashIcon from "../../assets/trash-icon.png";

const ManageAlerts = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full">

      {/* title + description */}
      <h2 className="text-xl font-semibold mb-1">Manage Alerts</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Customize which station updates you'd like to be notified about.
      </p>

      {/* select station */}
      <label className="block text-sm font-medium mb-1">Select Station</label>
      <div className="relative mb-8">
        <select
          className="
            w-full 
            border border-gray-300
            rounded-lg 
            px-4 py-3 
            text-sm 
            bg-gray-50 
            text-gray-700
            appearance-none
          "
        >
          <option value="" hidden></option>
          <option>Brentwood</option>
          <option>Dalhousie</option>
          <option>Marlborough</option>
        </select>

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          ▼
        </span>
      </div>

      {/* Alert Type */}
      <label className="block text-sm font-medium mb-3">Alert Type</label>

      <div className="space-y-4 mb-8">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" disabled className="w-5 h-5 accent-[#BC0B2A]" />
          CEI drops below threshold
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" disabled className="w-5 h-5 accent-[#BC0B2A]" />
          New feedback added
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" disabled className="w-5 h-5 accent-[#BC0B2A]" />
          Safety-related flags
        </label>
      </div>

      {/* Add Alert */}
      <div className="flex justify-end mb-6">
        <button
          disabled
          className="
            px-4 py-2 
            rounded-md 
            border border-[#BC0B2A] 
            text-[#BC0B2A] 
            text-sm 
            hover:bg-red-50 
            disabled
          "
        >
          Add Alert
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_1fr_60px] text-sm font-medium text-gray-700 border-b pb-2">
        <div>Station</div>
        <div>Type</div>
        <div className="text-center">Action</div>
      </div>

      {/* Static Rows */}
      <div className="divide-y text-sm mt-2">

        <div className="grid grid-cols-[1fr_1fr_60px] py-4 items-center">
          <div>Brentwood</div>
          <div>CEI drops below threshold</div>
          <div className="flex justify-center">
            <img src={trashIcon} className="w-5 h-5 opacity-80" alt="delete" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_60px] py-4 items-center">
          <div>City Hall</div>
          <div>New feedback added</div>
          <div className="flex justify-center">
            <img src={trashIcon} className="w-5 h-5 opacity-80" alt="delete" />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_1fr_60px] py-4 items-center">
          <div>Marlborough</div>
          <div>Safety-related flags</div>
          <div className="flex justify-center">
            <img src={trashIcon} className="w-5 h-5 opacity-80" alt="delete" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageAlerts;