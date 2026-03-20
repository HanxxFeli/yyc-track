/*
 * - label: The label text displayed above the input
 * - type: Input type (text, email, etc.) - defaults to "text"
 * - name: Input name attribute for form handling
 * - value: Current input value
 * - onChange: Function to handle input changes
 * - error: Error message to display (if any)
 */

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      {/* Input label */}
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Input field with error state styling */}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />

      {/* Error message display */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
