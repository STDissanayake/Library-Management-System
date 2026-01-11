"use client"

import { useEffect, useMemo, useState } from "react"
import FineService from "../service/FineService"
import "./FinesManagement.css"

const FinesManagement = () => {
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("unpaid")

  const normalizeFines = (payload) => {
    if (Array.isArray(payload)) return payload
    if (payload && Array.isArray(payload.data)) return payload.data
    if (payload && typeof payload === "object") return [payload]
    return []
  }

  const fetchFines = async () => {
    try {
      setLoading(true)
      setError("")

      const res =
        activeTab === "paid"
          ? await FineService.getPaidFines()
          : activeTab === "waived"
            ? await FineService.getAllFines()
            : await FineService.getUnpaidFines()

      const all = normalizeFines(res?.data)
      if (activeTab === "waived") {
        setFines(all.filter((f) => (f.status || "").toString().toUpperCase() === "WAIVED"))
      } else {
        setFines(all)
      }
    } catch (e) {
      console.error("Error fetching fines:", e)
      setError("Failed to load fines. Please check if the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFines()
  }, [activeTab])

  const totalAmount = useMemo(() => {
    const list = Array.isArray(fines) ? fines : normalizeFines(fines)
    return list.reduce((sum, f) => sum + (Number(f.amount) || 0), 0)
  }, [fines])

  const handlePay = async (fineId) => {
    if (!window.confirm("Mark this fine as PAID?")) return
    try {
      await FineService.payFine(fineId)
      fetchFines()
    } catch (e) {
      console.error("Error paying fine:", e)
      alert("Failed to pay fine")
    }
  }

  const handleWaive = async (fineId) => {
    if (!window.confirm("Waive this fine?")) return
    try {
      await FineService.waiveFine(fineId)
      fetchFines()
    } catch (e) {
      console.error("Error waiving fine:", e)
      alert("Failed to waive fine")
    }
  }

  if (loading) return <div className="loading">Loading fines...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="fines-management">
      <div className="fines-header">
        <h1>💰 Fines</h1>
        <div className="fines-summary">
          Total: <strong>Rs {totalAmount.toFixed(2)}</strong>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "unpaid" ? "active" : ""}`} onClick={() => setActiveTab("unpaid")}>
          Unpaid
        </button>
        <button className={`tab ${activeTab === "paid" ? "active" : ""}`} onClick={() => setActiveTab("paid")}>
          Paid
        </button>
        <button className={`tab ${activeTab === "waived" ? "active" : ""}`} onClick={() => setActiveTab("waived")}>
          Waived
        </button>
      </div>

      <div className="fines-table">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              <th>Book</th>
              <th>Amount</th>
              <th>Overdue Days</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(fines) ? fines : normalizeFines(fines)).map((fine) => {
              const status = (fine.status || "").toString().toUpperCase()
              const memberName = fine.member ? `${fine.member.firstName || ""} ${fine.member.lastName || ""}`.trim() : "N/A"
              const bookTitle = fine.borrow?.book?.title || "N/A"
              const fineDate = fine.fineDate ? new Date(fine.fineDate).toLocaleDateString() : "N/A"

              return (
                <tr key={fine.id}>
                  <td>{memberName || "N/A"}</td>
                  <td>{bookTitle}</td>
                  <td>Rs {(Number(fine.amount) || 0).toFixed(2)}</td>
                  <td>{fine.overdueDays ?? "-"}</td>
                  <td>{fineDate}</td>
                  <td>
                    <span className={`status-badge status-${status.toLowerCase() || "unknown"}`}>{status || "UNKNOWN"}</span>
                  </td>
                  <td>
                    {status === "PENDING" && (
                      <div className="actions">
                        <button className="btn btn-pay" onClick={() => handlePay(fine.id)}>
                          Pay
                        </button>
                        <button className="btn btn-waive" onClick={() => handleWaive(fine.id)}>
                          Waive
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {(fines || []).length === 0 && (
          <div className="no-data">
            <h3>No fines found</h3>
            <p>Return an overdue book to generate a fine.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FinesManagement
