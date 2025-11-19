"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { Client } from "../../types/index";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchClients = async () => {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    }
  };

  const handleAdd = async () => {
    try {
      await api.post("/clients", { name, cnic, phone, address });
      setName(""); setCnic(""); setPhone(""); setAddress("");
      fetchClients();
    } catch (error) {
      console.error("Failed to add client:", error);
      alert("Failed to add client");
    }
  };

  useEffect(() => { fetchClients(); }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Add Client</h2>
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 mb-2 w-full" />
        <input placeholder="CNIC" value={cnic} onChange={e => setCnic(e.target.value)} className="border p-2 mb-2 w-full" />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} className="border p-2 mb-2 w-full" />
        <input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-2 mb-2 w-full" />
        <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded">Add Client</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {clients.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{c.name}</h3>
            <p>CNIC: {c.cnic}</p>
            <p>Phone: {c.phone}</p>
            <p>Risk: {c.risk_score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
