"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import { Client, Loan } from "../types/index";

export default function DashboardPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cRes = await api.get("/clients");
        const lRes = await api.get("/loans");
        setClients(cRes.data);
        setLoans(lRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const riskCounts = {
    Low: clients.filter(c => c.risk_score === "Low").length,
    Medium: clients.filter(c => c.risk_score === "Medium").length,
    High: clients.filter(c => c.risk_score === "High").length
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">Total Clients: {clients.length}</div>
        <div className="bg-white p-4 rounded shadow">Total Loans: {loans.length}</div>
        <div className="bg-white p-4 rounded shadow">
          Risk Distribution:
          <ul>
            <li>Low: {riskCounts.Low}</li>
            <li>Medium: {riskCounts.Medium}</li>
            <li>High: {riskCounts.High}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
