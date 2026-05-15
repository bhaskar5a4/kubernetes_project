'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  X,
  Send,
  Sparkles,
  Brain,
  Bot,
  User,
  Loader2,
  Cpu,
  MemoryStick,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  { icon: <Cpu className="h-4 w-4" />, text: 'Which pod is causing high CPU?' },
  { icon: <AlertTriangle className="h-4 w-4" />, text: 'Show abnormal namespaces' },
  { icon: <MemoryStick className="h-4 w-4" />, text: 'Why did auth-service restart?' },
  { icon: <TrendingUp className="h-4 w-4" />, text: 'Predict possible failures' },
]

const mockResponses: Record<string, string> = {
  'which pod is causing high cpu': `Based on my analysis of the cluster metrics, **payment-service** is currently causing abnormal CPU spikes.

**Key Findings:**
- Current CPU usage: 89% (threshold: 80%)
- Spike frequency: 15 occurrences in the last hour
- Correlation: Spikes align with database query patterns

**Root Cause Analysis:**
The CPU spikes appear to be caused by inefficient database queries during peak transaction times. I detected N+1 query patterns in the recent logs.

**Recommended Actions:**
1. Review and optimize database queries
2. Implement query caching for frequently accessed data
3. Consider horizontal scaling to distribute load`,

  'show abnormal namespaces': `I&apos;ve identified **2 namespaces** with abnormal behavior:

**1. Production Namespace** ⚠️ Warning
- Memory usage: 78% of quota
- Active alerts: 3 critical, 2 warnings
- Pods affected: notification-service, database-service

**2. Monitoring Namespace** ⚠️ Warning  
- PVC latency: 340% above baseline
- Storage I/O bottleneck detected
- Affected pods: prometheus, grafana

All other namespaces (analytics, security, testing) are operating within normal parameters.`,

  'why did auth-service restart': `The **auth-service** pod has had **0 restarts** in the monitoring period. However, I notice you might be asking about a different service.

**Recent Restart Activity:**
- **notification-service**: 15 restarts (OOM conditions)
- **payment-service**: 3 restarts (CPU throttling)
- **database-service**: 2 restarts (memory pressure)

Would you like me to analyze one of these services in detail?`,

  'predict possible failures': `Based on predictive modeling, I&apos;ve identified the following potential failures:

**High Risk (Next 2 hours)**
- **database-service**: 82% probability of failure
  - Cause: Memory pressure + response time degradation
  - Action: Immediate scaling recommended

**Medium Risk (Next 6 hours)**
- **notification-service**: 67% probability of continued instability
  - Cause: Memory leak pattern detected
  - Action: Pod restart + memory profiling

**Low Risk**
- All other services show normal operating patterns

I recommend enabling auto-scaling policies and setting up additional monitoring alerts.`,
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I&apos;m your KubeMind AI assistant. I can help you analyze cluster performance, diagnose issues, and predict potential failures. What would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500))

    const lowerText = messageText.toLowerCase()
    let response = 'I&apos;m analyzing your request. Based on the current cluster state, I recommend checking the monitoring dashboard for detailed metrics. Is there a specific service or namespace you&apos;d like me to investigate?'

    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerText.includes(key)) {
        response = value
        break
      }
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsTyping(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 top-4 z-50 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Brain className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h2 className="font-semibold">KubeMind AI</h2>
                  <p className="text-xs text-muted-foreground">Intelligent cluster assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gradient-to-br from-primary/20 to-accent/20'
                      )}
                    >
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl px-4 py-2.5',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 border border-border/50'
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="mt-1 text-[10px] opacity-60">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-muted/50 px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Analyzing...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 2 && (
              <div className="border-t border-border/50 p-3">
                <p className="mb-2 text-xs text-muted-foreground">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSend(q.text)}
                      className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-xs transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      {q.icon}
                      {q.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSend()
                }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your cluster..."
                  className="flex-1 bg-muted/50"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                <Sparkles className="mr-1 inline h-3 w-3" />
                Powered by KubeMind AI Engine
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
