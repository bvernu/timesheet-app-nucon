// //import React from 'react'

// // interface InputFieldProps {
// //   label: string;
// //   id: string;
// //   type?: string;
// //   value: string;
// //   onChange: (value: string) => void;
// //   autoFocus?: boolean;
// // }

// const InputField = ({
//   label,
//   id,
//   type = "text",
//   value,
//   onChange,
//   autoFocus = false,
// }) => {
//   return (
//     <form>
//       {" "}
//       <div className="mb-3">
//         <label htmlFor={id} className="form-label">
//           {label}
//         </label>
//         <input
//           type={type}
//           className="form-control"
//           id={id}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           autoFocus={autoFocus}
//         ></input>
//       </div>
//     </form>
//   );
// };

// export default InputField;

const InputField = ({ 
  label, 
  id, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  className = "" 
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type={type}
        className={`form-control ${className}`}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
};

export default InputField;