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
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BC0B2A] ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
