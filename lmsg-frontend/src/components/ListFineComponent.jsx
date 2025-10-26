import React, { useEffect, useState } from 'react'
import { listFines, deleteFine } from '../services/FineService'
import { useNavigate } from 'react-router-dom'

const ListFineComponent = () => {
  const [fines, setFines] = useState([])
  const navigate = useNavigate()

  useEffect(() => { fetchFines() }, [])

  function fetchFines() {
    listFines()
      .then(res => setFines(res.data))
      .catch(err => console.error(err))
  }

  function onEdit(id) { navigate(`/fines/edit/${id}`) }
  function onDelete(id) {
    if (!window.confirm('Delete this fine?')) return
    deleteFine(id).then(() => fetchFines()).catch(err => console.error(err))
  }

  return (
    <div>
      <h3>Fine Reports</h3>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => navigate('/fines/add')}>Add Fine</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th><th>Issue ID</th><th>Amount</th><th>Reason</th><th>Status</th><th>Generated</th><th>Payment Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fines.length === 0 && <tr><td colSpan="8" className="text-center">No records</td></tr>}
          {fines.map(f => (
            <tr key={f.fineId}>
              <td>{f.fineId}</td>
              <td>{f.issueId}</td>
              <td>{f.amount}</td>
              <td>{f.reason}</td>
              <td>{f.status}</td>
              <td>{f.generatedDate}</td>
              <td>{f.paymentDate}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => onEdit(f.fineId)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(f.fineId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListFineComponent
