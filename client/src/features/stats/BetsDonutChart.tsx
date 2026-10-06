import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface BetsDonutChartProps {
  won: number;
  lost: number;
}

export function BetsDonutChart({ won, lost }: BetsDonutChartProps) {
  const data = [
    { name: 'Ganadas', value: won, color: 'var(--color-leaf-500)' },
    { name: 'Perdidas', value: lost, color: 'var(--color-shell-500)' },
  ];

  return (
    <div>
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="88%"
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-bark-900">{won + lost}</span>
          <span className="text-xs text-bark-600">apuestas</span>
        </div>
      </div>

      <ul className="mt-4 flex justify-center gap-6 text-sm">
        {data.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-bark-600">{entry.name}</span>
            <span className="font-bold text-bark-900">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}