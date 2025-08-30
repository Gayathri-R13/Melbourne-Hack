"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  Trophy,
  Star,
  Target,
  Flame,
  Crown,
  Gamepad2,
  Timer,
  Zap,
  Calculator,
  Route,
  Trash2,
  Battery,
  Car,
  Globe,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Newspaper,
  MapPin,
  TreePine,
  Waves,
  Users,
  Share2,
  Copy,
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

  // Gamification state
  const [playerLevel, setPlayerLevel] = useState(1)
  const [experiencePoints, setExperiencePoints] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [lastActionDate, setLastActionDate] = useState<Date | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)

  // Achievement system
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [newAchievements, setNewAchievements] = useState<string[]>([])

  // Daily challenges
  const [dailyChallenges, setDailyChallenges] = useState([
    { id: 1, title: "Complete 3 Personal Actions", progress: 0, target: 3, reward: 50, completed: false },
    { id: 2, title: "Make 2 Sustainable Decisions", progress: 0, target: 2, reward: 75, completed: false },
    { id: 3, title: "Reach 30% Sustainability Score", progress: 0, target: 30, reward: 100, completed: false },
  ])

  // Weekly challenges
  const [weeklyChallenges, setWeeklyChallenges] = useState([
    { id: 1, title: "Maintain 5-day Streak", progress: 0, target: 5, reward: 200, completed: false },
    { id: 2, title: "Complete All Personal Actions", progress: 0, target: 10, reward: 300, completed: false },
    { id: 3, title: "Achieve 80% Sustainability Score", progress: 0, target: 80, reward: 500, completed: false },
  ])

  // Achievement definitions
  const achievements = [
    {
      id: "first_action",
      title: "Getting Started",
      description: "Complete your first personal action",
      icon: "🌱",
      points: 25,
    },
    { id: "streak_3", title: "Consistency", description: "Maintain a 3-day streak", icon: "🔥", points: 50 },
    { id: "streak_7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "⚡", points: 100 },
    {
      id: "all_actions",
      title: "Completionist",
      description: "Complete all personal actions",
      icon: "🏆",
      points: 200,
    },
    { id: "level_5", title: "Eco Expert", description: "Reach level 5", icon: "👑", points: 150 },
    {
      id: "sustainable_master",
      title: "Sustainable Master",
      description: "Reach 100% sustainability score",
      icon: "🌟",
      points: 300,
    },
    { id: "co2_champion", title: "CO₂ Champion", description: "Reduce CO₂ emissions by 50%", icon: "🌍", points: 175 },
    {
      id: "recycling_hero",
      title: "Recycling Hero",
      description: "Achieve 75% recycling rate",
      icon: "♻️",
      points: 125,
    },
  ]

  const [currentMiniGame, setCurrentMiniGame] = useState<string | null>(null)
  const [gameScore, setGameScore] = useState(0)
  const [gameTimeLeft, setGameTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)

  // Recycling game state
  const [recyclingItems, setRecyclingItems] = useState([
    { id: 1, name: "Plastic Bottle", type: "plastic", emoji: "🍼", x: 50, y: 50 },
    { id: 2, name: "Newspaper", type: "paper", emoji: "📰", x: 150, y: 80 },
    { id: 3, name: "Banana Peel", type: "organic", emoji: "🍌", x: 100, y: 120 },
    { id: 4, name: "Glass Jar", type: "glass", emoji: "🫙", x: 200, y: 60 },
    { id: 5, name: "Aluminum Can", type: "metal", emoji: "🥤", x: 80, y: 150 },
  ])
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  // Energy puzzle state
  const [energyGrid, setEnergyGrid] = useState(Array(16).fill(0)) // 4x4 grid
  const [energyScore, setEnergyScore] = useState(100)

  // Carbon calculator state
  const [carbonScenario, setCarbonScenario] = useState(0)
  const [carbonChoices, setCarbonChoices] = useState<number[]>([])

  // Supply chain game state
  const [supplyRoutes, setSupplyRoutes] = useState([
    { id: 1, from: "Factory", to: "Warehouse", distance: 100, method: "truck", cost: 50, emissions: 20 },
    { id: 2, from: "Warehouse", to: "Store", distance: 50, method: "truck", cost: 25, emissions: 10 },
    { id: 3, from: "Store", to: "Customer", distance: 10, method: "delivery", cost: 5, emissions: 2 },
  ])

  const [localEnvironmentalData, setLocalEnvironmentalData] = useState({
    location: "San Francisco, CA",
    airQuality: 85,
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    uvIndex: 6,
    season: "spring",
  })

  const [seasonalChallenges, setSeasonalChallenges] = useState([
    {
      id: 1,
      title: "Spring Planting",
      description: "Plant native flowers or herbs",
      season: "spring",
      reward: 100,
      completed: false,
    },
    {
      id: 2,
      title: "Energy Conservation",
      description: "Reduce heating/cooling usage",
      season: "spring",
      reward: 75,
      completed: false,
    },
    {
      id: 3,
      title: "Water Conservation",
      description: "Collect rainwater for plants",
      season: "spring",
      reward: 50,
      completed: false,
    },
  ])

  const [environmentalNews, setEnvironmentalNews] = useState([
    {
      id: 1,
      title: "Global Renewable Energy Hits Record High",
      summary: "Solar and wind power generation increased by 15% this year",
      impact: "positive",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Ocean Cleanup Project Removes 50 Tons of Plastic",
      summary: "Latest cleanup effort in Pacific shows promising results",
      impact: "positive",
      date: "2024-01-14",
    },
    {
      id: 3,
      title: "New Carbon Capture Technology Deployed",
      summary: "Innovative direct air capture facility begins operations",
      impact: "positive",
      date: "2024-01-13",
    },
  ])

  const [realWorldImpact, setRealWorldImpact] = useState({
    treesEquivalent: 0,
    carsOffRoad: 0,
    energySavedKwh: 0,
    waterSavedLiters: 0,
    wasteReduced: 0,
  })

  const [leaderboardData, setLeaderboardData] = useState([
    { id: 1, name: "EcoWarrior2024", score: 850, level: 8, avatar: "🌱" },
    { id: 2, name: "GreenThumb", score: 720, level: 6, avatar: "🌿" },
    { id: 3, name: "ClimateChamp", score: 680, level: 6, avatar: "🌍" },
    { id: 4, name: "You", score: sustainabilityScore, level: playerLevel, avatar: "⭐" },
    { id: 5, name: "EcoFriend", score: 520, level: 4, avatar: "🌳" },
    { id: 6, name: "SustainableSam", score: 480, level: 4, avatar: "♻️" },
  ])

  const [ecoCommunitiesData, setEcoCommunitiesData] = useState([
    {
      id: 1,
      name: "Urban Gardeners",
      members: 1247,
      description: "Growing green spaces in cities",
      category: "Gardening",
      joined: false,
      weeklyChallenge: "Plant 5 herbs this week",
      challengeProgress: 60,
    },
    {
      id: 2,
      name: "Zero Waste Heroes",
      members: 892,
      description: "Reducing waste to zero",
      category: "Waste Reduction",
      joined: true,
      weeklyChallenge: "Go plastic-free for 3 days",
      challengeProgress: 80,
    },
    {
      id: 3,
      name: "Clean Energy Advocates",
      members: 2156,
      description: "Promoting renewable energy",
      category: "Energy",
      joined: false,
      weeklyChallenge: "Switch to LED bulbs",
      challengeProgress: 45,
    },
    {
      id: 4,
      name: "Sustainable Transport",
      members: 634,
      description: "Eco-friendly transportation",
      category: "Transport",
      joined: true,
      weeklyChallenge: "Use public transport 5 times",
      challengeProgress: 100,
    },
  ])

  const [teamChallenges, setTeamChallenges] = useState([
    {
      id: 1,
      title: "Global Tree Planting",
      description: "Plant 10,000 trees worldwide",
      progress: 7543,
      target: 10000,
      participants: 2847,
      timeLeft: "5 days",
      reward: "Exclusive Forest Guardian badge",
    },
    {
      id: 2,
      title: "Plastic-Free Week",
      description: "Avoid single-use plastics",
      progress: 1892,
      target: 2500,
      participants: 1892,
      timeLeft: "2 days",
      reward: "Ocean Protector achievement",
    },
  ])

  useEffect(() => {
    const treesEquivalent = Math.floor(co2Reduction * 0.5)
    const carsOffRoad = Math.floor(co2Reduction * 0.02)
    const energySavedKwh = completedActions * 25
    const waterSavedLiters = completedActions * 50
    const wasteReduced = recyclingRate * 2

    setRealWorldImpact({
      treesEquivalent,
      carsOffRoad,
      energySavedKwh,
      waterSavedLiters,
      wasteReduced,
    })
  }, [co2Reduction, completedActions, recyclingRate])

  useEffect(() => {
    const currentMonth = new Date().getMonth()
    let currentSeason = "spring"

    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = "spring"
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = "summer"
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = "autumn"
    else currentSeason = "winter"

    const seasonalChallengesByMonth = {
      spring: [
        {
          id: 1,
          title: "Spring Planting",
          description: "Plant native flowers or herbs",
          season: "spring",
          reward: 100,
          completed: false,
        },
        {
          id: 2,
          title: "Bike to Work Week",
          description: "Use bicycle for commuting",
          season: "spring",
          reward: 75,
          completed: false,
        },
        {
          id: 3,
          title: "Rain Water Collection",
          description: "Set up rainwater harvesting",
          season: "spring",
          reward: 50,
          completed: false,
        },
      ],
      summer: [
        {
          id: 1,
          title: "Solar Challenge",
          description: "Maximize solar energy usage",
          season: "summer",
          reward: 100,
          completed: false,
        },
        {
          id: 2,
          title: "Water Conservation",
          description: "Reduce water usage by 20%",
          season: "summer",
          reward: 75,
          completed: false,
        },
        {
          id: 3,
          title: "Local Produce",
          description: "Buy only local summer produce",
          season: "summer",
          reward: 50,
          completed: false,
        },
      ],
      autumn: [
        {
          id: 1,
          title: "Composting Drive",
          description: "Start composting fallen leaves",
          season: "autumn",
          reward: 100,
          completed: false,
        },
        {
          id: 2,
          title: "Energy Efficiency",
          description: "Weatherproof your home",
          season: "autumn",
          reward: 75,
          completed: false,
        },
        {
          id: 3,
          title: "Harvest Festival",
          description: "Preserve seasonal foods",
          season: "autumn",
          reward: 50,
          completed: false,
        },
      ],
      winter: [
        {
          id: 1,
          title: "Heating Optimization",
          description: "Reduce heating by 2°C",
          season: "winter",
          reward: 100,
          completed: false,
        },
        {
          id: 2,
          title: "Indoor Air Quality",
          description: "Add air-purifying plants",
          season: "winter",
          reward: 75,
          completed: false,
        },
        {
          id: 3,
          title: "Waste Reduction",
          description: "Zero waste holiday celebrations",
          season: "winter",
          reward: 50,
          completed: false,
        },
      ],
    }

    setSeasonalChallenges(seasonalChallengesByMonth[currentSeason as keyof typeof seasonalChallengesByMonth])
    setLocalEnvironmentalData((prev) => ({ ...prev, season: currentSeason }))
  }, [])

  const carbonScenarios = [
    {
      title: "Daily Commute",
      description: "Choose your transportation method for a 10km commute",
      options: [
        { text: "Drive alone", emissions: 2.3, cost: 15 },
        { text: "Carpool", emissions: 1.2, cost: 8 },
        { text: "Public transport", emissions: 0.6, cost: 5 },
        { text: "Bicycle", emissions: 0, cost: 0 },
      ],
    },
    {
      title: "Lunch Choice",
      description: "Select your meal for today",
      options: [
        { text: "Beef burger", emissions: 3.2, cost: 12 },
        { text: "Chicken salad", emissions: 1.1, cost: 10 },
        { text: "Vegetarian wrap", emissions: 0.4, cost: 8 },
        { text: "Local organic salad", emissions: 0.2, cost: 9 },
      ],
    },
    {
      title: "Energy Usage",
      description: "How do you heat your home?",
      options: [
        { text: "Gas heating", emissions: 5.5, cost: 80 },
        { text: "Electric heating", emissions: 3.2, cost: 90 },
        { text: "Heat pump", emissions: 1.1, cost: 70 },
        { text: "Solar + heat pump", emissions: 0.3, cost: 60 },
      ],
    },
  ]

  const startMiniGame = (gameType: string) => {
    setCurrentMiniGame(gameType)
    setGameScore(0)
    setGameTimeLeft(30)
    setGameActive(true)

    if (gameType === "recycling") {
      // Reset recycling items positions
      setRecyclingItems((prev) =>
        prev.map((item) => ({
          ...item,
          x: Math.random() * 200 + 50,
          y: Math.random() * 150 + 50,
        })),
      )
    } else if (gameType === "energy") {
      setEnergyGrid(Array(16).fill(0))
      setEnergyScore(100)
    } else if (gameType === "carbon") {
      setCarbonScenario(0)
      setCarbonChoices([])
    }

    // Start timer
    const timer = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endMiniGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const endMiniGame = () => {
    setGameActive(false)
    const xpReward = Math.floor(gameScore * 2)
    setExperiencePoints((prev) => prev + xpReward)
    setTotalPoints((prev) => prev + xpReward)

    if (gameScore > 50) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    setTimeout(() => setCurrentMiniGame(null), 2000)
  }

  const handleRecyclingDrop = (itemId: number, binType: string) => {
    const item = recyclingItems.find((i) => i.id === itemId)
    if (item && item.type === binType) {
      setGameScore((prev) => prev + 10)
      setRecyclingItems((prev) => prev.filter((i) => i.id !== itemId))
    } else {
      setGameScore((prev) => Math.max(0, prev - 5))
    }
  }

  const toggleEnergyCell = (index: number) => {
    if (!gameActive) return

    setEnergyGrid((prev) => {
      const newGrid = [...prev]
      newGrid[index] = newGrid[index] === 0 ? 1 : 0

      // Calculate energy efficiency
      const activeCount = newGrid.filter((cell) => cell === 1).length
      const efficiency = Math.max(0, 100 - activeCount * 8)
      setEnergyScore(efficiency)
      setGameScore(efficiency)

      return newGrid
    })
  }

  const handleCarbonChoice = (choiceIndex: number) => {
    const newChoices = [...carbonChoices, choiceIndex]
    setCarbonChoices(newChoices)

    if (carbonScenario < carbonScenarios.length - 1) {
      setCarbonScenario((prev) => prev + 1)
    } else {
      // Calculate final score
      const totalEmissions = newChoices.reduce((total, choice, scenarioIndex) => {
        return total + carbonScenarios[scenarioIndex].options[choice].emissions
      }, 0)

      const score = Math.max(0, 100 - Math.floor(totalEmissions * 10))
      setGameScore(score)
      endMiniGame()
    }
  }

  const optimizeSupplyRoute = (routeId: number, newMethod: string) => {
    setSupplyRoutes((prev) =>
      prev.map((route) => {
        if (route.id === routeId) {
          let newEmissions = route.emissions
          let newCost = route.cost

          switch (newMethod) {
            case "electric":
              newEmissions = Math.floor(route.emissions * 0.3)
              newCost = Math.floor(route.cost * 1.2)
              break
            case "rail":
              newEmissions = Math.floor(route.emissions * 0.2)
              newCost = Math.floor(route.cost * 0.8)
              break
            case "bike":
              newEmissions = 0
              newCost = Math.floor(route.cost * 0.5)
              break
          }

          return { ...route, method: newMethod, emissions: newEmissions, cost: newCost }
        }
        return route
      }),
    )

    const totalEmissions = supplyRoutes.reduce((sum, route) => sum + route.emissions, 0)
    setGameScore(Math.max(0, 100 - totalEmissions))
  }

  const completeSeasonalChallenge = (challengeId: number) => {
    setSeasonalChallenges((prev) =>
      prev.map((challenge) => {
        if (challenge.id === challengeId && !challenge.completed) {
          setExperiencePoints((prev) => prev + challenge.reward)
          setTotalPoints((prev) => prev + challenge.reward)
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
          return { ...challenge, completed: true }
        }
        return challenge
      }),
    )
  }

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

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1
  const getXPForNextLevel = (level: number) => level * 100
  const getCurrentLevelXP = (xp: number, level: number) => xp - (level - 1) * 100

  const checkAchievements = () => {
    const newUnlocked: string[] = []

    if (completedActions >= 1 && !unlockedAchievements.includes("first_action")) {
      newUnlocked.push("first_action")
    }
    if (currentStreak >= 3 && !unlockedAchievements.includes("streak_3")) {
      newUnlocked.push("streak_3")
    }
    if (currentStreak >= 7 && !unlockedAchievements.includes("streak_7")) {
      newUnlocked.push("streak_7")
    }
    if (completedActions === totalActions && !unlockedAchievements.includes("all_actions")) {
      newUnlocked.push("all_actions")
    }
    if (playerLevel >= 5 && !unlockedAchievements.includes("level_5")) {
      newUnlocked.push("level_5")
    }
    if (sustainabilityScore >= 100 && !unlockedAchievements.includes("sustainable_master")) {
      newUnlocked.push("sustainable_master")
    }
    if (co2Reduction >= 50 && !unlockedAchievements.includes("co2_champion")) {
      newUnlocked.push("co2_champion")
    }
    if (recyclingRate >= 75 && !unlockedAchievements.includes("recycling_hero")) {
      newUnlocked.push("recycling_hero")
    }

    if (newUnlocked.length > 0) {
      setUnlockedAchievements((prev) => [...prev, ...newUnlocked])
      setNewAchievements(newUnlocked)

      // Add XP for achievements
      const achievementXP = newUnlocked.reduce((total, id) => {
        const achievement = achievements.find((a) => a.id === id)
        return total + (achievement?.points || 0)
      }, 0)

      setExperiencePoints((prev) => prev + achievementXP)
      setTotalPoints((prev) => prev + achievementXP)

      // Show confetti for achievements
      setShowConfetti(true)
      setTimeout(() => {
        setShowConfetti(false)
        setNewAchievements([])
      }, 4000)
    }
  }

  const updateStreak = () => {
    const today = new Date()
    const todayString = today.toDateString()

    if (lastActionDate) {
      const lastDateString = lastActionDate.toDateString()
      const daysDiff = Math.floor((today.getTime() - lastActionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (lastDateString === todayString) {
        // Same day, don't update streak
        return
      } else if (daysDiff === 1) {
        // Consecutive day
        setCurrentStreak((prev) => {
          const newStreak = prev + 1
          if (newStreak > longestStreak) {
            setLongestStreak(newStreak)
          }
          return newStreak
        })
      } else if (daysDiff > 1) {
        // Streak broken
        setCurrentStreak(1)
      }
    } else {
      // First action ever
      setCurrentStreak(1)
    }

    setLastActionDate(today)
  }

  const updateChallengeProgress = () => {
    // Update daily challenges
    setDailyChallenges((prev) =>
      prev.map((challenge) => {
        let newProgress = challenge.progress

        if (challenge.id === 1) {
          // Complete 3 Personal Actions
          newProgress = completedActions
        } else if (challenge.id === 2) {
          // Make 2 Sustainable Decisions
          newProgress = Math.floor(totalDecisionCost / 2)
        } else if (challenge.id === 3) {
          // Reach 30% Sustainability Score
          newProgress = sustainabilityScore >= 30 ? 30 : sustainabilityScore
        }

        const completed = newProgress >= challenge.target
        if (completed && !challenge.completed) {
          setTotalPoints((prev) => prev + challenge.reward)
          setExperiencePoints((prev) => prev + challenge.reward)
        }

        return { ...challenge, progress: newProgress, completed }
      }),
    )

    // Update weekly challenges
    setWeeklyChallenges((prev) =>
      prev.map((challenge) => {
        let newProgress = challenge.progress

        if (challenge.id === 1) {
          // Maintain 5-day Streak
          newProgress = currentStreak
        } else if (challenge.id === 2) {
          // Complete All Personal Actions
          newProgress = completedActions
        } else if (challenge.id === 3) {
          // Achieve 80% Sustainability Score
          newProgress = sustainabilityScore >= 80 ? 80 : sustainabilityScore
        }

        const completed = newProgress >= challenge.target
        if (completed && !challenge.completed) {
          setTotalPoints((prev) => prev + challenge.reward)
          setExperiencePoints((prev) => prev + challenge.reward)
        }

        return { ...challenge, progress: newProgress, completed }
      }),
    )
  }

  const toggleAction = (id: number) => {
    const updated = personalActions.map((action) =>
      action.id === id ? { ...action, completed: !action.completed } : action,
    )
    setPersonalActions(updated)

    const newCompleted = updated.filter((a) => a.completed).length
    setCompletedActions(newCompleted)
    setSustainabilityScore(Math.min(100, newCompleted * 10))
    setRemainingActions(newCompleted - totalDecisionCost)

    if (updated.find((a) => a.id === id)?.completed) {
      setExperiencePoints((prev) => prev + 10)
      setTotalPoints((prev) => prev + 10)
      updateStreak()
    }

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

    const newLevel = calculateLevel(experiencePoints)
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel)
    }

    setTimeout(() => {
      checkAchievements()
      updateChallengeProgress()
    }, 100)
  }

  const handleDecision = (sustainable: boolean, actionCost: number) => {
    const personalCompleted = personalActions.filter((a) => a.completed).length

    if (personalCompleted - totalDecisionCost < actionCost) return

    if (sustainable) {
      setCo2Reduction((prev) => Math.min(100, prev + 10))
      setRecyclingRate((prev) => Math.min(100, prev + 5))
      setExperiencePoints((prev) => prev + 25)
      setTotalPoints((prev) => prev + 25)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      setCo2Reduction((prev) => Math.max(0, prev - 5))
      setRecyclingRate((prev) => Math.max(0, prev - 3))
      setExperiencePoints((prev) => Math.max(0, prev - 5))
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

    const newLevel = calculateLevel(experiencePoints)
    if (newLevel > playerLevel) {
      setPlayerLevel(newLevel)
    }

    setTimeout(() => {
      checkAchievements()
      updateChallengeProgress()
    }, 100)
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

      {newAchievements.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="bg-white border-0 shadow-2xl max-w-sm mx-4">
            <CardContent className="p-6 text-center">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Achievement Unlocked!</h3>
              {newAchievements.map((id) => {
                const achievement = achievements.find((a) => a.id === id)
                return achievement ? (
                  <div key={id} className="mb-3">
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="font-semibold">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    <div className="text-sm font-medium text-primary">+{achievement.points} XP</div>
                  </div>
                ) : null
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mini-Game Modal */}
      {currentMiniGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="bg-white border-0 shadow-2xl max-w-sm mx-4 w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  {currentMiniGame === "recycling" && "Recycling Sorting"}
                  {currentMiniGame === "energy" && "Energy Efficiency"}
                  {currentMiniGame === "carbon" && "Carbon Calculator"}
                  {currentMiniGame === "supply" && "Supply Chain Optimizer"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setCurrentMiniGame(null)}>
                  ✕
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  <Timer className="h-3 w-3 mr-1" />
                  {gameTimeLeft}s
                </Badge>
                <Badge variant="default">Score: {gameScore}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {currentMiniGame === "recycling" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Drag items to the correct recycling bins!</p>
                  <div className="relative h-48 bg-muted/20 rounded-lg overflow-hidden">
                    {recyclingItems.map((item) => (
                      <div
                        key={item.id}
                        className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-grab shadow-md"
                        style={{ left: item.x, top: item.y }}
                        draggable
                        onDragStart={() => setDraggedItem(item.id)}
                      >
                        <span className="text-lg">{item.emoji}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {["plastic", "paper", "organic", "glass"].map((binType) => (
                      <div
                        key={binType}
                        className="h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-primary/30"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => draggedItem && handleRecyclingDrop(draggedItem, binType)}
                      >
                        <Trash2 className="h-4 w-4 text-primary" />
                        <span className="text-xs capitalize">{binType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentMiniGame === "energy" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click cells to optimize energy usage. Fewer active cells = higher efficiency!
                  </p>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{energyScore}%</div>
                    <div className="text-xs text-muted-foreground">Energy Efficiency</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {energyGrid.map((cell, index) => (
                      <button
                        key={index}
                        className={`aspect-square rounded border-2 flex items-center justify-center ${
                          cell === 1 ? "bg-red-500 border-red-600 text-white" : "bg-green-100 border-green-300"
                        }`}
                        onClick={() => toggleEnergyCell(index)}
                      >
                        {cell === 1 ? <Zap className="h-4 w-4" /> : <Battery className="h-4 w-4 text-green-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentMiniGame === "carbon" && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="font-semibold">{carbonScenarios[carbonScenario]?.title}</h3>
                    <p className="text-sm text-muted-foreground">{carbonScenarios[carbonScenario]?.description}</p>
                  </div>
                  <div className="space-y-2">
                    {carbonScenarios[carbonScenario]?.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-between h-auto p-3 bg-transparent"
                        onClick={() => handleCarbonChoice(index)}
                      >
                        <span className="text-left">{option.text}</span>
                        <div className="text-right text-xs">
                          <div>{option.emissions}kg CO₂</div>
                          <div className="text-muted-foreground">${option.cost}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  <Progress value={(carbonScenario / carbonScenarios.length) * 100} className="h-2" />
                </div>
              )}

              {currentMiniGame === "supply" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Optimize transport methods to reduce emissions!</p>
                  <div className="space-y-3">
                    {supplyRoutes.map((route) => (
                      <div key={route.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">
                            {route.from} → {route.to}
                          </span>
                          <Badge variant="secondary">{route.emissions}kg CO₂</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {["electric", "rail", "bike"].map((method) => (
                            <Button
                              key={method}
                              size="sm"
                              variant={route.method === method ? "default" : "outline"}
                              onClick={() => optimizeSupplyRoute(route.id, method)}
                              className="text-xs"
                            >
                              {method === "electric" && <Car className="h-3 w-3 mr-1" />}
                              {method === "rail" && <Truck className="h-3 w-3 mr-1" />}
                              {method === "bike" && <Recycle className="h-3 w-3 mr-1" />}
                              {method}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">Efficiency: {gameScore}%</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-sm mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Factory className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">EcoFactory</h1>
          </div>
          <p className="text-white/90 text-sm">Build a sustainable future</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Badge className="bg-white/20 text-white border-white/30">
              <Crown className="h-3 w-3 mr-1" />
              Level {playerLevel}
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Star className="h-3 w-3 mr-1" />
              {totalPoints} Points
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Flame className="h-3 w-3 mr-1" />
              {currentStreak} Day Streak
            </Badge>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Level {playerLevel}</span>
              <span className="text-sm text-muted-foreground">
                {getCurrentLevelXP(experiencePoints, playerLevel)}/{getXPForNextLevel(playerLevel)} XP
              </span>
            </div>
            <Progress
              value={(getCurrentLevelXP(experiencePoints, playerLevel) / getXPForNextLevel(playerLevel)) * 100}
              className="h-2"
            />
          </CardContent>
        </Card>

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
          <TabsList className="grid w-full grid-cols-9 bg-white/90 backdrop-blur-sm text-xs">
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
            <TabsTrigger value="achievements" className="text-xs">
              <Trophy className="h-4 w-4 mr-1" />
              Awards
            </TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs">
              <Target className="h-4 w-4 mr-1" />
              Goals
            </TabsTrigger>
            <TabsTrigger value="games" className="text-xs">
              <Gamepad2 className="h-4 w-4 mr-1" />
              Games
            </TabsTrigger>
            <TabsTrigger value="world" className="text-xs">
              <Globe className="h-4 w-4 mr-1" />
              World
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs">
              <Users className="h-4 w-4 mr-1" />
              Social
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

          <TabsContent value="games" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                  Mini-Games
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 bg-transparent"
                    onClick={() => startMiniGame("recycling")}
                  >
                    <Trash2 className="h-6 w-6 text-green-600" />
                    <span className="text-xs">Recycling Sort</span>
                    <span className="text-[10px] text-muted-foreground">Drag & Drop</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 bg-transparent"
                    onClick={() => startMiniGame("energy")}
                  >
                    <Zap className="h-6 w-6 text-yellow-600" />
                    <span className="text-xs">Energy Puzzle</span>
                    <span className="text-[10px] text-muted-foreground">Optimize Grid</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 bg-transparent"
                    onClick={() => startMiniGame("carbon")}
                  >
                    <Calculator className="h-6 w-6 text-blue-600" />
                    <span className="text-xs">Carbon Calc</span>
                    <span className="text-[10px] text-muted-foreground">Make Choices</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-1 bg-transparent"
                    onClick={() => startMiniGame("supply")}
                  >
                    <Route className="h-6 w-6 text-purple-600" />
                    <span className="text-xs">Supply Chain</span>
                    <span className="text-[10px] text-muted-foreground">Route Planning</span>
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Play mini-games to earn bonus XP and learn sustainability concepts!
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="world" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Local Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{localEnvironmentalData.location}</span>
                    <Badge variant="secondary" className="capitalize">
                      {localEnvironmentalData.season}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="text-sm font-medium">{localEnvironmentalData.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">Temperature</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">{localEnvironmentalData.airQuality}</div>
                        <div className="text-xs text-muted-foreground">Air Quality</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-sm font-medium">{localEnvironmentalData.humidity}%</div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium">UV {localEnvironmentalData.uvIndex}</div>
                        <div className="text-xs text-muted-foreground">UV Index</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TreePine className="h-5 w-5 text-primary" />
                  Seasonal Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {seasonalChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{challenge.title}</span>
                      <Badge variant={challenge.completed ? "default" : "secondary"}>
                        {challenge.completed ? "Complete" : `${challenge.reward} XP`}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                    <Button
                      size="sm"
                      variant={challenge.completed ? "secondary" : "default"}
                      onClick={() => completeSeasonalChallenge(challenge.id)}
                      disabled={challenge.completed}
                      className="w-full"
                    >
                      {challenge.completed ? "Completed" : "Complete Challenge"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="h-5 w-5 text-primary" />
                  Environmental News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {environmentalNews.map((news) => (
                      <div key={news.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm">{news.title}</h4>
                          <Badge variant={news.impact === "positive" ? "default" : "secondary"} className="ml-2">
                            {news.impact === "positive" ? "+" : "!"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{news.summary}</p>
                        <div className="text-xs text-muted-foreground">{new Date(news.date).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Waves className="h-5 w-5 text-primary" />
                  Real-World Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground">Your actions are equivalent to:</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TreePine className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-green-600">{realWorldImpact.treesEquivalent}</div>
                      <div className="text-xs text-muted-foreground">Trees Planted</div>
                    </div>

                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Car className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-blue-600">{realWorldImpact.carsOffRoad}</div>
                      <div className="text-xs text-muted-foreground">Cars Off Road</div>
                    </div>

                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Zap className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-yellow-600">{realWorldImpact.energySavedKwh}</div>
                      <div className="text-xs text-muted-foreground">kWh Saved</div>
                    </div>

                    <div className="text-center p-3 bg-cyan-50 rounded-lg">
                      <Droplets className="h-6 w-6 text-cyan-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-cyan-600">{realWorldImpact.waterSavedLiters}</div>
                      <div className="text-xs text-muted-foreground">Liters Saved</div>
                    </div>
                  </div>

                  <div className="text-center text-xs text-muted-foreground mt-4">
                    Keep taking sustainable actions to increase your real-world impact!
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-primary" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {leaderboardData
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            player.name === "You" ? "bg-primary/10 border-2 border-primary/20" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                            <div className="text-2xl">{player.avatar}</div>
                            <div>
                              <div className="font-medium text-sm">{player.name}</div>
                              <div className="text-xs text-muted-foreground">Level {player.level}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-primary">{player.score}</div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Eco Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {ecoCommunitiesData.map((community) => (
                      <div key={community.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{community.name}</h4>
                            <p className="text-xs text-muted-foreground">{community.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {community.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{community.members} members</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={community.joined ? "secondary" : "default"}
                            onClick={() => {
                              setEcoCommunitiesData((prev) =>
                                prev.map((c) => (c.id === community.id ? { ...c, joined: !c.joined } : c)),
                              )
                            }}
                          >
                            {community.joined ? "Joined" : "Join"}
                          </Button>
                        </div>

                        {community.joined && (
                          <div className="mt-3 p-2 bg-green-50 rounded">
                            <div className="text-xs font-medium mb-1">Weekly Challenge:</div>
                            <div className="text-xs text-muted-foreground mb-2">{community.weeklyChallenge}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={community.challengeProgress} className="flex-1 h-2" />
                              <span className="text-xs font-medium">{community.challengeProgress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-primary" />
                  Team Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{challenge.title}</h4>
                        <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {challenge.timeLeft}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>
                          {challenge.progress.toLocaleString()} / {challenge.target.toLocaleString()}
                        </span>
                        <span>{challenge.participants.toLocaleString()} participants</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground">Reward: {challenge.reward}</div>
                    </div>

                    <Button size="sm" className="w-full mt-2">
                      Contribute to Challenge
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Share2 className="h-5 w-5 text-primary" />
                  Share Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-primary mb-1">Level {playerLevel} Eco Warrior</div>
                  <div className="text-sm text-muted-foreground mb-2">{sustainabilityScore} sustainability points</div>
                  <div className="text-xs text-muted-foreground">
                    {completedActions}/{totalActions} actions completed
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Share on Social
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>

                <div className="text-xs text-center text-muted-foreground">
                  Inspire others to join the sustainability movement!
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
