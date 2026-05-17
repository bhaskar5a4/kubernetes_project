'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { generateTimeSeriesData, mockPods } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

// Seeded random number generator for consistent values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Pre-generated static data to avoid hydration mismatches
const staticNamespaceData = [
  { name: 'Production', cpu: 65, memory: 58 },
  { name: 'Monitoring', cpu: 42, memory: 45 },
  { name: 'Analytics', cpu: 78, memory: 62 },
  { name: 'Security', cpu: 35, memory: 41 },
  { name: 'Testing', cpu: 28, memory: 33 },
]

const staticNetworkData = Array.from({ length: 25 }, (_, i) => ({
  time: `${24 - i}h`,
  inbound: 200 + Math.floor(seededRandom(i * 2) * 500),
  outbound: 150 + Math.floor(seededRandom(i * 2 + 1) * 400),
}))

const chartColors = {
  primary: 'oklch(0.7 0.18 250)',
  accent: 'oklch(0.65 0.22 170)',
  warning: 'oklch(0.75 0.18 80)',
  success: 'oklch(0.7 0.2 150)',
  destructive: 'oklch(0.6 0.22 25)',
}

interface ChartCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  delay?: number
  className?: string
}

function ChartCard({ title, subtitle, children, delay = 0, className }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass-card overflow-hidden rounded-xl border border-border/50 p-5',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
      {children}
    </motion.div>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg border border-border/50 p-3 shadow-xl">
        <p className="mb-2 text-xs text-muted-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function CPUTrendsChart() {
  const data = useMemo(() => {
    return generateTimeSeriesData(24, 65, 25).map((d, i) => ({
      time: `${24 - i}h`,
      value: d.value,
    }))
  }, [])

  return (
    <ChartCard title="CPU Usage Trends" subtitle="Last 24 hours" delay={0.1}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260 / 0.5)" />
            <XAxis
              dataKey="time"
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColors.primary}
              strokeWidth={2}
              fill="url(#cpuGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function MemoryTrendsChart() {
  const data = useMemo(() => {
    return generateTimeSeriesData(24, 70, 15).map((d, i) => ({
      time: `${24 - i}h`,
      value: d.value,
    }))
  }, [])

  return (
    <ChartCard title="Memory Usage Trends" subtitle="Last 24 hours" delay={0.2}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.accent} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260 / 0.5)" />
            <XAxis
              dataKey="time"
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColors.accent}
              strokeWidth={2}
              fill="url(#memGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function NamespaceResourceChart() {
  // Use static data to avoid hydration mismatch
  return (
    <ChartCard title="Namespace Resource Comparison" subtitle="CPU & Memory by namespace" delay={0.3}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={staticNamespaceData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260 / 0.5)" />
            <XAxis
              dataKey="name"
              stroke="oklch(0.65 0 0)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Bar dataKey="cpu" name="CPU" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
            <Bar dataKey="memory" name="Memory" fill={chartColors.accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function PodRestartAnalytics() {
  const data = useMemo(() => {
    return mockPods
      .filter(p => p.restartCount > 0)
      .sort((a, b) => b.restartCount - a.restartCount)
      .slice(0, 6)
      .map(pod => ({
        name: pod.name.split('-').map(w => w.charAt(0).toUpperCase()).join(''),
        fullName: pod.name,
        restarts: pod.restartCount,
      }))
  }, [])

  return (
    <ChartCard title="Pod Restart Analytics" subtitle="Pods with highest restart counts" delay={0.4}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260 / 0.5)" horizontal={false} />
            <XAxis type="number" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="oklch(0.65 0 0)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as { fullName: string; restarts: number }
                  return (
                    <div className="glass-card rounded-lg border border-border/50 p-3 shadow-xl">
                      <p className="text-sm font-medium">{data.fullName}</p>
                      <p className="text-xs text-muted-foreground">{data.restarts} restarts</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="restarts"
              fill={chartColors.destructive}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function NetworkThroughputChart() {
  // Use static data to avoid hydration mismatch
  return (
    <ChartCard title="Network Throughput" subtitle="Inbound & Outbound traffic (MB/s)" delay={0.5} className="lg:col-span-2">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={staticNetworkData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 260 / 0.5)" />
            <XAxis
              dataKey="time"
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="oklch(0.65 0 0)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card rounded-lg border border-border/50 p-3 shadow-xl">
                      <p className="mb-2 text-xs text-muted-foreground">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs text-muted-foreground">{entry.name}:</span>
                          <span className="text-sm font-medium">{entry.value} MB/s</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="inbound"
              name="Inbound"
              stroke={chartColors.success}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outbound"
              name="Outbound"
              stroke={chartColors.warning}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}

export function ChartsSection() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <CPUTrendsChart />
        <MemoryTrendsChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <NamespaceResourceChart />
        <PodRestartAnalytics />
      </div>
      <NetworkThroughputChart />
    </div>
  )
}
