type Prayer = {
  id: number;
  title: string;
  status: "Pending" | "Praying" | "Answered";
};

export function PrayerList({ prayers }: { prayers: Prayer[] }) {
  if (prayers.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven't added any prayers yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {prayers.map((prayer) => (
        <div
          key={prayer.id}
          className="p-4 border rounded-md flex justify-between items-center"
        >
          <span className="text-lg">{prayer.title}</span>
          <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {prayer.status}
          </span>
        </div>
      ))}
    </div>
  );
}
