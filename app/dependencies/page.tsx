'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
  Network,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockDependencies, mockPods } from '@/lib/mock-data'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

// Service node positions for visualization
const serviceNodes = [
  { id: 'gateway-api', x: 400, y: 80, status: 'healthy', namespace: 'production' },
  { id: 'auth-service', x: 200, y: 200, status: 'healthy', namespace: 'production' },
  { id: 'payment-service', x: 400, y: 200, status: 'warning', namespace: 'production' },
  { id: 'notification-service', x: 600, y: 200, status: 'critical', namespace: 'production' },
  { id: 'database-service', x: 300, y: 350, status: 'warning', namespace: 'production' },
  { id: 'cache-service', x: 600, y: 350, status: 'healthy', namespace: 'production' },
  { id: 'recommendation-engine', x: 150, y: 350, status: 'healthy', namespace: 'analytics' },
  { id: 'analytics-engine', x: 150, y: 480, status: 'healthy', namespace: 'analytics' },
]

const statusColors = {
  healthy: { fill: 'hsl(var(--success))', bg: 'bg-success/20', text: 'text-success' },
  warning: { fill: 'hsl(var(--warning))', bg: 'bg-warning/20', text: 'text-warning' },
  critical: { fill: 'hsl(var(--destructive))', bg: 'bg-destructive/20', text: 'text-destructive' },
}

export default function DependencyMappingPage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAnomalies, setShowAnomalies] = useState(true)

  const getNodeConnections = useCallback((nodeId: string) => {
    return mockDependencies.filter(d => d.source === nodeId || d.target === nodeId)
  }, [])

  const selectedNodeData = selectedNode ? serviceNodes.find(n => n.id === selectedNode) : null
  const selectedConnections = selectedNode ? getNodeConnections(selectedNode) : []

  // Calculate path between two nodes
  const getPath = (source: typeof serviceNodes[0], target: typeof serviceNodes[0]) => {
    const midY = (source.y + target.y) / 2
    return `M ${source.x} ${source.y} C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dependency Mapping</h1>
          <p className="mt-1 text-muted-foreground">
            Visualize service connections and communication patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAnomalies(!showAnomalies)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              showAnomalies ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
            )}
          >
            <AlertTriangle className="h-4 w-4" />
            {showAnomalies ? 'Showing Anomalies' : 'Hide Anomalies'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Services', value: serviceNodes.length, icon: Network },
          { label: 'Active Connections', value: mockDependencies.length, icon: GitBranch },
          { label: 'Healthy', value: serviceNodes.filter(n => n.status === 'healthy').length, icon: CheckCircle2, color: 'success' },
          { label: 'Issues Detected', value: serviceNodes.filter(n => n.status !== 'healthy').length, icon: AlertTriangle, color: 'destructive' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={cn(
                'rounded-lg p-2.5',
                stat.color ? `bg-${stat.color}/10 text-${stat.color}` : 'bg-primary/10 text-primary'
              )}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Graph Visualization */}
        <motion.div
          variants={itemVariants}
          className={cn(
            'glass-card rounded-xl p-6 lg:col-span-3',
            isFullscreen && 'fixed inset-4 z-50'
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Service Dependency Graph</h2>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              >
                <ZoomOut className="h-4 w-4" />
              </motion.button>
              <span className="min-w-[4rem] text-center text-sm">{Math.round(zoom * 100)}%</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              >
                <ZoomIn className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="rounded-lg bg-muted p-2 hover:bg-muted/80"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </motion.button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg border border-border/50 bg-background/50" style={{ height: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 600"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" opacity="0.5" />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Connection Lines */}
              {mockDependencies.map((dep, i) => {
                const source = serviceNodes.find(n => n.id === dep.source)
                const target = serviceNodes.find(n => n.id === dep.target)
                if (!source || !target) return null
                
                const isHighlighted = selectedNode === dep.source || selectedNode === dep.target
                const hasIssue = source.status !== 'healthy' || target.status !== 'healthy'
                
                return (
                  <g key={i}>
                    <motion.path
                      d={getPath(source, target)}
                      fill="none"
                      stroke={hasIssue && showAnomalies ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))'}
                      strokeWidth={isHighlighted ? 3 : 1.5}
                      strokeOpacity={isHighlighted ? 0.8 : 0.3}
                      strokeDasharray={hasIssue ? '5,5' : 'none'}
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    />
                    {/* Animated traffic indicator */}
                    {isHighlighted && (
                      <motion.circle
                        r="4"
                        fill="hsl(var(--primary))"
                        initial={{ offsetDistance: '0%' }}
                        animate={{ offsetDistance: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        style={{ offsetPath: `path('${getPath(source, target)}')` }}
                      />
                    )}
                  </g>
                )
              })}
              
              {/* Service Nodes */}
              {serviceNodes.map((node, i) => {
                const status = statusColors[node.status as keyof typeof statusColors]
                const isSelected = selectedNode === node.id
                
                return (
                  <motion.g
                    key={node.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring' }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                  >
                    {/* Glow effect for selected or problematic nodes */}
                    {(isSelected || (showAnomalies && node.status !== 'healthy')) && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="45"
                        fill={status.fill}
                        opacity="0.2"
                        filter="url(#glow)"
                      />
                    )}
                    
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 35 : 30}
                      fill="hsl(var(--card))"
                      stroke={status.fill}
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    
                    {/* Status indicator */}
                    <circle
                      cx={node.x + 20}
                      cy={node.y - 20}
                      r="8"
                      fill={status.fill}
                    />
                    
                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + 50}
                      textAnchor="middle"
                      fill="hsl(var(--foreground))"
                      fontSize="12"
                      fontWeight="500"
                    >
                      {node.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </text>
                    
                    {/* Namespace label */}
                    <text
                      x={node.x}
                      y={node.y + 65}
                      textAnchor="middle"
                      fill="hsl(var(--muted-foreground))"
                      fontSize="10"
                    >
                      {node.namespace}
                    </text>
                  </motion.g>
                )
              })}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-lg bg-card/80 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-xs">Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-xs">Critical</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Panel */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="mb-4 font-semibold">Service Details</h3>
            
            <AnimatePresence mode="wait">
              {selectedNodeData ? (
                <motion.div
                  key={selectedNodeData.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('rounded-lg p-2', statusColors[selectedNodeData.status as keyof typeof statusColors].bg)}>
                      <Activity className={cn('h-5 w-5', statusColors[selectedNodeData.status as keyof typeof statusColors].text)} />
                    </div>
                    <div>
                      <p className="font-medium">{selectedNodeData.id}</p>
                      <p className="text-xs text-muted-foreground">{selectedNodeData.namespace}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-medium',
                      statusColors[selectedNodeData.status as keyof typeof statusColors].bg,
                      statusColors[selectedNodeData.status as keyof typeof statusColors].text
                    )}>
                      {selectedNodeData.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connections</span>
                      <span className="font-medium">{selectedConnections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Latency</span>
                      <span className="font-medium">
                        {Math.round(selectedConnections.reduce((a, c) => a + c.latency, 0) / selectedConnections.length || 0)}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Traffic</span>
                      <span className="font-medium">
                        {selectedConnections.reduce((a, c) => a + c.traffic, 0)} req/s
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-32 flex-col items-center justify-center text-center"
                >
                  <Info className="mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Click a node to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Connections List */}
          {selectedNode && selectedConnections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-5"
            >
              <h3 className="mb-3 font-semibold">Connections</h3>
              <div className="space-y-2">
                {selectedConnections.map((conn, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/30 p-2 text-xs">
                    <span className="font-medium">{conn.source}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{conn.target}</span>
                    <span className="ml-auto text-muted-foreground">{conn.latency}ms</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
