// import { ReactNode } from "react";



// const Card = ({ title, children }) => {
//   return (
//     <div className="card">
//       {title && <div className="card-heading">{title}</div>}
//       <div className="card-body">{children}</div>
//     </div>
//   );
// };

// export default Card;

const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header"><h5 className="mb-0">{title}</h5></div>}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;