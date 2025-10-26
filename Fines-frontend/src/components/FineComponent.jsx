// import React, { useEffect, useState } from 'react'
// import { createFine, getFine, updateFine } from '../services/FineService'
// import { useNavigate, useParams } from 'react-router-dom'

// const FineComponent = () => {
//   const [form, setForm] = useState({
//     issueId: '',
//     amount: '',
//     reason: '',
//     status: 'Unpaid',
//     generatedDate: '',
//     paymentDate: ''
//   })

//   const navigate = useNavigate()
//   const { id } = useParams()

//   useEffect(() => {
//     if (id) {
//       getFine(id).then(res => {
//         const dto = res.data
//         setForm({
//           issueId: dto.issueId || '',
//           amount: dto.amount || '',
//           reason: dto.reason || '',
//           status: dto.status || 'Unpaid',
//           generatedDate: dto.generatedDate || '',
//           paymentDate: dto.paymentDate || ''
//         })
//       }).catch(console.error)
//     }
//   }, [id])

//   function handleChange(e) {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   function handleSubmit(e) {
//     e.preventDefault()
//     const body = {
//       issueId: form.issueId === '' ? null : Number(form.issueId),
//       amount: form.amount === '' ? null : Number(form.amount),
//       reason: form.reason,
//       status: form.status,
//       generatedDate: form.generatedDate === '' ? null : form.generatedDate,
//       paymentDate: form.paymentDate === '' ? null : form.paymentDate
//     }

//     if (id) {
//       updateFine(id, body).then(() => navigate('/fines')).catch(console.error)
//     } else {
//       createFine(body).then(() => navigate('/fines')).catch(console.error)
//     }
//   }

//   return (
//     <div className="card">
//       <h4 className="card-header">{id ? 'Update Fine' : 'Add Fine'}</h4>
//       <div className="card-body">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-2">
//             <label>Issue ID</label>
//             <input className="form-control" name="issueId" value={form.issueId} onChange={handleChange} />
//           </div>
//           <div className="mb-2">
//             <label>Amount</label>
//             <input type="number" step="0.01" className="form-control" name="amount" value={form.amount} onChange={handleChange} />
//           </div>
//           <div className="mb-2">
//             <label>Reason</label>
//             <input className="form-control" name="reason" value={form.reason} onChange={handleChange} />
//           </div>
//           <div className="mb-2">
//             <label>Status</label>
//             <select className="form-control" name="status" value={form.status} onChange={handleChange}>
//               <option value="Unpaid">Unpaid</option>
//               <option value="Paid">Paid</option>
//             </select>
//           </div>
//           <div className="mb-2">
//             <label>Generated Date</label>
//             <input type="date" className="form-control" name="generatedDate" value={form.generatedDate || ''} onChange={handleChange} />
//           </div>
//           <div className="mb-2">
//             <label>Payment Date</label>
//             <input type="date" className="form-control" name="paymentDate" value={form.paymentDate || ''} onChange={handleChange} />
//           </div>

//           <div className="mt-3">
//             <button className="btn btn-success me-2" type="submit">{id ? 'Update' : 'Save'}</button>
//             <button className="btn btn-secondary" type="button" onClick={() => navigate('/fines')}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default FineComponent
import React, { useState, useEffect } from "react";
import { createFine, getFine, updateFine } from "../services/FineService";
import { useNavigate, useParams } from "react-router-dom";

const FineComponent = () => {
  const [fine, setFine] = useState({
    issueId: "",
    amount: "",
    reason: "",
    status: "Unpaid",
    generatedDate: "",
    paymentDate: ""
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getFine(id)
        .then((res) => setFine(res.data))
        .catch((err) => console.log(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setFine({ ...fine, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = id
      ? updateFine(id, fine)
      : createFine(fine);

    apiCall
      .then(() => navigate("/fines"))
      .catch((err) => console.error("❌ API ERROR:", err));
  };

  return (
    <div className="container mt-4">
      <h3>{id ? "Update Fine" : "Add Fine"}</h3>
      <form onSubmit={handleSubmit} className="mt-3">

        <input
          className="form-control mb-2"
          type="number"
          name="issueId"
          placeholder="Issue ID"
          value={fine.issueId}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="number"
          step="0.01"
          name="amount"
          placeholder="Amount"
          value={fine.amount}
          onChange={handleChange}
          required
        />

        <input
          className="form-control mb-2"
          type="text"
          name="reason"
          placeholder="Reason"
          value={fine.reason}
          onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="status"
          value={fine.status}
          onChange={handleChange}
        >
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>

        <input
          className="form-control mb-2"
          type="date"
          name="generatedDate"
          value={fine.generatedDate}
          onChange={handleChange}
          required
        />

        {fine.status === "Paid" && (
          <input
            className="form-control mb-2"
            type="date"
            name="paymentDate"
            value={fine.paymentDate}
            onChange={handleChange}
          />
        )}

        <button className="btn btn-primary w-100 mt-2">
          {id ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default FineComponent;
