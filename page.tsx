"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Factory, CheckSquare, TrendingUp, Leaf, Recycle, Truck, Package } from "lucide-react"


export default function EcoFactoryApp() {
  const [sustainabilityScore, setSustainabilityScore] = useState(0)
  const [completedActions, setCompletedActions] = useState(0)
  const [totalActions] = useState(10)
  const [currentStage, setCurrentStage] = useState("packaging")
  const [emissionHistory, setEmissionHistory] = useState<number[]>([100])
  const [co2Reduction, setCo2Reduction] = useState(0)      // starts at 0%
  const [recyclingRate, setRecyclingRate] = useState(0)    // starts at 0%


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

  const toggleAction = (id: number) => {
    const updated = personalActions.map(action =>
      action.id === id ? { ...action, completed: !action.completed } : action
    )
    setPersonalActions(updated)

    const newCompleted = updated.filter(a => a.completed).length
    setCompletedActions(newCompleted)
    setSustainabilityScore(Math.min(100, newCompleted * 10))
  }

  const getEnvironmentGradient = () => {
    const progress = sustainabilityScore / 100
    if (progress < 0.3) return "from-gray-800 via-gray-600 to-gray-400"   // polluted
    if (progress < 0.6) return "from-gray-400 via-green-300 to-green-400" // transition
    return "from-green-400 via-emerald-400 to-lime-300"                   // healthy
  }
  const packagingOptions = [
    { id: 1, text: "Recyclable Packaging", sustainable: true },
    { id: 2, text: "Biodegradable Packaging", sustainable: true },
    { id: 3, text: "Standard Packaging", sustainable: false },
  ]
  const handleDecision = (sustainable: boolean) => {
    if (sustainable) {
      setCo2Reduction((prev) => Math.min(100, prev + 10))      // increase reduction
      setRecyclingRate((prev) => Math.min(100, prev + 5))     // example increment
    } else {
      setCo2Reduction((prev) => Math.max(0, prev - 5))        // decrease if not sustainable
      setRecyclingRate((prev) => Math.max(0, prev - 3))
    }
  }


  return (
    <div className={`min-h-screen bg-gradient-to-br ${getEnvironmentGradient()} transition-all duration-1000`}>
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

        {/* Main Game Interface */}
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

          <TabsContent value="packaging" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Packaging Stage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {packagingOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="h-20 flex flex-col gap-2 bg-transparent"
                      onClick={() => {
                        const lastEmission = emissionHistory[emissionHistory.length - 1]
                        let newEmission
                        if (option.sustainable) {
                          newEmission = Math.max(0, lastEmission - 10)
                        } else {
                          newEmission = Math.min(100, lastEmission + 10)
                        }
                        setEmissionHistory([...emissionHistory, newEmission])
                      }}
                    >
                      {option.sustainable ? <Leaf className="h-6 w-6" /> : <Factory className="h-6 w-6" />}
                      <span className="text-xs text-center break-words whitespace-normal">
                        {option.text}
                      </span>
                    </Button>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Choose sustainable packaging materials</p>
                  <Button className="w-full">Make Decision</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transport" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Transport Stage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Truck className="h-6 w-6" />
                    <span className="text-xs">Electric Fleet</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-xs">Optimize Routes</span>
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Select eco-friendly transport options</p>
                  <Button className="w-full">Make Decision</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retail" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Retail Stage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Leaf className="h-6 w-6" />
                    <span className="text-xs">Green Store</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Recycle className="h-6 w-6" />
                    <span className="text-xs">Return Program</span>
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Design sustainable retail experience</p>
                  <Button className="w-full">Make Decision</Button>
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

        {/* AI Chatbot */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
              AI Sustainability Advisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm">
                  💡 <strong>Tip:</strong> Switching to biodegradable packaging could reduce your environmental impact
                  by 25%!
                </p>
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask for Advice
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
