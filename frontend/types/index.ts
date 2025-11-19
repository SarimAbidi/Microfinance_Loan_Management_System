export interface Client {
  id: number;
  name: string;
  cnic: string;
  phone: string;
  address: string;
  risk_score: "Low" | "Medium" | "High";
}

export interface Loan {
  id: number;
  client_id: number;
  amount: number;
  type: string;
  duration: number; // months
  start_date: string;
  installments: Installment[];
}

export interface Installment {
  id: number;
  loan_id: number;
  due_date: string;
  amount: number;
  paid: boolean;
}
