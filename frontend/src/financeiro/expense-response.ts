export type ExpenseResponse = {
  id: string;
  name: string;
  date: string;
  amount: number;
  paid: boolean;
  created_at: string;
  group_id: string;
  virtual: boolean;
};
