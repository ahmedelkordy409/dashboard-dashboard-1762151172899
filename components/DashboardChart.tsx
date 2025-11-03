'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

interface ChartProps {
  type: string
  data: any
  config?: any
}

export default function DashboardChart({ type, data, config }: ChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []

    switch (type) {
      case 'line':
      case 'bar':
        if (data.labels && data.datasets) {
          return data.labels.map((label: string, index: number) => {
            const point: any = { name: label }
            data.datasets.forEach((dataset: any) => {
              point[dataset.label || 'value'] = dataset.data[index]
            })
            return point
          })
        }
        return []

      case 'pie':
        if (data.labels && data.datasets && data.datasets[0]) {
          return data.labels.map((label: string, index: number) => ({
            name: label,
            value: data.datasets[0].data[index]
          }))
        }
        return []

      case 'scatter':
        if (data.datasets && data.datasets[0]) {
          return data.datasets[0].data
        }
        return []

      case 'table':
        return data.rows || []

      default:
        return []
    }
  }, [data, type])

  if (!chartData || chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
  }

  switch (type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets?.map((dataset: any, index: number) => (
              <Line
                key={index}
                type="monotone"
                dataKey={dataset.label || 'value'}
                stroke={dataset.borderColor || COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data.datasets?.map((dataset: any, index: number) => (
              <Bar
                key={index}
                dataKey={dataset.label || 'value'}
                fill={dataset.backgroundColor || COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )

    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" name="X" />
            <YAxis type="number" dataKey="y" name="Y" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data Points" data={chartData} fill={COLORS[0]} />
          </ScatterChart>
        </ResponsiveContainer>
      )

    case 'table':
      const columns = data.columns || []
      const rows = chartData

      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col: any, index: number) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {col.header || col.field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex}>
                  {columns.map((col: any, colIndex: number) => (
                    <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {row[col.field] !== undefined ? String(row[col.field]) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return <div className="h-64 flex items-center justify-center text-gray-400">Unsupported chart type</div>
  }
}
