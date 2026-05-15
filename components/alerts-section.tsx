'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  ChevronRight,
  Bell,
  Filter,
} from 'lucide-react'
import { mockAlerts, mockPods } from '@/lib/mock-data'

export function ActiveAlerts() {
  const severityIcon = {
    critical: <AlertTriangle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  }

  const severityColors = {
    critical: {
      bg: 'bg-destructive/10',
      border: 'border-destructive/30',
      text: 'text-destructive',
      badge: 'bg-destructive/20 text-destructive border-destructive/30',
      dot: 'bg-destructive',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-warning',
      badge: 'bg-warning/20 text-warning border-warning/30',
      dot: 'bg-warning',
    },
    info: {
      bg: 'bg-accent/10',
      border: 'border-accent/30',
      text: 'text-accent',
      badge: 'bg-accent/20 text-accent border-accent/30',
      dot: 'bg-accent',
    },
  }

  const criticalCount = mockAlerts.filter(a => a.severity === 'critical').length
  const warningCount = mockAlerts.filter(a => a.severity === 'warning').length

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card overflow-hidden rounded-xl border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
              <Bell className="h-5 w-5 text-destructive" />
            </div>
            {criticalCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground"
              >
                {criticalCount}
              </motion.span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">Active Alerts</h2>
            <p className="text-sm text-muted-foreground">
              {criticalCount} critical, {warningCount} warnings
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Alert List */}
      <ScrollArea className="h-80">
        <div className="divide-y divide-border/30">
          {mockAlerts.map((alert, index) => {
            const colors = severityColors[alert.severity]
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'group cursor-pointer p-4 transition-colors hover:bg-muted/30',
                  alert.severity === 'critical' && 'bg-destructive/5'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg',
                    colors.bg,
                    colors.text
                  )}>
                    {severityIcon[alert.severity]}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{alert.title}</h4>
                      <Badge variant="outline" className={colors.badge}>
                        {alert.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </span>
                      {alert.pod && (
                        <Badge variant="secondary" className="text-xs">
                          {alert.pod}
                        </Badge>
                      )}
                      {alert.namespace && (
                        <Badge variant="secondary" className="text-xs">
                          {alert.namespace}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <Button variant="ghost" className="w-full text-sm">
          View all alerts
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.section>
  )
}

export function PodStatusList() {
  const unhealthyPods = mockPods.filter(
    pod => pod.status !== 'Running' || pod.restartCount > 2 || pod.cpuUsage > 80 || pod.memoryUsage > 80
  )

  const getStatusColor = (pod: typeof mockPods[0]) => {
    if (pod.status === 'CrashLoopBackOff' || pod.status === 'Failed') {
      return { dot: 'bg-destructive', text: 'text-destructive' }
    }
    if (pod.status === 'Pending') {
      return { dot: 'bg-warning', text: 'text-warning' }
    }
    if (pod.restartCount > 5 || pod.cpuUsage > 85 || pod.memoryUsage > 85) {
      return { dot: 'bg-destructive', text: 'text-destructive' }
    }
    if (pod.restartCount > 0 || pod.cpuUsage > 70 || pod.memoryUsage > 70) {
      return { dot: 'bg-warning', text: 'text-warning' }
    }
    return { dot: 'bg-success', text: 'text-success' }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card overflow-hidden rounded-xl border border-border/50"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="font-semibold">Pods Requiring Attention</h2>
            <p className="text-sm text-muted-foreground">
              {unhealthyPods.length} pods need review
            </p>
          </div>
        </div>
      </div>

      {/* Pod List */}
      <ScrollArea className="h-64">
        <div className="divide-y divide-border/30">
          {unhealthyPods.map((pod, index) => {
            const colors = getStatusColor(pod)
            
            return (
              <motion.div
                key={pod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('h-2 w-2 rounded-full', colors.dot)} />
                    <div>
                      <p className="font-medium">{pod.name}</p>
                      <p className="text-xs text-muted-foreground">{pod.namespace}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="text-right">
                      <p className={cn(pod.cpuUsage > 80 ? 'text-destructive' : 'text-muted-foreground')}>
                        CPU: {pod.cpuUsage}%
                      </p>
                      <p className={cn(pod.memoryUsage > 80 ? 'text-destructive' : 'text-muted-foreground')}>
                        Mem: {pod.memoryUsage}%
                      </p>
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        pod.status !== 'Running' && 'border-destructive/30 bg-destructive/10 text-destructive'
                      )}
                    >
                      {pod.status}
                    </Badge>
                    
                    {pod.restartCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {pod.restartCount} restarts
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>
    </motion.section>
  )
}
