'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Brain,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react'
import { mockAIInsights } from '@/lib/mock-data'

interface InsightCardProps {
  insight: typeof mockAIInsights[0]
  index: number
}

function InsightCard({ insight, index }: InsightCardProps) {
  const severityConfig = {
    critical: {
      color: 'border-destructive/30 bg-gradient-to-br from-destructive/10 to-transparent',
      badge: 'bg-destructive/20 text-destructive border-destructive/30',
      icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
      glow: '0 0 40px oklch(0.6 0.22 25 / 0.15)',
    },
    warning: {
      color: 'border-warning/30 bg-gradient-to-br from-warning/10 to-transparent',
      badge: 'bg-warning/20 text-warning border-warning/30',
      icon: <AlertCircle className="h-5 w-5 text-warning" />,
      glow: '0 0 40px oklch(0.75 0.18 80 / 0.15)',
    },
    info: {
      color: 'border-accent/30 bg-gradient-to-br from-accent/10 to-transparent',
      badge: 'bg-accent/20 text-accent border-accent/30',
      icon: <Info className="h-5 w-5 text-accent" />,
      glow: '0 0 40px oklch(0.65 0.22 170 / 0.15)',
    },
  }

  const config = severityConfig[insight.severity]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.01, 
        boxShadow: config.glow,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'glass-card relative overflow-hidden rounded-xl border p-5 transition-all',
        config.color
      )}
    >
      {/* AI Sparkle Effect */}
      <motion.div
        className="absolute right-4 top-4 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles className="h-8 w-8 text-primary" />
      </motion.div>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{config.icon}</div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={config.badge}>
                {insight.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                <Target className="mr-1 h-3 w-3" />
                {insight.confidence}% confidence
              </Badge>
            </div>
            <h3 className="font-semibold leading-tight">{insight.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {insight.description}
        </p>

        {/* Affected Resources */}
        {(insight.affectedPod || insight.affectedNamespace) && (
          <div className="flex flex-wrap gap-2">
            {insight.affectedPod && (
              <Badge variant="secondary" className="text-xs">
                Pod: {insight.affectedPod}
              </Badge>
            )}
            {insight.affectedNamespace && (
              <Badge variant="secondary" className="text-xs">
                Namespace: {insight.affectedNamespace}
              </Badge>
            )}
          </div>
        )}

        {/* Suggested Action */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Zap className="h-3 w-3" />
            Suggested Action
          </div>
          <p className="text-sm">{insight.suggestedAction}</p>
        </div>

        {/* Action Button */}
        <Button
          variant="ghost"
          className="group w-full justify-between border border-border/30 hover:border-primary/50 hover:bg-primary/5"
        >
          <span className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            View detailed analysis
          </span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  )
}

export function AIInsightsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Insights</h2>
            <p className="text-sm text-muted-foreground">
              Intelligent recommendations powered by ML analysis
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
          {mockAIInsights.length} new insights
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {mockAIInsights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </div>
    </motion.section>
  )
}
