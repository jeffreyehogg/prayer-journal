export type Prayer = {
  id: number;
  title: string;
  status: "Pending" | "Praying" | "Answered";
  category: string | null;
};

export type Note = {
  id: number;
  created_at: string;
  content: string;
};