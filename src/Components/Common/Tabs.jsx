// //import React from 'react'
// import { ReactNode } from "react";

// // interface Tab {
// //   id: string;
// //   label: string;
// //   content: ReactNode;
// // }

// // interface TabsProps {
// //   tabs: Tab[];
// // }

// const Tabs = ({ tabs }) => {
//   return (
//     <div>
//       <ul className="nav nav-pills mb-3" role="tablist">
//         {tabs.map((tab, index) => (
//           <li className="nav-item" role="presentation" key={tab.id}>
//             <button
//               className={`nav-link ${index === 0 ? "active" : ""}`}
//               id={`${tab.label}-tab`}
//               data-bs-toggle="pill"
//               data-bs-target={`#pills-${tab.label}`}
//               type="button"
//               role="pill"
//               aria-controls={`pills-${tab.label}`}
//               aria-selected={index === 0 ? "true" : "false"}
//             >
//               {tab.label}
//             </button>
//           </li>
//         ))}
//       </ul>
//       <div className="tab-content">
//         {tabs.map((tab, index) => (
//           <div
//             key={tab.id}
//             className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
//             id={`pills-${tab.label}`}
//             role="tabpanel"
//             aria-labelledby={`pills-${tab.label}-tab`}
//           >
//             {tab.content}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Tabs;

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <ul className="nav nav-tabs mb-3" role="tablist">
        {tabs.map((tab) => (
          <li className="nav-item" role="presentation" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? "show active" : ""}`}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;