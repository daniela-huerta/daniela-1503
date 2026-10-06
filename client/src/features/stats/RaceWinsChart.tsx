import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface RaceWinsChartProps {
  data: { snail: string; wins: number }[];
}

export function RaceWinsChart({ data }: RaceWinsChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--color-bark-900)" strokeOpacity={0.08} />
          <XAxis
            dataKey="snail"
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-bark-600)', fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--color-bark-600)', fontSize: 12 }}
          />
          <Tooltip cursor={{ fill: 'var(--color-shell-50)' }} />
          <Bar dataKey="wins" name="Victorias" fill="var(--color-leaf-500)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}