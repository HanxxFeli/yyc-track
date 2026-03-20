/**
 * Needs to add password requirements
 * 
 * PasswordStrength Component
 * 
 * indicator that shows password strength (Weak, Fair, Good, Strong)
 * Evaluates password based on
 * - Length (8+ characters)
 * - Mixed case (uppercase and lowercase)
 * - Numbers
 * - Special characters
 * 
 */


const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    const levels = [
      { level: 1, text: 'Weak', color: 'bg-red-500' },
      { level: 2, text: 'Fair', color: 'bg-orange-500' },
      { level: 3, text: 'Good', color: 'bg-yellow-500' },
      { level: 4, text: 'Strong', color: 'bg-green-500' }
    ];

    return levels[strength - 1] || { level: 0, text: '', color: '' };
  };

  const strength = getStrength();

  if (!password) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${(strength.level / 4) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">{strength.text}</span>
      </div>
    </div>
  );
};

export default PasswordStrength;