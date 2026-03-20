/**
 *
 * A labelled number input for a single CFI rating category (0–100).
 *
 * Props:
 * - label (string): category name shown above the input
 * - value (string): current input value
 * - onChange (fn): called with the new string value on change
 * - invalid (bool): turns the label and border red when true
 */
const ScoreInput = ({ label, value, onChange, invalid }) => (
  <div className="flex flex-col items-center gap-1">
    <span className={`text-xs font-semibold ${invalid ? "text-red-500" : "text-[#BC0B2A]"}`}>
      {label}
    </span>
    <input
      type="number"
      min={1}
      max={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-16 text-center border rounded px-2 py-1 text-sm font-medium outline-none
        focus:ring-2 focus:ring-[#BC0B2A] transition
        ${invalid ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
    />
  </div>
);

export default ScoreInput;