/**
 * A checkbox input (used for terms agreement)
 */
const CheckboxField = ({ label, name, checked, onChange, error }) => {
  return (
    <div className="mb-4">
      {/* Checkbox with label */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-0.5 w-4 h-4 text-[#BC0B2A] border-gray-300 rounded focus:ring-[#BC0B2A]"
        />
        <span className="text-xs text-gray-700">{label}</span>
      </label>
      
      {/* Error message if checkbox validation fails */}
      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default CheckboxField;