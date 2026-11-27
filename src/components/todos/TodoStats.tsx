interface TodoStatsProps {
  total: number;
  active: number;
  completed: number;
}

export function TodoStats({
  total,
  active,
  completed,
}: TodoStatsProps) {
  return (
    <div className="todo-stats">
      <div>
        <strong>{total}</strong>
        <span>Total</span>
      </div>

      <div>
        <strong>{active}</strong>
        <span>Active</span>
      </div>

      <div>
        <strong>{completed}</strong>
        <span>Completed</span>
      </div>
    </div>
  );
}