// // import React from 'react'

// const Button = ({ children, onClick }) => {
//   return (
//     <button className="btn btn-primary" type="button" onClick={onClick}>
//       {children}
//     </button>
//   );
// };

// export default Button;

const Button = ({ children, onClick, variant = "primary", type = "button", className = "" }) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`} 
      type={type} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;