'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Zap,
  Target,
  RefreshCw,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockAIInsights, type AIInsight } from '@/lib/mock-data'

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

const severityConfig = {
  critical: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    text: 'text-destructive',
    icon: AlertTriangle,
    glow: 'shadow-destructive/20',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    icon: AlertTriangle,
    glow: 'shadow-warning/20',
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    text: 'text-primary',
    icon: Info,
    glow: 'shadow-primary/20',
  },
}

// Additional AI summaries
const aiSummaries = [
  {
    id: '1',
    title: 'Cluster Health Summary',
    content: 'Your cluster is experiencing elevated resource pressure in the production namespace. 3 critical issues require immediate attention, with potential cascading effects on dependent services.',
    icon: Target,
    type: 'summary',
  },
  {
    id: '2',
    title: 'Pattern Analysis',
    content: 'I detected a recurring pattern of memory spikes every 4 hours correlating with scheduled job executions. Consider staggering cron schedules to distribute load.',
    icon: TrendingUp,
    type: 'pattern',
  },
  {
    id: '3',
    title: 'Optimization Opportunity',
    content: 'Based on usage patterns, 4 pods in the testing namespace have been idle for 72+ hours. Terminating these could save 8GB memory and 4 CPU cores.',
    icon: Lightbulb,
    type: 'optimization',
  },
]

export default function AIInsightsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const filteredInsights = selectedSeverity === 'all'
    ? mockAIInsights
    : mockAIInsights.filter(i => i.severity === selectedSeverity)

  const handleReanalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 2000)
  }

  const insightCounts = {
    critical: mockAIInsights.filter(i => i.severity === 'critical').length,
    warning: mockAIInsights.filter(i => i.severity === 'warning').length,
    info: mockAIInsights.filter(i => i.severity === 'info').length,
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
              <p className="text-muted-foreground">
                Intelligent analysis and recommendations powered by ML
              </p>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          <RefreshCw className={cn('h-4 w-4', isAnalyzing && 'animate-spin')} />
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze Cluster'}
        </motion.button>
      </motion.div>

      {/* AI Summary Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
        {aiSummaries.map((summary, index) => (
          <motion.div
            key={summary.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass-card relative overflow-hidden rounded-xl p-5"
          >
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" />
            
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <summary.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {summary.type}
                </span>
              </div>
              
              <h3 className="mb-2 font-semibold">{summary.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {summary.content}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Bar */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm font-medium">{insightCounts.critical} Critical</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-4 py-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-sm font-medium">{insightCounts.warning} Warning</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
          <Info className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{insightCounts.info} Info</span>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warning Only</option>
            <option value="info">Info Only</option>
          </select>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Insights List */}
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {filteredInsights.map((insight, index) => {
              const config = severityConfig[insight.severity]
              const SeverityIcon = config.icon
              
              return (
                <motion.div
                  key={insight.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedInsight(insight)}
                  className={cn(
                    'glass-card cursor-pointer rounded-xl border p-5 transition-all',
                    config.border,
                    selectedInsight?.id === insight.id && 'ring-2 ring-primary'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('rounded-lg p-2.5', config.bg)}>
                      <SeverityIcon className={cn('h-5 w-5', config.text)} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase',
                          config.bg, config.text
                        )}>
                          {insight.severity}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>{insight.confidence}% confidence</span>
                        </div>
                      </div>
                      
                      <h3 className="mb-2 font-semibold">{insight.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                        {insight.description}
                      </p>
                      
                      {(insight.affectedPod || insight.affectedNamespace) && (
                        <div className="mt-3 flex items-center gap-3 text-xs">
                          {insight.affectedPod && (
                            <span className="rounded bg-muted px-2 py-1">
                              Pod: {insight.affectedPod}
                            </span>
                          )}
                          {insight.affectedNamespace && (
                            <span className="rounded bg-muted px-2 py-1">
                              NS: {insight.affectedNamespace}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Detail Panel */}
        <motion.div variants={itemVariants} className="glass-card sticky top-24 rounded-xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Insight Details</h2>
          
          <AnimatePresence mode="wait">
            {selectedInsight ? (
              <motion.div
                key={selectedInsight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div>
                  <div className={cn(
                    'mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1',
                    severityConfig[selectedInsight.severity].bg
                  )}>
                    {(() => {
                      const Icon = severityConfig[selectedInsight.severity].icon
                      return <Icon className={cn('h-4 w-4', severityConfig[selectedInsight.severity].text)} />
                    })()}
                    <span className={cn('text-sm font-medium', severityConfig[selectedInsight.severity].text)}>
                      {selectedInsight.severity.charAt(0).toUpperCase() + selectedInsight.severity.slice(1)} Issue
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold">{selectedInsight.title}</h3>
                </div>
                
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Analysis
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {selectedInsight.description}
                  </p>
                </div>
                
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <p className="text-xs font-medium uppercase tracking-wider text-primary">
                      Suggested Action
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {selectedInsight.suggestedAction}
                  </p>
                </div>
                
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">AI Confidence</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedInsight.confidence}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                    <span className="text-sm font-semibold">{selectedInsight.confidence}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    Apply Fix
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium"
                  >
                    Dismiss
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-64 flex-col items-center justify-center text-center"
              >
                <Brain className="mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Select an insight to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}
