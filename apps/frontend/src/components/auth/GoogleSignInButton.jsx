import googleLogo from "../../assets/google.png";

const GoogleSignInButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition"
    >
      <img src={googleLogo} alt="Google" className="w-10 h-5" />
      Sign up with Google
    </button>
  );
};

export default GoogleSignInButton;
