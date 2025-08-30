"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  MessageCircle,
  Factory,
  CheckSquare,
  TrendingUp,
  Leaf,
  Recycle,
  Truck,
  Package,
  Send,
  BarChart3,
} from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import type { JSX } from "react/jsx-runtime"

export default function EcoFactoryApp() {
  const [sustainabilityScore, setSustainabilityScore] = useState(0)
  const [completedActions, setCompletedActions] = useState(0)
  const [totalActions] = useState(10)
  const [remainingActions, setRemainingActions] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentStage, setCurrentStage] = useState("packaging")
  const [co2Reduction, setCo2Reduction] = useState(0)
  const [recyclingRate, setRecyclingRate] = useState(0)
  const [totalDecisionCost, setTotalDecisionCost] = useState(0)

  const [environmentalHistory, setEnvironmentalHistory] = useState([
    { day: 1, energySaved: 0, co2Reduced: 0, recyclingRate: 0 },
  ])

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI sustainability advisor. How can I help you make more eco-friendly choices today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const [personalActions, setPersonalActions] = useState([
    { id: 1, text: "Use reusable water bottle", completed: false },
    { id: 2, text: "Switch to LED bulbs", completed: false },
    { id: 3, text: "Reduce meat consumption", completed: false },
    { id: 4, text: "Use public transportation", completed: false },
    { id: 5, text: "Compost organic waste", completed: false },
    { id: 6, text: "Buy local produce", completed: false },
    { id: 7, text: "Reduce plastic usage", completed: false },
    { id: 8, text: "Use renewable energy", completed: false },
    { id: 9, text: "Use tram instead of car", completed: false },
    { id: 10, text: "Hang-dry clothes instead of using the dryer", completed: false },
  ])

  const sendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user" as const,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    const currentInput = chatInput
    setChatInput("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          userProgress: {
            sustainabilityScore,
            completedActions,
            totalActions,
            co2Reduction,
            recyclingRate,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      // Add initial AI message
      const aiMessageId = Date.now() + 1
      setChatMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          text: "",
          sender: "ai" as const,
          timestamp: new Date(),
        },
      ])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullResponse += chunk

          // Update the AI message with streaming text
          setChatMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg)))
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        sender: "ai" as const,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Toggle personal action
  const toggleAction = (id: number) => {
    const updated = personalActions.map((action) =>
      action.id === id ? { ...action, completed: !action.completed } : action,
    )
    setPersonalActions(updated)

    const newCompleted = updated.filter((a) => a.completed).length
    setCompletedActions(newCompleted)
    setSustainabilityScore(Math.min(100, newCompleted * 10))
    setRemainingActions(newCompleted - totalDecisionCost)

    const newEnergySaved = newCompleted * 8
    const currentDay = environmentalHistory.length + 1

    setEnvironmentalHistory((prev) => [
      ...prev,
      {
        day: currentDay,
        energySaved: newEnergySaved,
        co2Reduced: co2Reduction,
        recyclingRate: recyclingRate,
      },
    ])
  }

  // Handle stage decisions
  const handleDecision = (sustainable: boolean, actionCost: number) => {
    const personalCompleted = personalActions.filter((a) => a.completed).length

    if (personalCompleted - totalDecisionCost < actionCost) return

    if (sustainable) {
      setCo2Reduction((prev) => Math.min(100, prev + 10))
      setRecyclingRate((prev) => Math.min(100, prev + 5))
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      setCo2Reduction((prev) => Math.max(0, prev - 5))
      setRecyclingRate((prev) => Math.max(0, prev - 3))
    }

    setTotalDecisionCost((prev) => prev + actionCost)
    setRemainingActions(personalCompleted - (totalDecisionCost + actionCost))

    const currentEnergySaved = personalCompleted * 8 + (sustainable ? 12 : -8)
    const currentDay = environmentalHistory.length + 1

    setEnvironmentalHistory((prev) => [
      ...prev,
      {
        day: currentDay,
        energySaved: Math.max(0, currentEnergySaved),
        co2Reduced: sustainable ? co2Reduction + 10 : Math.max(0, co2Reduction - 5),
        recyclingRate: sustainable ? recyclingRate + 5 : Math.max(0, recyclingRate - 3),
      },
    ])
  }

  const getEnvironmentGradient = () => {
    const progress = sustainabilityScore / 100
    if (progress < 0.3) return "from-gray-800 via-gray-600 to-gray-400"
    if (progress < 0.6) return "from-gray-400 via-green-300 to-green-400"
    return "from-green-400 via-emerald-400 to-lime-300"
  }

  const stageOptions: Record<
    string,
    { id: number; text: string; sustainable: boolean; icon: JSX.Element; actionCost: number }[]
  > = {
    packaging: [
      { id: 1, text: "Recyclable Packaging", sustainable: true, icon: <Recycle className="h-6 w-6" />, actionCost: 2 },
      { id: 2, text: "Biodegradable Packaging", sustainable: true, icon: <Leaf className="h-6 w-6" />, actionCost: 3 },
      { id: 3, text: "Standard Packaging", sustainable: false, icon: <Factory className="h-6 w-6" />, actionCost: 1 },
    ],
    transport: [
      { id: 4, text: "Electric Fleet", sustainable: true, icon: <Truck className="h-6 w-6" />, actionCost: 4 },
      { id: 5, text: "Optimize Routes", sustainable: true, icon: <TrendingUp className="h-6 w-6" />, actionCost: 1 },
      { id: 6, text: "Standard Transport", sustainable: false, icon: <Factory className="h-6 w-6" />, actionCost: 2 },
    ],
    retail: [
      { id: 7, text: "Green Store", sustainable: true, icon: <Leaf className="h-6 w-6" />, actionCost: 1 },
      { id: 8, text: "Return Program", sustainable: true, icon: <Recycle className="h-6 w-6" />, actionCost: 1 },
      { id: 9, text: "Standard Retail", sustainable: false, icon: <Factory className="h-6 w-6" />, actionCost: 2 },
    ],
  }

  const { width, height } = useWindowSize()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getEnvironmentGradient()} transition-all duration-1000 relative`}>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.5}
          drawShape={(ctx) => {
            ctx.font = "25px serif"
            ctx.fillText("🍀    🌿   🌸", 0, 0)
          }}
        />
      )}
      <div className="max-w-sm mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Factory className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">EcoFactory</h1>
          </div>
          <p className="text-white/90 text-sm">Build a sustainable future</p>
        </div>

        {/* Sustainability Score */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Leaf className="h-5 w-5 text-primary" />
              Sustainability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">{sustainabilityScore}%</span>
                <Badge
                  variant={sustainabilityScore > 70 ? "default" : "secondary"}
                  className="bg-primary/10 text-primary"
                >
                  {sustainabilityScore > 70 ? "Excellent" : sustainabilityScore > 40 ? "Good" : "Needs Work"}
                </Badge>
              </div>
              <Progress value={sustainabilityScore} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Tabs value={currentStage} onValueChange={setCurrentStage} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="packaging" className="text-xs">
              <Package className="h-4 w-4 mr-1" />
              Package
            </TabsTrigger>
            <TabsTrigger value="transport" className="text-xs">
              <Truck className="h-4 w-4 mr-1" />
              Transport
            </TabsTrigger>
            <TabsTrigger value="retail" className="text-xs">
              <Recycle className="h-4 w-4 mr-1" />
              Retail
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {Object.entries(stageOptions).map(([stage, options]) => (
            <TabsContent key={stage} value={stage} className="space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-col items-center gap-2">
                  {stage === "packaging" && (
                    <img
                      src="https://cdn-icons-gif.flaticon.com/11933/11933514.gif"
                      alt="Packaging Animation"
                      className="w-24 h-24"
                    />
                  )}
                  {stage === "transport" && (
                    <img src="https://i.gifer.com/JOP.gif" alt="Transport Animation" className="w-24 h-24" />
                  )}
                  {stage === "retail" && (
                    <img
                      src="https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyNWpjd3ZnNWJ3bDhhMjU1YmNuOGRhZmdpbDQybDY3YWhtNng1Y3QzdCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/3o7bu9i039LhWBXH1u/giphy.gif"
                      alt="Retail Animation"
                      className="w-24 h-24"
                    />
                  )}
                  <CardTitle className="text-lg">{stage.charAt(0).toUpperCase() + stage.slice(1)} Stage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Remaining Actions</span>
                      <span>
                        {remainingActions}/{totalActions}
                      </span>
                    </div>
                    <Progress value={(remainingActions / totalActions) * 100} className="h-3" />
                  </div>

                  <div className={`grid ${options.length === 3 ? "grid-cols-3" : "grid-cols-2"} gap-3`}>
                    {options.map((option) => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className="h-20 flex flex-col gap-1 bg-transparent"
                        onClick={() => handleDecision(option.sustainable, option.actionCost)}
                        disabled={remainingActions < option.actionCost}
                      >
                        {option.icon}
                        <span className="text-xs text-center break-words whitespace-normal">{option.text}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {option.actionCost} Action{option.actionCost > 1 ? "s" : ""}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}

          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Energy Saved Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={environmentalHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="energySaved"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                        name="Energy Saved (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="co2Reduced"
                        stroke="#3b82f6"
                        strokeWidth={1}
                        dot={{ fill: "#3b82f6", strokeWidth: 1, r: 2 }}
                        name="CO₂ Reduced (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="recyclingRate"
                        stroke="#f59e0b"
                        strokeWidth={1}
                        dot={{ fill: "#f59e0b", strokeWidth: 1, r: 2 }}
                        name="Recycling Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{completedActions * 8}%</div>
                    <div className="text-xs text-muted-foreground">Energy Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{co2Reduction}%</div>
                    <div className="text-xs text-muted-foreground">CO₂ Reduced</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600">{recyclingRate}%</div>
                    <div className="text-xs text-muted-foreground">Recycling Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Personal Actions Tracker */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckSquare className="h-5 w-5 text-primary" />
              Personal Actions ({completedActions}/{totalActions})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {personalActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => toggleAction(action.id)}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      action.completed ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}
                  >
                    {action.completed && <CheckSquare className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`text-sm ${action.completed ? "line-through text-muted-foreground" : ""}`}>
                    {action.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Sustainability Advisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 mb-4">
              <div className="space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about sustainability..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Impact Metrics */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">-{co2Reduction}%</div>
                <div className="text-xs text-muted-foreground">CO₂ Emissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+{recyclingRate}%</div>
                <div className="text-xs text-muted-foreground">Recycling Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
