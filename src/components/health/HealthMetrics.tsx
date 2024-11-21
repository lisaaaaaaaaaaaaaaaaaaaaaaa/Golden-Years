"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthMetrics = HealthMetrics;
const recharts_1 = require("recharts");
function HealthMetrics({ pet, metricType, color = '#7CA5B8' }) {
    let _a;
    const data = (_a = pet.healthRecords) === null || _a === void 0 ? void 0 : _a.filter((record) => record.type === metricType).map((record) => ({
        date: new Date(record.date).toLocaleDateString(),
        value: record.value,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (!(data === null || data === void 0 ? void 0 : data.length)) {
        return (<div className="text-center py-8 text-gray-500">
        No {metricType} data available
      </div>);
    }
    return (<div className="h-64">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.LineChart data={data}>
          <recharts_1.CartesianGrid strokeDasharray="3 3"/>
          <recharts_1.XAxis dataKey="date"/>
          <recharts_1.YAxis />
          <recharts_1.Tooltip />
          <recharts_1.Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
        </recharts_1.LineChart>
      </recharts_1.ResponsiveContainer>
    </div>);
}
