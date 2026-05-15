// Mock Kubernetes data for KubeMind AI

export const namespaces = ['production', 'monitoring', 'analytics', 'security', 'testing'] as const
export type Namespace = typeof namespaces[number]

export interface Pod {
  id: string
  name: string
  namespace: Namespace
  status: 'Running' | 'Pending' | 'Failed' | 'CrashLoopBackOff'
  cpuUsage: number
  memoryUsage: number
  restartCount: number
  age: string
  node: string
}

export interface Alert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  pod?: string
  namespace?: Namespace
  timestamp: string
}

export interface AIInsight {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  confidence: number
  suggestedAction: string
  affectedPod?: string
  affectedNamespace?: Namespace
}

export interface Metric {
  timestamp: string
  value: number
}

export interface ServiceDependency {
  source: string
  target: string
  traffic: number
  latency: number
}

// Mock pods data
export const mockPods: Pod[] = [
  { id: '1', name: 'auth-service', namespace: 'production', status: 'Running', cpuUsage: 45, memoryUsage: 62, restartCount: 0, age: '5d', node: 'node-1' },
  { id: '2', name: 'payment-service', namespace: 'production', status: 'Running', cpuUsage: 89, memoryUsage: 78, restartCount: 3, age: '3d', node: 'node-2' },
  { id: '3', name: 'recommendation-engine', namespace: 'analytics', status: 'Running', cpuUsage: 67, memoryUsage: 55, restartCount: 0, age: '7d', node: 'node-1' },
  { id: '4', name: 'gateway-api', namespace: 'production', status: 'Running', cpuUsage: 34, memoryUsage: 41, restartCount: 0, age: '10d', node: 'node-3' },
  { id: '5', name: 'notification-service', namespace: 'production', status: 'CrashLoopBackOff', cpuUsage: 12, memoryUsage: 89, restartCount: 15, age: '2d', node: 'node-2' },
  { id: '6', name: 'analytics-engine', namespace: 'analytics', status: 'Running', cpuUsage: 72, memoryUsage: 68, restartCount: 1, age: '4d', node: 'node-1' },
  { id: '7', name: 'prometheus', namespace: 'monitoring', status: 'Running', cpuUsage: 23, memoryUsage: 45, restartCount: 0, age: '15d', node: 'node-3' },
  { id: '8', name: 'grafana', namespace: 'monitoring', status: 'Running', cpuUsage: 18, memoryUsage: 32, restartCount: 0, age: '15d', node: 'node-3' },
  { id: '9', name: 'vault', namespace: 'security', status: 'Running', cpuUsage: 15, memoryUsage: 28, restartCount: 0, age: '20d', node: 'node-1' },
  { id: '10', name: 'test-runner', namespace: 'testing', status: 'Pending', cpuUsage: 0, memoryUsage: 5, restartCount: 0, age: '1h', node: 'node-2' },
  { id: '11', name: 'database-service', namespace: 'production', status: 'Running', cpuUsage: 78, memoryUsage: 85, restartCount: 2, age: '8d', node: 'node-1' },
  { id: '12', name: 'cache-service', namespace: 'production', status: 'Running', cpuUsage: 42, memoryUsage: 56, restartCount: 0, age: '6d', node: 'node-2' },
]

// Mock alerts
export const mockAlerts: Alert[] = [
  { id: '1', severity: 'critical', title: 'Pod CrashLoopBackOff', description: 'notification-service has restarted 15 times in the last hour', pod: 'notification-service', namespace: 'production', timestamp: '2 min ago' },
  { id: '2', severity: 'critical', title: 'High Memory Usage', description: 'database-service memory usage at 85%', pod: 'database-service', namespace: 'production', timestamp: '5 min ago' },
  { id: '3', severity: 'warning', title: 'High CPU Usage', description: 'payment-service CPU usage exceeds 85%', pod: 'payment-service', namespace: 'production', timestamp: '10 min ago' },
  { id: '4', severity: 'warning', title: 'Pod Restart', description: 'analytics-engine restarted unexpectedly', pod: 'analytics-engine', namespace: 'analytics', timestamp: '25 min ago' },
  { id: '5', severity: 'info', title: 'Scaling Event', description: 'gateway-api scaled from 2 to 3 replicas', pod: 'gateway-api', namespace: 'production', timestamp: '1 hour ago' },
]

// Mock AI insights
export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    severity: 'critical',
    title: 'Payment-service pod causing abnormal CPU spikes',
    description: 'Pattern analysis detected irregular CPU utilization spikes correlating with database query patterns. The pod shows 89% CPU usage with increasing trend over the last 6 hours.',
    confidence: 94,
    suggestedAction: 'Review recent code deployments and optimize database queries. Consider horizontal scaling.',
    affectedPod: 'payment-service',
    affectedNamespace: 'production'
  },
  {
    id: '2',
    severity: 'critical',
    title: 'Memory leak suspected in notification-service',
    description: 'Memory consumption pattern indicates potential memory leak. The pod has restarted 15 times due to OOM conditions. Heap growth rate is 2.3MB/minute.',
    confidence: 87,
    suggestedAction: 'Implement memory profiling and check for unreleased object references. Review event listener cleanup.',
    affectedPod: 'notification-service',
    affectedNamespace: 'production'
  },
  {
    id: '3',
    severity: 'warning',
    title: 'PVC latency correlates with restart loops',
    description: 'Statistical correlation detected between PVC read latency spikes and pod restart events. Storage I/O wait times have increased 340% in the monitoring namespace.',
    confidence: 78,
    suggestedAction: 'Evaluate storage class performance. Consider migrating to SSD-backed persistent volumes.',
    affectedNamespace: 'monitoring'
  },
  {
    id: '4',
    severity: 'warning',
    title: 'Namespace production nearing memory threshold',
    description: 'Aggregate memory usage across production namespace is at 78% of allocated quota. Projected to reach 90% within 4 hours based on current growth rate.',
    confidence: 91,
    suggestedAction: 'Increase namespace resource quota or identify pods for optimization.',
    affectedNamespace: 'production'
  },
  {
    id: '5',
    severity: 'critical',
    title: 'Prediction: database-service may fail within 2 hours',
    description: 'Predictive model forecasts potential failure based on memory pressure (85%), increasing restart frequency, and degrading response times.',
    confidence: 82,
    suggestedAction: 'Immediate action required: Scale horizontally, implement circuit breaker, or migrate to larger instance.',
    affectedPod: 'database-service',
    affectedNamespace: 'production'
  },
]

// Generate time series data for charts
export function generateTimeSeriesData(hours: number = 24, baseValue: number = 50, variance: number = 20): Metric[] {
  const data: Metric[] = []
  const now = new Date()
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const value = Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance * 2))
    data.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value * 10) / 10
    })
  }
  
  return data
}

// Service dependencies for dependency graph
export const mockDependencies: ServiceDependency[] = [
  { source: 'gateway-api', target: 'auth-service', traffic: 1250, latency: 12 },
  { source: 'gateway-api', target: 'payment-service', traffic: 890, latency: 45 },
  { source: 'gateway-api', target: 'notification-service', traffic: 560, latency: 180 },
  { source: 'auth-service', target: 'database-service', traffic: 2100, latency: 8 },
  { source: 'payment-service', target: 'database-service', traffic: 1800, latency: 15 },
  { source: 'payment-service', target: 'notification-service', traffic: 450, latency: 95 },
  { source: 'recommendation-engine', target: 'analytics-engine', traffic: 780, latency: 23 },
  { source: 'analytics-engine', target: 'database-service', traffic: 1200, latency: 18 },
  { source: 'notification-service', target: 'cache-service', traffic: 2400, latency: 3 },
]

// Dashboard metrics summary
export const dashboardMetrics = {
  cpu: { value: 67, trend: 5.2, status: 'warning' as const },
  memory: { value: 72, trend: -2.1, status: 'warning' as const },
  disk: { value: 45, trend: 1.8, status: 'healthy' as const },
  network: { value: 2.4, unit: 'GB/s', trend: 12.5, status: 'healthy' as const },
  activePods: { value: 47, total: 52, trend: 0, status: 'healthy' as const },
  criticalAlerts: { value: 3, trend: 50, status: 'critical' as const },
  healthyServices: { value: 18, total: 21, trend: -5, status: 'warning' as const },
  restartCount: { value: 21, trend: 180, status: 'critical' as const },
}

// Forecasting data
export const forecastData = {
  cpuForecast: [
    { time: 'Now', actual: 67, predicted: 67 },
    { time: '+1h', actual: null, predicted: 72 },
    { time: '+2h', actual: null, predicted: 78 },
    { time: '+4h', actual: null, predicted: 85 },
    { time: '+8h', actual: null, predicted: 82 },
    { time: '+12h', actual: null, predicted: 75 },
  ],
  memoryLeakPrediction: {
    currentRate: 2.3, // MB/minute
    timeToOOM: 47, // minutes
    confidence: 87,
  },
  downtimeProbability: {
    next1h: 12,
    next4h: 34,
    next24h: 68,
  },
  scalingRecommendations: [
    { pod: 'payment-service', currentReplicas: 3, recommendedReplicas: 5, reason: 'High CPU utilization' },
    { pod: 'database-service', currentReplicas: 2, recommendedReplicas: 4, reason: 'Memory pressure' },
    { pod: 'gateway-api', currentReplicas: 3, recommendedReplicas: 3, reason: 'Optimal' },
  ],
}
