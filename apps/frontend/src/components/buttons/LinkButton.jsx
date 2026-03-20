const LinkButton = ({ href, children, className = '' }) => {
  return (
    <a 
      href={href} 
      className={`text-sm text-[#BC0B2A] font-medium hover:underline ${className}`}
    >
      {children}
    </a>
  );
};

export default LinkButton;