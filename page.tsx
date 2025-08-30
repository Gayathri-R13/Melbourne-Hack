"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Factory, CheckSquare, TrendingUp, Leaf, Recycle, Truck, Package } from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

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
  const [pointsSpent, setPointsSpent] = useState(0)

  const askAI = () => {
  // Get a list of completed actions
    const completed = personalActions.filter(a => a.completed).map(a => a.text)

    // Define suggestions with stats keyed by action keywords
    const suggestions: Record<string, string[]> = {
      "water bottle": [
        "Using a reusable water bottle saves ~167 plastic bottles per year.",
        "Refilling a water bottle reduces ~0.5 kg CO₂ emissions per month."
      ],
      "meat": [
        "Reducing meat consumption can cut ~0.3 tons CO₂ per year per person.",
        "Plant-based meals reduce water usage by up to 50%."
      ],
      "public transportation": [
        "Taking the bus or tram instead of a car can reduce emissions by 40%.",
        "Public transport saves up to 1,200 kg CO₂ per year per commuter."
      ],
      "renewable energy": [
        "Solar panels can offset ~1.5 tons of CO₂ per year.",
        "Switching to green energy reduces household emissions by ~25%."
      ],
      "local produce": [
        "Buying local reduces food transportation emissions by ~25%.",
        "Supporting local farms reduces pesticide use and soil degradation."
      ],
      "compost": [
        "Composting organic waste can reduce landfill emissions by ~30%.",
        "Composting keeps ~200 kg of CO₂ equivalent per year out of the atmosphere."
      ],
      "dry clothes": [
        "Air-drying clothes saves ~500 kWh/year compared to dryers.",
        "It also extends clothing lifespan, reducing textile waste."
      ]
    }

    let possibleSuggestions: string[] = []

    // Collect suggestions relevant to completed actions
    completed.forEach(action => {
      Object.entries(suggestions).forEach(([key, sArr]) => {
        if (action.toLowerCase().includes(key)) {
          possibleSuggestions.push(...sArr)
        }
      })
    })

    // If none match, show generic advice
    if (possibleSuggestions.length === 0) {
      possibleSuggestions = [
        "Start small: use reusable bottles and bags. It can save hundreds of plastic items per year.",
        "Try energy-saving habits at home – switching off lights can save up to 100 kWh/year."
      ]
    }

    // Pick one at random
    const message = possibleSuggestions[Math.floor(Math.random() * possibleSuggestions.length)]

    alert(`💡 AI Tip: ${message}`)
  }


  const [personalActions, setPersonalActions] = useState([
    { id: 1, text: "Use reusable water bottle", completed: false },
    { id: 2, text: "Reduce meat consumption", completed: false },
    { id: 3, text: "Use reusable bag", completed: false },
    { id: 4, text: "Use public transportation", completed: false },
    { id: 5, text: "Buy local produce", completed: false },
    { id: 6, text: "Compost organic waste", completed: false },
    { id: 7, text: "Reduce plastic usage", completed: false },
    { id: 8, text: "Use renewable energy", completed: false },
    { id: 9, text: "Use tram instead of car", completed: false },
    { id: 10, text: "Air-dry clothes instead of using dryer", completed: false },
  ])

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
    setPointsSpent((prev) => prev + actionCost) // <-- add this line
    setRemainingActions(personalCompleted - (totalDecisionCost + actionCost))
  }

  const getBackgroundImage = () => {
    if (sustainabilityScore < 30) return "url('')"
    if (sustainabilityScore < 70) return "url('')"
    return "url('/images/brightgreen-bg.png')"
  }

  const sustainabilityTiers = [
    { range: [0, 5], label: "Low Impact" },
    { range: [6, 10], label: "Moderate Impact" },
    { range: [11, 15], label: "Good Impact" },
    { range: [16, 20], label: "Excellent Impact" },
  ]

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
      { id: 5, text: "Optimize Routes", sustainable: true, icon: <TrendingUp className="h-6 w-6" />, actionCost: 3 },
      { id: 6, text: "Standard Transport", sustainable: false, icon: <Factory className="h-6 w-6" />, actionCost: 1 },
    ],
    retail: [
      { id: 7, text: "Green Store", sustainable: true, icon: <Leaf className="h-6 w-6" />, actionCost: 3 },
      { id: 8, text: "Return Program", sustainable: true, icon: <Recycle className="h-6 w-6" />, actionCost: 2 },
      { id: 9, text: "Standard Retail", sustainable: false, icon: <Factory className="h-6 w-6" />, actionCost: 1 },
    ],
  }

  const { width, height } = useWindowSize()

  const getCurrentTier = (points: number) => {
    const tier = sustainabilityTiers.find((t) => points >= t.range[0] && points <= t.range[1])
    return tier ? tier.label : "Undefined"
  }

  return (
    <div
      className="relative w-full min-h-screen transition-all duration-1000 flex items-center justify-center"
      style={{
        backgroundImage: getBackgroundImage(),
        backgroundSize: "contain", // keeps original ratio
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={300} // more pieces = fuller screen
          recycle={false}
          gravity={0.5}
          // custom shapes using emojis
          drawShape={(ctx) => {
            ctx.font = "25px serif"
            ctx.fillText("🍀   🌿   🌸", 0, 0)
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
              {/* Current Tier */}
              <p className="text-sm mt-1">
                Equivalent Impact:{" "}
                {sustainabilityScore > 70
                  ? "A week of zero-waste living"
                  : sustainabilityScore > 40
                    ? "10 kg CO₂ reduced"
                    : sustainabilityScore > 0
                      ? "1 tree planted"
                      : "No actions taken yet"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs and Decision Buttons */}
        <Tabs value={currentStage} onValueChange={setCurrentStage} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm">
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
          </TabsList>

          {Object.entries(stageOptions).map(([stage, options]) => (
            <TabsContent key={stage} value={stage} className="space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-col items-center gap-2">
                  {/* Transport GIF */}
                  {stage === "transport" && (
                    <img
                      src="https://cdn-icons-gif.flaticon.com/6416/6416387.gif"
                      alt="Transport Animation"
                      className="w-24 h-24"
                    />
                  )}
                  {stage === "packaging" && (
                    <img
                      src="https://cdn-icons-gif.flaticon.com/11933/11933514.gif"
                      alt="Packaging Animation"
                      className="w-24 h-24"
                    />
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

        {/* AI Chatbot */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Sustainability Advisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm">
                  ✨ See the environmental impact of your choices in real time! ✨
                </p>
              </div>
              <Button variant="outline" className="w-full bg-transparent" onClick={askAI}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask here
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
                <div className="text-2xl font-bold text-primary">-15%</div>
                <div className="text-xs text-muted-foreground">CO₂ Emissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+32%</div>
                <div className="text-xs text-muted-foreground">Recycling Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
