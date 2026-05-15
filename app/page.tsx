'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { MetricsGrid } from '@/components/metrics-grid'
import { ChartsSection } from '@/components/charts-section'
import { AIInsightsSection } from '@/components/ai-insights'
import { AIAssistant } from '@/components/ai-assistant'
import { ActiveAlerts, PodStatusList } from '@/components/alerts-section'
import { DependencyGraph } from '@/components/dependency-graph'
import { ForecastingSection } from '@/components/forecasting-section'

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiAssistantOpen, setAIAssistantOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Navbar */}
      <Navbar 
        onAIAssistantToggle={() => setAIAssistantOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: sidebarCollapsed ? 72 : 260,
          width: sidebarCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 260px)'
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen pt-16"
      >
        <div className="p-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Real-time Kubernetes cluster monitoring and AI-powered insights
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                  </span>
                  <span className="text-sm font-medium text-success">Live</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <section className="mb-8">
            <MetricsGrid />
          </section>

          {/* Charts Section */}
          <section className="mb-8">
            <ChartsSection />
          </section>

          {/* AI Insights */}
          <section className="mb-8">
            <AIInsightsSection />
          </section>

          {/* Two Column Layout: Alerts & Dependency */}
          <section className="mb-8 grid gap-6 lg:grid-cols-2">
            <ActiveAlerts />
            <DependencyGraph />
          </section>

          {/* Pod Status List */}
          <section className="mb-8">
            <PodStatusList />
          </section>

          {/* Forecasting Section */}
          <section className="mb-8">
            <ForecastingSection />
          </section>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 border-t border-border/50 py-6 text-center"
          >
            <p className="text-sm text-muted-foreground">
              KubeMind AI - Enterprise Kubernetes Observability Platform
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Powered by Machine Learning | Built for ABB Industrial AI Hackathon
            </p>
          </motion.footer>
        </div>
      </motion.main>

      {/* AI Assistant Panel */}
      <AIAssistant 
        isOpen={aiAssistantOpen} 
        onClose={() => setAIAssistantOpen(false)} 
      />
    </div>
  )
}
