import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Pet } from '../../types';

interface HealthMetricsProps {
  pet: Pet;
  metricType: 'weight' | 'pain';
  color?: string;
}

export function HealthMetrics({ pet, metricType, color = '#7CA5B8' }: HealthMetricsProps) {
  const data = pet.healthRecords
    ?.filter((record) => record.type === metricType)
    .map((record) => ({
      date: new Date(record.date).toLocaleDateString(),
      value: record.value,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!data?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No {metricType} data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}