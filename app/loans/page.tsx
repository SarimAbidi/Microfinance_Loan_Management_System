"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Client, Loan } from "../../types/index";

export default function LoansPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  const [clientId, setClientId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Business");
  const [duration, setDuration] = useState("12");
  const [startDate, setStartDate] = useState("");

  const fetchData = async () => {
    try {
      const cRes = await api.get("/clients");
      const lRes = await api.get("/loans");
      setClients(cRes.data);
      setLoans(lRes.data);
    } catch (error) {
      console.error("Failed to fetch loans data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateLoan = async () => {
    if (!clientId) return alert("Select client");

    try {
      await api.post("/loans", {
        client_id: clientId,
        amount: Number(amount),
        type,
        duration: Number(duration),
        start_date: startDate
      });

      setAmount("");
      setDuration("12");
      setStartDate("");

      fetchData();
    } catch (error) {
      console.error("Failed to create loan:", error);
      alert("Failed to create loan");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Loans</h1>

      
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Create Loan</h2>

        <select
          className="border p-2 mb-2 w-full"
          onChange={(e) => setClientId(Number(e.target.value))}
        >
          <option>Select Client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <select
          className="border p-2 mb-2 w-full"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option>Business</option>
          <option>Agriculture</option>
          <option>Personal</option>
        </select>

        <input
          placeholder="Duration (months)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <button
          onClick={handleCreateLoan}
          className="bg-green-600 text-white p-2 rounded"
        >
          Create Loan
        </button>
      </div>

      
      <div className="grid grid-cols-2 gap-4">
        {loans.map((loan) => (
          <div key={loan.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Loan #{loan.id}</h3>
            <p>Client: {clients.find((c) => c.id === loan.client_id)?.name}</p>
            <p>Amount: {loan.amount}</p>
            <p>Type: {loan.type}</p>
            <p>Duration: {loan.duration} months</p>
            <p>Start Date: {loan.start_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
