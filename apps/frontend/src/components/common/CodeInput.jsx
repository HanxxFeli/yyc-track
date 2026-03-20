/**
 * Single digit input field for verification codes
 * Automatically focuses next input on entry
 */

const CodeInput = ({ value, onChange, onKeyDown, index, inputRef }) => {
  return (
    <input
      ref={inputRef}
      type="text"
      maxLength="1"
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      className="w-12 h-14 text-center text-2xl font-medium border-2 border-gray-200 rounded focus:outline-none focus:border-gray-300"
    />
  );
};

export default CodeInput;