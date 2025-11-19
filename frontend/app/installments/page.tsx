"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Installment, Loan } from "../../types/index";

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<Installment[]>([]);

  const fetchInstallments = async () => {
    try {
      const res = await api.get("/installments");
      setInstallments(res.data);
    } catch (error) {
      console.error("Failed to fetch installments:", error);
    }
  };

  const markPaid = async (id: number) => {
    try {
      await api.post(`/installments/${id}/pay`);
      fetchInstallments();
    } catch (error) {
      console.error("Failed to mark installment as paid:", error);
      alert("Failed to mark installment as paid");
    }
  };

  useEffect(() => {
    fetchInstallments();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Installments</h1>

      <div className="grid grid-cols-2 gap-4">
        {installments.map((i) => (
          <div key={i.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Installment #{i.id}</h3>
            <p>Loan: {i.loan_id}</p>
            <p>Due Date: {i.due_date}</p>
            <p>Amount: {i.amount}</p>
            <p>Status: {i.paid ? "Paid" : "Pending"}</p>

            {!i.paid && (
              <button
                onClick={() => markPaid(i.id)}
                className="mt-2 bg-blue-600 text-white p-2 rounded"
              >
                Mark Paid
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
