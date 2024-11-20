import { useEffect, useState } from 'react';
import { Pet } from '../../types';
import { HealthMetrics } from '../health/HealthMetrics';

interface AnalyticsDashboardProps {
  pet: Pet;
}

interface AnalyticsSummary {
  totalMedications: number;
  activeVaccinations: number;
  upcomingAppointments: number;
  weightTrend: 'increasing' | 'decreasing' | 'stable';
}

export function AnalyticsDashboard({ pet }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<AnalyticsSummary>({
    totalMedications: 0,
    activeVaccinations: 0,
    upcomingAppointments: 0,
    weightTrend: 'stable',
  });

  useEffect(() => {
    // Calculate analytics summary
    const activeMeds = pet.medications.filter(
      med => !med.endDate || new Date(med.endDate) > new Date()
    ).length;

    const activeVacs = pet.vaccinations.filter(
      vac => new Date(vac.nextDueDate) > new Date()
    ).length;

    const weightRecords = pet.healthRecords
      ?.filter(record => record.type === 'weight')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let trend: AnalyticsSummary['weightTrend'] = 'stable';
    if (weightRecords && weightRecords.length >= 2) {
      const latest = weightRecords[0].value as number;
      const previous = weightRecords[1].value as number;
      trend = latest > previous ? 'increasing' : latest < previous ? 'decreasing' : 'stable';
    }

    setSummary({
      totalMedications: activeMeds,
      activeVaccinations: activeVacs,
      upcomingAppointments: 0, // This would be calculated from appointments if implemented
      weightTrend: trend,
    });
  }, [pet]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Medications</h3>
          <p className="mt-1 text-2xl font-semibold">{summary.totalMedications}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Active Vaccinations</h3>
          <p className="mt-1 text-2xl font-semibold">{summary.activeVaccinations}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Appointments</h3>
          <p className="mt-1 text-2xl font-semibold">{summary.upcomingAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Weight Trend</h3>
          <p className="mt-1 text-2xl font-semibold capitalize">{summary.weightTrend}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Weight History</h2>
        <HealthMetrics pet={pet} metricType="weight" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Pain Level History</h2>
        <HealthMetrics pet={pet} metricType="pain" color="#A9DBB8" />
      </div>
    </div>
  );
}