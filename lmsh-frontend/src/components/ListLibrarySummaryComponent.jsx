// import React, { useEffect, useState } from "react";
// import { fetchLibrarySummary } from "../services/LibrarySummaryService";
// import IssuedVsReturnedChart from "./IssuedVsReturnedChart";
// import FineStatusChart from "./FineStatusChart";

// const ListLibrarySummaryComponent = () => {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     fetchLibrarySummary()
//       .then(res => setData(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div className="container mt-3">
//       <h3 className="mb-4 text-center">📊 Library Summary Dashboard</h3>

//       <div className="row">
//         {[
//           { label: "Members", value: data.totalMembers },
//           { label: "Books", value: data.totalBooks },
//           { label: "Issued", value: data.totalIssued },
//           { label: "Returned", value: data.totalReturned },
//           { label: "Borrowed", value: data.totalBorrowed },
//           { label: "Total Fines (LKR)", value: data.totalFines }
//         ].map((card, i) => (
//           <div className="col-md-4 col-lg-2 mb-3" key={i}>
//             <div className="card shadow text-center p-3">
//               <h6>{card.label}</h6>
//               <h4 className="text-primary fw-bold">{card.value}</h4>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };





// return (
//   <div className="container mt-3">
//     <h3 className="mb-4 text-center">📊 Library Summary Dashboard</h3>

//     <div className="row">
//       {/* Existing summary cards */}
      
//     </div>

//     <div className="row mt-4">
//       <div className="col-md-6">
//         <IssuedVsReturnedChart 
//           issued={data.totalIssued || 0} 
//           returned={data.totalReturned || 0} 
//         />
//       </div>

//       <div className="col-md-6">
//         <FineStatusChart 
//           paid={data.totalFines > 0 ? data.totalFines : 0} 
//           unpaid={(data.totalBorrowed - data.totalReturned) || 0}
//         />
//       </div>
//     </div>
//   </div>
// );


// export default ListLibrarySummaryComponent;
import React, { useEffect, useState } from "react";
import { fetchLibrarySummary } from "../services/LibrarySummaryService";
import IssuedVsReturnedChart from "./IssuedVsReturnedChart";
import FineStatusChart from "./FineStatusChart";

const ListLibrarySummaryComponent = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetchLibrarySummary()
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-3">
      <h3 className="mb-4 text-center">📊 Library Summary Dashboard</h3>

      {/* Summary Cards */}
      <div className="row">
        {[
          { label: "Members", value: data.totalMembers },
          { label: "Books", value: data.totalBooks },
          { label: "Issued", value: data.totalIssued },
          { label: "Returned", value: data.totalReturned },
          { label: "Borrowed", value: data.totalBorrowed },
          { label: "Total Fines (LKR)", value: data.totalFines }
        ].map((card, i) => (
          <div className="col-md-4 col-lg-2 mb-3" key={i}>
            <div className="card shadow text-center p-3">
              <h6>{card.label}</h6>
              <h4 className="text-primary fw-bold">{card.value ?? 0}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <IssuedVsReturnedChart 
            issued={data.totalIssued || 0} 
            returned={data.totalReturned || 0} 
          />
        </div>

        <div className="col-md-6 mb-3">
          <FineStatusChart 
            paid={data.totalFines || 0} 
            unpaid={(data.totalBorrowed || 0) - (data.totalReturned || 0)} 
          />
        </div>
      </div>
    </div>
  );
};

export default ListLibrarySummaryComponent;
