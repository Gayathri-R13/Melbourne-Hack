"use client"

import { useState, useEffect, useLayoutEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { JSX } from "react/jsx-runtime"
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
  Rocket,
  Flame,
  Users,
  Share2,
  List,
  Timer,
  RefreshCcw,
  Footprints,
  GitGraph,
  User,
} from "lucide-react"

// --- Custom Hooks and Components (to replace external libraries) ---
// Custom useWindowSize hook to replace 'react-use'
function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeListener('resize', updateSize);
  }, []);
  return size;
}

// Custom Confetti component to replace 'react-confetti' with custom behavior
const Confetti = ({ show, width, height }) => {
  if (!show) return null;

  const confettiPieces = Array.from({ length: 300 }).map((_, i) => {
    const emojis = ["🍀", "🌿", "🌸"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 2 + 1}s`,
      animationDelay: `${Math.random() * 0.5}s`,
    };
    return <div key={i} className="confetti-piece" style={style}>{randomEmoji}</div>;
  });

  return (
    <div className="confetti-container" style={{ width, height }}>
      {confettiPieces}
      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          pointer-events: none;
        }
        .confetti-piece {
          position: absolute;
          font-size: 20px;
          top: -20px;
          opacity: 0;
          transform: translateY(0) rotate(0);
          animation: confetti-fall linear infinite;
        }
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0);
          }
          100% {
            opacity: 0;
            transform: translateY(${height}px) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

// --- Character Avatars Data ---
const avatars = [
  { id: 1, name: "Eco-Hero", image_url: "https://i.pinimg.com/736x/e9/3f/93/e93f9306c71ba815c7ce51dd53f1c6e4.jpg" },
  { id: 2, name: "Green Guru", image_url: "https://i.pinimg.com/736x/94/e0/90/94e090a659640666db4cb3267bf62192.jpg" },
  { id: 3, name: "Nature Nurturer", image_url: "https://i.pinimg.com/736x/e3/ed/70/e3ed705a87b56a391326564d8cf9947c.jpg" },
  { id: 4, name: "Forest Friend", image_url: "https://i.pinimg.com/736x/58/a7/3c/58a73c4f1a7bb444eaa2c44de147f7ff.jpg" },
  { id: 5, name: "Eco-Explorer", image_url: "https://i.pinimg.com/736x/e3/2c/da/e32cda89df20e5168125d0373b5a0d0d.jpg" },
  { id: 6, name: "Plant Pioneer", image_url: "https://i.pinimg.com/736x/9e/4d/d2/9e4dd2cbb97f3fec0d9e7c9b31c6f335.jpg" },
  { id: 7, name: "Recycle Ranger", image_url: "https://i.pinimg.com/736x/63/9b/79/639b79dc522f1fbde8999ae0c549a5ae.jpg" },
  { id: 8, name: "Green Guardian", image_url: "https://i.pinimg.com/736x/24/2e/b2/242eb23bc0ee187a742bf71ddf298ed9.jpg" },
];

// Define achievement data
const allBadges = [
  {
    id: "carbon_crusher",
    name: "Carbon Crusher",
    description: "Reduced CO₂ emissions by over 50%.",
    criteria: (state) => state.co2Reduction >= 50,
  },
  {
    id: "recycling_champion",
    name: "Recycling Champion",
    description: "Achieved a recycling rate of 100%.",
    criteria: (state) => state.recyclingRate === 100,
  },
  {
    id: "green_streak",
    name: "Green Streak Master",
    description: "Maintained a 3-day daily action streak.",
    criteria: (state) => state.dailyStreak >= 3,
  },
  {
    id: "sustainable_starter",
    name: "Sustainable Starter",
    description: "Completed your first action.",
    criteria: (state) => state.completedActions > 0,
  },
  {
    id: "eco_innovator",
    name: "Eco Innovator",
    description: "Made 5 sustainable factory decisions.",
    criteria: (state) => state.sustainableDecisions >= 5,
  },
];

// Define level data
const ecoLevels = [
  { name: "Seedling", scoreThreshold: 0 },
  { name: "Sprout", scoreThreshold: 20 },
  { name: "Sapling", scoreThreshold: 50 },
  { name: "Mighty Oak", scoreThreshold: 80 },
];

// Function to get the current level based on sustainability score
const getCurrentLevel = (score) => {
  let currentLevel = ecoLevels[0];
  for (const level of ecoLevels) {
    if (score >= level.scoreThreshold) {
      currentLevel = level;
    }
  }
  return currentLevel;
};

// Function to generate a new daily challenge
const generateDailyChallenge = () => {
  const challenges = [
    "Recycle a reusable product",
    "Switch off lights for an hour",
    "Walk or bike to work today",
    "Compost your food scraps",
    "Use public transportation",
    "Drink from a reusable bottle",
  ];
  const randomIndex = Math.floor(Math.random() * challenges.length);
  return {
    text: challenges[randomIndex],
    completed: false,
  };
};

const initialLeaderboardData = [
  { name: "EcoWarrior88", score: 95, isUser: false },
  { name: "GreenGuru", score: 88, isUser: false },
  { name: "PlantPower", score: 82, isUser: false },
  { name: "CleanCove", score: 75, isUser: false },
];

const teamChallengesData = [
  {
    id: 1,
    name: "City-wide Tree Planting",
    progress: 75,
    goal: 500,
    unit: "trees",
    description: "Our community's goal to plant trees to combat carbon.",
  },
  {
    id: 2,
    name: "Beach Cleanup Drive",
    progress: 40,
    goal: 100,
    unit: "bags of trash",
    description: "Collect plastic waste from our local beaches.",
  },
];

const ecoCommunitiesData = [
  {
    id: 1,
    name: "Composting Crew",
    members: 25,
    description: "Tips and tricks for turning kitchen scraps into garden gold.",
  },
  {
    id: 2,
    name: "Sustainable Swappers",
    members: 58,
    description: "Trade clothes, books, and home goods to reduce waste.",
  },
];

const recyclingItems = [
  { id: 1, name: "Plastic Bottle", type: "plastic", emoji: "🧴" },
  { id: 2, name: "Glass Jar", type: "glass", emoji: "🥛" },
  { id: 3, name: "Newspaper", type: "paper", emoji: "📰" },
  { id: 4, name: "Banana Peel", type: "compost", emoji: "🍌" },
  { id: 5, name: "Aluminum Can", type: "metal", emoji: "🥫" },
  { id: 6, name: "Cardboard Box", type: "paper", emoji: "📦" },
  { id: 7, name: "Empty Coffee Pod", type: "plastic", emoji: "☕️" },
  { id: 8, name: "Apple Core", type: "compost", emoji: "🍎" },
  { id: 9, name: "Broken Bulb", type: "glass", emoji: "💡" },
];

// Data for the new Carbon Footprint game
const carbonScenarios = [
  {
    id: 1,
    question: "How do you usually get to work or school?",
    options: [
      { text: "Drive alone in a car", carbonImpact: 10, points: 10 },
      { text: "Carpool or public transit", carbonImpact: 5, points: 20 },
      { text: "Bike or walk", carbonImpact: 1, points: 30 },
    ],
  },
  {
    id: 2,
    question: "What kind of food do you primarily eat?",
    options: [
      { text: "Meat-heavy diet", carbonImpact: 15, points: 5 },
      { text: "Balanced diet with some meat", carbonImpact: 8, points: 15 },
      { text: "Vegetarian or vegan diet", carbonImpact: 3, points: 25 },
    ],
  },
  {
    id: 3,
    question: "How do you handle household waste?",
    options: [
      { text: "Throw everything in the trash", carbonImpact: 12, points: 10 },
      { text: "Recycle when possible", carbonImpact: 5, points: 20 },
      { text: "Recycle and compost", carbonImpact: 2, points: 30 },
    ],
  },
  {
    id: 4,
    question: "What's your typical clothing shopping habit?",
    options: [
      { text: "Buy new fast fashion frequently", carbonImpact: 10, points: 5 },
      { text: "Buy from a mix of new and sustainable brands", carbonImpact: 5, points: 15 },
      { text: "Buy primarily second-hand or ethical brands", carbonImpact: 2, points: 25 },
    ],
  },
];

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

export default function EcoFactoryApp() {
  const [sustainabilityScore, setSustainabilityScore] = useState(0);
  const [completedActions, setCompletedActions] = useState(0);
  const [totalActions] = useState(10);
  const [remainingActions, setRemainingActions] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [co2Reduction, setCo2Reduction] = useState(0);
  const [recyclingRate, setRecyclingRate] = useState(0);
  const [totalDecisionCost, setTotalDecisionCost] = useState(0);
  const [sustainableDecisions, setSustainableDecisions] = useState(0);
  const [levelUpMessage, setLevelUpMessage] = useState(null);
  const [environmentalHistory, setEnvironmentalHistory] = useState([
    { day: 1, energySaved: 0, co2Reduced: 0, recyclingRate: 0 },
  ]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI sustainability advisor. How can I help you make more eco-friendly choices today?",
      sender: "ai" as const,
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
  ]);
  const [dailyChallenge, setDailyChallenge] = useState(() => generateDailyChallenge());
  const [dailyStreak, setDailyStreak] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [width, height] = useWindowSize();
  const prevScoreRef = useRef(sustainabilityScore);
  const [activeTab, setActiveTab] = useState("progress");
  const [activeStage, setActiveStage] = useState("packaging");
  const [leaderboard, setLeaderboard] = useState(initialLeaderboardData);

  // --- Character Customization State ---
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  
  // --- Game State ---
  const [activeActivityGame, setActiveActivityGame] = useState(null); // 'recycling', 'carbon', or 'supply_chain'
  const [messageBox, setMessageBox] = useState({
      isVisible: false,
      title: "",
      text: "",
  });

  // Recycling Game state
  const [recyclingGameScore, setRecyclingGameScore] = useState(0);
  const [recyclingGameTime, setRecyclingGameTime] = useState(30);
  const [recyclingItemsState, setRecyclingItemsState] = useState([]);
  const [recyclingGameMessage, setRecyclingGameMessage] = useState("Drag and drop items to the correct bin!");
  const [activeDragItem, setActiveDragItem] = useState(null);

  // Carbon Game state
  const [carbonGameStep, setCarbonGameStep] = useState(0);
  const [carbonGameScore, setCarbonGameScore] = useState(0);
  const [totalCarbonImpact, setTotalCarbonImpact] = useState(0);
  
  // Supply Chain Game State
  const [supplyChainState, setSupplyChainState] = useState({
      isPlaying: false,
      cities: [],
      selectedCity: null,
      connections: [],
      score: 0,
      co2Emissions: 0,
      level: 1,
      numCities: 5,
  });
  const canvasRef = useRef(null);

  // General Message Box Handlers
  const showMessageBox = (title, text) => {
      setMessageBox({ isVisible: true, title, text });
      setTimeout(() => {
          setMessageBox({ isVisible: false, title: "", text: "" });
      }, 5000); // Hide after 5 seconds
  };
  
  const handleGameEnd = (finalScore, finalCo2, gameName) => {
    setActiveActivityGame(null);
    const scoreIncrease = Math.max(0, finalScore / 100);
    setSustainabilityScore(prev => Math.min(100, prev + scoreIncrease));
    showMessageBox(`${gameName} Complete!`, `Your final score was ${Math.round(finalScore)}. Your sustainability score increased by ${scoreIncrease.toFixed(1)}!`);
    setChatMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text: `You completed the ${gameName} game! Your final score was ${Math.round(finalScore)}. Your sustainability score increased by ${scoreIncrease.toFixed(1)}!`,
      sender: "ai" as const,
      timestamp: new Date(),
    }]);
  };
  
  const SupplyChainOptimizerGame = () => {
    const { isPlaying, cities, selectedCity, connections, score, co2Emissions, level, numCities } = supplyChainState;

    // Game constants
    const CITY_RADIUS = 15;
    const CITY_COLOR = '#6ee7b7';
    const SELECTED_COLOR = '#fcd34d';
    const LINE_COLOR = '#a78bfa';
    const TEXT_COLOR = '#e5e7eb';
    const CO2_PER_KM = 0.005; // metric tons of CO2 per pixel-km

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#2c313a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(cities[conn.from].x, cities[conn.from].y);
        ctx.lineTo(cities[conn.to].x, cities[conn.to].y);
        ctx.strokeStyle = LINE_COLOR;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
      });

      cities.forEach(city => {
        ctx.beginPath();
        ctx.arc(city.x, city.y, CITY_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = city.isDepot ? '#eab308' : (city.isDelivered ? '#10b981' : CITY_COLOR);
        ctx.fill();
        if (selectedCity && selectedCity.id === city.id) {
          ctx.strokeStyle = SELECTED_COLOR;
          ctx.lineWidth = 4;
          ctx.stroke();
        }
        ctx.closePath();
        
        ctx.fillStyle = TEXT_COLOR;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold 14px Roboto Mono, monospace`;
        ctx.fillText(city.id, city.x, city.y);
      });
    };
    
    const calculateDistance = (city1, city2) => {
        const dx = city1.x - city2.x;
        const dy = city1.y - city2.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const updateStats = () => {
        let newCo2 = 0;
        connections.forEach(conn => {
            const distance = calculateDistance(cities[conn.from], cities[conn.to]);
            newCo2 += distance * CO2_PER_KM;
        });

        const totalCities = cities.length;
        const maxScore = totalCities * 1000;
        
        let newScore = 0;
        if (connections.length === totalCities - 1) {
            newScore = Math.max(0, maxScore - newCo2 * 10);
        } else {
            newScore = 0;
        }

        setSupplyChainState(prev => ({
            ...prev,
            co2Emissions: newCo2,
            score: newScore,
        }));
    };

    const checkWinCondition = () => {
        const allDelivered = cities.every(city => city.isDelivered);
        const allConnected = connections.length === numCities - 1;

        if (allDelivered && allConnected) {
            handleGameEnd(score, co2Emissions, "Supply Chain Optimizer");
            setSupplyChainState(prev => ({ ...prev, level: prev.level + 1 }));
            startNewGame();
        }
    };
    
    const createCities = (count) => {
        const newCities = [];
        const canvas = canvasRef.current;
        if (!canvas) return;
        for (let i = 0; i < count; i++) {
            newCities.push({
                x: Math.random() * (canvas.width - 100) + 50,
                y: Math.random() * (canvas.height - 100) + 50,
                id: i,
                isDepot: i === 0,
                isDelivered: false
            });
        }
        newCities[0].isDelivered = true;
        setSupplyChainState(prev => ({ ...prev, cities: newCities }));
    };

    const startNewGame = () => {
        setSupplyChainState(prev => {
            const newLevel = prev.level;
            const newNumCities = Math.min(15, 5 + newLevel * 2);
            const newCities = [];
            const canvas = canvasRef.current;
            if (!canvas) return prev;
            for (let i = 0; i < newNumCities; i++) {
                newCities.push({
                    x: Math.random() * (canvas.width - 100) + 50,
                    y: Math.random() * (canvas.height - 100) + 50,
                    id: i,
                    isDepot: i === 0,
                    isDelivered: false
                });
            }
            newCities[0].isDelivered = true;
            return {
                ...prev,
                isPlaying: true,
                connections: [],
                score: 0,
                co2Emissions: 0,
                level: newLevel,
                numCities: newNumCities,
                cities: newCities
            };
        });
    };

    const handleInput = (event) => {
        event.preventDefault();
        if (!isPlaying) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = event.clientX || (event.touches ? event.touches[0].clientX : 0);
        const clientY = event.clientY || (event.touches ? event.touches[0].clientY : 0);
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const clickedCity = cities.find(city => {
            const distance = calculateDistance(city, { x, y });
            return distance <= CITY_RADIUS;
        });

        if (clickedCity) {
            setSupplyChainState(prev => {
                let newSelectedCity = prev.selectedCity;
                let newConnections = [...prev.connections];
                let newCities = [...prev.cities];

                if (newSelectedCity) {
                    if (newSelectedCity.id === clickedCity.id) {
                        newSelectedCity = null;
                    } else {
                        const existingConnection = newConnections.find(c =>
                            (c.from === newSelectedCity.id && c.to === clickedCity.id) ||
                            (c.from === clickedCity.id && c.to === newSelectedCity.id)
                        );
                        if (!existingConnection) {
                            newConnections.push({ from: newSelectedCity.id, to: clickedCity.id });
                            newCities[newSelectedCity.id].isDelivered = true;
                            newCities[clickedCity.id].isDelivered = true;
                        }
                        newSelectedCity = null;
                    }
                } else {
                    newSelectedCity = clickedCity;
                }
                return { ...prev, selectedCity: newSelectedCity, connections: newConnections, cities: newCities };
            });
        } else {
            setSupplyChainState(prev => ({ ...prev, selectedCity: null }));
        }
    };
    
    // UseEffect to handle drawing and win condition
    useEffect(() => {
        draw();
        if (isPlaying) {
            updateStats();
            checkWinCondition();
        }
    }, [supplyChainState.connections, supplyChainState.selectedCity, isPlaying, supplyChainState.cities]);

    // Resize logic
    useEffect(() => {
      const resizeCanvas = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const gameContainer = document.querySelector('.game-container');
          if (gameContainer) {
              canvas.width = gameContainer.offsetWidth - 60;
              canvas.height = Math.min(500, window.innerHeight - 300);
              // Re-create cities on resize to prevent them from going off-screen
              if (isPlaying) {
                 createCities(supplyChainState.numCities);
              }
          }
      };
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      return () => window.removeEventListener('resize', resizeCanvas);
    }, [isPlaying, supplyChainState.numCities]);
    
    const handleReset = () => {
        setSupplyChainState(prev => ({
            ...prev,
            connections: [],
            score: 0,
            co2Emissions: 0,
            selectedCity: null,
            cities: prev.cities.map((city, index) => ({...city, isDelivered: index === 0})),
        }));
    };
    
    const handleLevelUp = () => {
      setSupplyChainState(prev => ({ ...prev, level: prev.level + 1 }));
      startNewGame();
    };

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-center mb-2">Supply Chain Optimizer</h3>
        <p className="text-sm text-center text-muted-foreground">
          Connect all cities to the depot with the shortest routes to minimize CO₂.
        </p>
        <div className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg text-sm text-white">
          <span>Score: {Math.round(score)}</span>
          <span>CO₂: {co2Emissions.toFixed(2)}t</span>
          <span>Level: {level}</span>
        </div>
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          className="w-full bg-gray-800 rounded-lg"
          onMouseDown={handleInput}
          onTouchStart={handleInput}
        ></canvas>
        <div className="flex justify-center gap-4">
          {!isPlaying ? (
            <Button onClick={startNewGame}>Start Game</Button>
          ) : (
            <Button onClick={handleReset}>Reset Level</Button>
          )}
        </div>
      </div>
    );
  };


  // --- Persistence Logic ---
  useEffect(() => {
    try {
      const savedState = JSON.parse(localStorage.getItem("ecoFactoryState"));
      if (savedState) {
        setSustainabilityScore(savedState.sustainabilityScore);
        setCompletedActions(savedState.completedActions);
        setCo2Reduction(savedState.co2Reduction);
        setRecyclingRate(savedState.recyclingRate);
        setTotalDecisionCost(savedState.totalDecisionCost);
        setEnvironmentalHistory(savedState.environmentalHistory);
        setChatMessages(savedState.chatMessages);
        setPersonalActions(savedState.personalActions);
        setDailyChallenge(savedState.dailyChallenge);
        setDailyStreak(savedState.dailyStreak);
        setUnlockedBadges(savedState.unlockedBadges);
        setSustainableDecisions(savedState.sustainableDecisions);
        setSelectedAvatar(savedState.selectedAvatar || avatars[0]);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      sustainabilityScore,
      completedActions,
      co2Reduction,
      recyclingRate,
      totalDecisionCost,
      environmentalHistory,
      chatMessages,
      personalActions,
      dailyChallenge,
      dailyStreak,
      unlockedBadges,
      sustainableDecisions,
      selectedAvatar,
    };
    localStorage.setItem("ecoFactoryState", JSON.stringify(stateToSave));
  }, [sustainabilityScore, completedActions, co2Reduction, recyclingRate, totalDecisionCost, environmentalHistory, chatMessages, personalActions, dailyChallenge, dailyStreak, unlockedBadges, sustainableDecisions, selectedAvatar]);

  // Handle daily challenge reset and streak logic
  useEffect(() => {
    const lastChallengeDate = localStorage.getItem("lastChallengeDate");
    const today = new Date().toDateString();
    if (lastChallengeDate !== today) {
      if (dailyChallenge.completed) {
        setDailyStreak((prev) => prev + 1);
      } else {
        setDailyStreak(0);
      }
      setDailyChallenge(generateDailyChallenge());
      localStorage.setItem("lastChallengeDate", today);
    }
  }, [dailyChallenge.completed]);

  // --- Achievement Logic ---
  useEffect(() => {
    const newState = { sustainabilityScore, co2Reduction, recyclingRate, dailyStreak, completedActions, sustainableDecisions };
    const newlyUnlocked = allBadges.filter(
      (badge) => badge.criteria(newState) && !unlockedBadges.some((b) => b.id === badge.id)
    );
    if (newlyUnlocked.length > 0) {
      setUnlockedBadges((prev) => [...prev, ...newlyUnlocked]);
      newlyUnlocked.forEach((badge) => {
        setChatMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            text: `⭐ Achievement Unlocked! You earned the "${badge.name}" badge.`,
            sender: "ai" as const,
            timestamp: new Date(),
          },
        ]);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      });
    }
  }, [sustainabilityScore, co2Reduction, recyclingRate, dailyStreak, completedActions, sustainableDecisions, unlockedBadges]);

  // --- Level Up Animation Logic ---
  useEffect(() => {
    const prevLevel = getCurrentLevel(prevScoreRef.current);
    const currentLevel = getCurrentLevel(sustainabilityScore);
    if (currentLevel.name !== prevLevel.name) {
      setLevelUpMessage(`Level Unlocked: ${currentLevel.name}!`);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setTimeout(() => setLevelUpMessage(null), 3000);
    }
    prevScoreRef.current = sustainabilityScore;
  }, [sustainabilityScore]);

  // Handle daily challenge reset and streak logic
  useEffect(() => {
    const lastChallengeDate = localStorage.getItem("lastChallengeDate");
    const today = new Date().toDateString();
    if (lastChallengeDate !== today) {
      if (dailyChallenge.completed) {
        setDailyStreak((prev) => prev + 1);
      } else {
        setDailyStreak(0);
      }
      setDailyChallenge(generateDailyChallenge());
      localStorage.setItem("lastChallengeDate", today);
    }
  }, [dailyChallenge.completed]);

  // --- Game Logic Functions ---
  const startRecyclingGame = () => {
    setRecyclingGameScore(0);
    setRecyclingGameTime(30);
    setActiveActivityGame('recycling');
    setRecyclingGameMessage("Go!");
    const shuffledItems = [...recyclingItems].sort(() => 0.5 - Math.random());
    setRecyclingItemsState(shuffledItems.slice(0, 5));
  };

  const handleRecyclingDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item.id);
    setActiveDragItem(item);
  };

  const handleRecyclingDrop = (e, binType) => {
    e.preventDefault();
    if (!activeDragItem) return;

    const droppedItem = activeDragItem;
    if (droppedItem.type === binType) {
      setRecyclingGameScore(prev => prev + 10);
      setRecyclingGameMessage("Correct! +10 points!");
    } else {
      setRecyclingGameScore(prev => Math.max(0, prev - 5));
      setRecyclingGameMessage("Wrong! -5 points!");
    }
    setRecyclingItemsState(prev => prev.filter(item => item.id !== droppedItem.id));
    setActiveDragItem(null);
  };

  const endRecyclingGame = () => {
    setActiveActivityGame(null);
    setRecyclingGameTime(0);
    const scoreIncrease = Math.max(0, recyclingGameScore / 5);
    setSustainabilityScore(prev => Math.min(100, prev + scoreIncrease));
    if (recyclingGameScore > 0) {
      showMessageBox("Recycling Game Complete!", `You scored ${recyclingGameScore} points! Your sustainability score increased by ${scoreIncrease.toFixed(1)}!`);
      setChatMessages(prev => [...prev, {
        id: Date.now() + Math.random(),
        text: `You scored ${recyclingGameScore} in the recycling game! Your sustainability score increased by ${scoreIncrease.toFixed(1)}!`,
        sender: "ai" as const,
        timestamp: new Date(),
      }]);
    }
  };

  useEffect(() => {
    if (activeActivityGame === 'recycling' && recyclingGameTime > 0) {
      const timer = setInterval(() => {
        setRecyclingGameTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (recyclingGameTime === 0 && activeActivityGame === 'recycling') {
      setRecyclingGameMessage("Time's up! Game Over!");
      endRecyclingGame();
    }
  }, [activeActivityGame, recyclingGameTime]);

  useEffect(() => {
    if (activeActivityGame === 'recycling' && recyclingItemsState.length === 0) {
      setRecyclingGameMessage("All items sorted! Game Over!");
      endRecyclingGame();
    }
  }, [recyclingItemsState, activeActivityGame]);

  const startCarbonGame = () => {
    setActiveActivityGame('carbon');
    setCarbonGameStep(0);
    setCarbonGameScore(0);
    setTotalCarbonImpact(0);
  };

  const handleCarbonChoice = (points, carbonImpact) => {
    setCarbonGameScore(prev => prev + points);
    setTotalCarbonImpact(prev => prev + carbonImpact);

    if (carbonGameStep < carbonScenarios.length - 1) {
      setCarbonGameStep(prev => prev + 1);
    } else {
      endCarbonGame();
    }
  };

  const endCarbonGame = () => {
    setActiveActivityGame(null);
    const scoreIncrease = Math.max(0, carbonGameScore / 10);
    setSustainabilityScore(prev => Math.min(100, prev + scoreIncrease));
    showMessageBox("Carbon Footprint Calculated!", `Based on your choices, you scored ${carbonGameScore} points. Your sustainability score increased by ${scoreIncrease.toFixed(1)}!`);
    setChatMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text: `Your carbon footprint calculator results: you scored ${carbonGameScore} points! Your sustainability score increased by ${scoreIncrease.toFixed(1)}!`,
      sender: "ai" as const,
      timestamp: new Date(),
    }]);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user" as const,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput("");
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          userProgress: { sustainabilityScore, completedActions, totalActions, co2Reduction, recyclingRate },
        }),
      });
      if (!response.ok) throw new Error("Failed to get response");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";
      const aiMessageId = Date.now() + 1;
      setChatMessages((prev) => [
        ...prev, { id: aiMessageId, text: "", sender: "ai" as const, timestamp: new Date() },
      ]);
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setChatMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: fullResponse } : msg)));
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again!",
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleAction = (id: number) => {
    const updated = personalActions.map((action) =>
      action.id === id ? { ...action, completed: !action.completed } : action,
    );
    setPersonalActions(updated);
    const newCompleted = updated.filter((a) => a.completed).length;
    setCompletedActions(newCompleted);
    setSustainabilityScore(Math.min(100, newCompleted * 10));
    setRemainingActions(newCompleted - totalDecisionCost);
    const newEnergySaved = newCompleted * 8;
    const currentDay = environmentalHistory.length + 1;
    setEnvironmentalHistory((prev) => [
      ...prev,
      { day: currentDay, energySaved: newEnergySaved, co2Reduced: co2Reduction, recyclingRate: recyclingRate },
    ]);
  };

  const handleDailyChallenge = (challengeText) => {
    if (dailyChallenge.text === challengeText && !dailyChallenge.completed) {
      setDailyChallenge((prev) => ({ ...prev, completed: true }));
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          text: "🎉 Daily challenge completed! Your streak is now on fire.",
          sender: "ai" as const,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleDecision = (
    co2Reduction: number,
    recyclingIncrease: number,
    actionCost: number
  ) => {
    // Check if user has enough remaining actions
    if (completedActions - totalDecisionCost < actionCost) {
      return
    }

    setCo2Reduction(prev => Math.min(prev + co2Reduction, 100))
    setRecyclingRate(prev => Math.min(prev + recyclingIncrease, 100))
    setSustainableDecisions(prev => prev + 1);

    // Use a functional update to ensure totalDecisionCost is up-to-date
    setTotalDecisionCost(prev => {
      const newTotalCost = prev + actionCost;
      // Set remaining actions based on the new total cost and completed actions
      setRemainingActions(completedActions - newTotalCost);
      return newTotalCost;
    });
  };
  
  const getEnvironmentBackgroundUrl = (sustainabilityScore) => {
    const progress = sustainabilityScore / 100;
    
    // Define the image URLs
    const lowProgressImage = 'https://videos.openai.com/vg-assets/assets%2Ftask_01k3yt2c9cec8s0175tvwvv92a%2F1756601951_img_0.webp?st=2025-08-31T05%3A58%3A25Z&se=2025-09-06T06%3A58%3A25Z&sks=b&skt=2025-08-31T05%3A58%3A25Z&ske=2025-09-06T06%3A58%3A25Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=MEe%2BTL9M9Q0jEWnYkVqsK0TZamqNZBJwSJ%2B%2B012C9sU%3D&az=oaivgprodscus';
    const mediumProgressImage = 'https://videos.openai.com/vg-assets/assets%2Ftask_01k3zggtmge6e9dpsd70prh6dw%2F1756625515_img_0.webp?st=2025-08-31T06%3A19%3A54Z&se=2025-09-06T07%3A19%3A54Z&sks=b&skt=2025-08-31T06%3A19%3A54Z&ske=2025-09-06T07%3A19%3A54Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=EeLG3vKz3IOj7%2F85oVSX3YCLucJHrEL0pvZeoDxSDuc%3D&az=oaivgprodscus';
    const highProgressImage = 'https://videos.openai.com/vg-assets/assets%2Ftask_01k3zjastnfk6v5f970w6f9s6m%2F1756627408_img_0.webp?st=2025-08-31T06%3A53%3A19Z&se=2025-09-06T07%3A53%3A19Z&sks=b&skt=2025-08-31T06%3A53%3A19Z&ske=2025-09-06T07%3A53%3A19Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=nUVr5mr%2BV4CETBv487pwvA15Xay7QyAv%2FqqydkEkcg8%3D&az=oaivgprodscus';

    if (progress < 0.3) {
        return lowProgressImage;
    }
    if (progress < 0.6) {
        return mediumProgressImage;
    }
    return highProgressImage;
  };

  // Update the leaderboard when sustainability score changes
  useEffect(() => {
    const userEntry = { name: selectedAvatar.name, score: sustainabilityScore, isUser: true };
    const combinedData = [...initialLeaderboardData, userEntry];
    const sortedData = combinedData.sort((a, b) => b.score - a.score);
    const rankedData = sortedData.map((user, index) => ({ ...user, rank: index + 1 }));
    setLeaderboard(rankedData);
  }, [sustainabilityScore, selectedAvatar]);

  const currentLevel = getCurrentLevel(sustainabilityScore);
  const nextLevel = ecoLevels.find((level) => level.scoreThreshold > sustainabilityScore);
  const nextLevelProgress = nextLevel ? ((sustainabilityScore - currentLevel.scoreThreshold) / (nextLevel.scoreThreshold - currentLevel.scoreThreshold)) * 100 : 100;

  // Components for the two games to keep the rendering logic clean
  const RecyclingGame = () => (
    <div className="w-full space-y-4">
      <h3 className="font-semibold text-lg text-center mb-2">Recycling Sorting Game</h3>
      <div className="flex justify-between items-center">
        <Badge className="bg-primary">Score: {recyclingGameScore}</Badge>
        <Badge className="bg-destructive">
          <Timer className="h-4 w-4 mr-1" />
          {recyclingGameTime}s
        </Badge>
      </div>
      <div className="flex justify-center flex-wrap gap-2 min-h-[100px] items-center">
        {recyclingItemsState.map(item => (
          <div
            key={item.id}
            className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-4xl cursor-grab active:cursor-grabbing transform transition-transform duration-100 hover:scale-105"
            draggable
            onDragStart={(e) => handleRecyclingDragStart(e, item)}
          >
            {item.emoji}
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-semibold text-muted-foreground">{recyclingGameMessage}</p>
      
      {/* Updated drop zone layout: two columns */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {["Plastic", "Paper", "Glass", "Metal", "Compost"].map(bin => (
          <div
            key={bin}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleRecyclingDrop(e, bin.toLowerCase())}
          >
            <img
              src={`https://placehold.co/40x40/ddd/000?text=${bin.charAt(0)}`}
              alt={`${bin} Bin`}
              className="w-10 h-10"
            />
            <span className="text-sm font-medium">{bin}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const CarbonGame = () => {
    const currentScenario = carbonScenarios[carbonGameStep];
    const isGameFinished = carbonGameStep >= carbonScenarios.length;
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-center mb-2">Carbon Footprint Calculator</h3>
        {!isGameFinished ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge>Question {carbonGameStep + 1} of {carbonScenarios.length}</Badge>
              <Progress value={(carbonGameStep / carbonScenarios.length) * 100} className="w-1/2 h-2" />
            </div>
            <p className="font-medium text-center">{currentScenario.question}</p>
            <div className="grid grid-cols-1 gap-2">
              {currentScenario.options.map(option => (
                <Button
                  key={option.text}
                  variant="outline"
                  className="w-full text-left justify-start whitespace-normal h-auto py-2"
                  onClick={() => handleCarbonChoice(option.points, option.carbonImpact)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h4 className="text-xl font-bold text-primary">Calculation Complete!</h4>
            <p className="text-sm">Based on your choices, you earned a score of <span className="text-lg font-bold text-primary">{carbonGameScore}</span> points.</p>
            <p className="text-sm text-muted-foreground">This reflects your estimated real-world carbon impact.</p>
            <Button onClick={() => setActiveActivityGame(null)} className="w-full">
              Finish
            </Button>
          </div>
        )}
      </div>
    );
  };
  
  const ActivitiesTabContent = () => {
    if (activeActivityGame === 'recycling') {
      return <RecyclingGame />;
    }
    if (activeActivityGame === 'carbon') {
      return <CarbonGame />;
    }
    if (activeActivityGame === 'supply_chain') {
      return <SupplyChainOptimizerGame />;
    }
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-center mb-2">Select an Activity</h3>
        <Button onClick={startRecyclingGame} className="w-full h-auto py-4 flex flex-col items-center">
          <Recycle className="h-6 w-6 mb-2" />
          Recycling Sorting Game
          <span className="text-xs font-normal text-white/80">Time-based sorting challenge</span>
        </Button>
        <Button onClick={startCarbonGame} className="w-full h-auto py-4 flex flex-col items-center">
          <Footprints className="h-6 w-6 mb-2" />
          Carbon Footprint Calculator
          <span className="text-xs font-normal text-white/80">Interactive scenarios showing real-world impact</span>
        </Button>
        <Button onClick={() => setActiveActivityGame('supply_chain')} className="w-full h-auto py-4 flex flex-col items-center">
          <GitGraph className="h-6 w-6 mb-2" />
          Supply Chain Optimizer
          <span className="text-xs font-normal text-white/80">Route planning game for sustainable transport</span>
        </Button>
      </div>
    );
  };

  const InsightsTabContent = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-center mb-4">Your Environmental Impact</h3>
      <div className="space-y-6">
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-sm mb-2 text-primary">
            <TrendingUp className="h-4 w-4" /> Sustainability Trends
          </h4>
          <p className="text-xs text-muted-foreground mb-4">
            Track your energy savings, CO₂ reduction, and recycling rate over time.
          </p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={environmentalHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2d3748", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#e5e7eb" }}
                />
                <Line type="monotone" dataKey="energySaved" stroke="#10b981" name="Energy Saved (kWh)" dot={{ strokeWidth: 2 }} />
                <Line type="monotone" dataKey="co2Reduced" stroke="#3b82f6" name="CO₂ Reduced (%)" dot={{ strokeWidth: 2 }} />
                <Line type="monotone" dataKey="recyclingRate" stroke="#f59e0b" name="Recycling Rate (%)" dot={{ strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-sm mb-2 text-green-500">
            <BarChart3 className="h-4 w-4" /> At a Glance
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <Card className="p-3 bg-muted/50">
              <CardTitle className="text-sm text-muted-foreground">CO₂ Reduction</CardTitle>
              <CardContent className="p-0 mt-1 text-lg font-bold text-green-600">
                {co2Reduction}%
              </CardContent>
            </Card>
            <Card className="p-3 bg-muted/50">
              <CardTitle className="text-sm text-muted-foreground">Recycling Rate</CardTitle>
              <CardContent className="p-0 mt-1 text-lg font-bold text-blue-600">
                {recyclingRate}%
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
  
  const CharacterAvatar = () => (
    <div className="flex flex-col items-center gap-2">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-400">
            <img src={selectedAvatar.image_url} alt={selectedAvatar.name} className="w-full h-full object-cover" />
        </div>
        <p className="text-sm font-semibold text-white">{selectedAvatar.name}</p>
    </div>
  );

  return (
    <div 
        className="min-h-screen transition-all duration-1000 relative" 
        style={{ 
            backgroundImage: `url('${getEnvironmentBackgroundUrl(sustainabilityScore)}')`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat',
        }}
    >
      {/* Dynamic Pop-up Message Box */}
      {messageBox.isVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-6 text-center max-w-sm w-full animate-in fade-in-0 zoom-in-95">
                  <h3 className="text-lg font-semibold text-primary mb-2">{messageBox.title}</h3>
                  <p className="text-sm text-muted-foreground">{messageBox.text}</p>
              </div>
          </div>
      )}
      {showConfetti && (
        <Confetti show={showConfetti} width={width} height={height} />
      )}
      {levelUpMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl text-center transform transition-all duration-300 animate-in fade-in-0 zoom-in-95">
            <div className="flex justify-center mb-2">
              <Trophy className="h-10 w-10 text-yellow-500 animate-bounce-in" />
            </div>
            <h2 className="text-xl font-bold text-green-600 mb-1">{levelUpMessage}</h2>
            <p className="text-sm text-gray-600">You're making a real difference!</p>
          </div>
        </div>
      )}
      <div className="max-w-sm mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Factory className="h-8 w-8 text-white drop-shadow-lg" />
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">TerraForm</h1>
          </div>
          <p className="text-white/90 text-sm">Build a sustainable future</p>
          <div className="mt-4">
            <CharacterAvatar />
          </div>
        </div>

        {/* Sustainability Score & Level Progression */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg transition-all duration-300">
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
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-sm">Level: {currentLevel.name}</span>
                </div>
                {nextLevel && (
                  <span className="text-xs text-muted-foreground">
                    Next: {nextLevel.name} ({nextLevel.scoreThreshold}%)
                  </span>
                )}
              </div>
              <Progress value={nextLevelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Factory Stages */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Factory className="h-5 w-5 text-green-600" />
              Factory Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Remaining Actions</span>
                <span>{remainingActions}/{totalActions}</span>
              </div>
              <Progress value={(remainingActions / totalActions) * 100} className="h-3" />
            </div>
            <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="packaging">Packaging</TabsTrigger>
                <TabsTrigger value="transport">Transport</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
              </TabsList>
              {Object.keys(stageOptions).map((stage) => (
                <TabsContent key={stage} value={stage} className="space-y-4 mt-4">
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
                          src="https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyNWpjd3ZnNWJ3bDhhMjU1YmJuOGRhZmdpbDQybDY3YWhtNng1Y3QzdCZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/3o7bu9i039LhWBXH1u/giphy.gif"
                          alt="Retail Animation"
                          className="w-24 h-24"
                        />
                      )}
                      <CardTitle className="text-lg">{stage.charAt(0).toUpperCase() + stage.slice(1)} Stage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {stageOptions[stage].map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className="h-auto w-full flex flex-col gap-1 py-4"
                          onClick={() => {
                            const co2 = option.sustainable ? 10 : 0;
                            const recycling = option.sustainable ? 10 : 0;
                            handleDecision(co2, recycling, option.actionCost);
                          }}
                          disabled={remainingActions < option.actionCost}
                        >
                          {option.icon}
                          <span className="text-sm font-medium text-center">{option.text}</span>
                          <Badge variant="secondary" className="text-xs font-normal">
                            Cost: {option.actionCost} Actions
                          </Badge>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
                
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Game & Personal Progress Tabbed Section */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Progress & Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="progress">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="activities">
                  <Trophy className="h-4 w-4 mr-2" />
                  Activities
                </TabsTrigger>
                <TabsTrigger value="insights">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Insights
                </TabsTrigger>
              </TabsList>
              <TabsContent value="progress" className="space-y-4 mt-4">
                {/* Personal Actions Tracker */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-1 text-primary mb-2">
                    <List className="h-4 w-4" /> Your To-Do's ({completedActions}/{totalActions})
                  </h3>
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
                </div>
                <div className="h-px bg-gray-200 my-4" />
                {/* Daily Challenge & Streak Tracker */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-1 text-orange-500 mb-2">
                    <Flame className="h-4 w-4" /> Daily Challenge
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${dailyChallenge.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {dailyChallenge.text}
                    </span>
                    <Button onClick={() => handleDailyChallenge(dailyChallenge.text)} disabled={dailyChallenge.completed}>
                      {dailyChallenge.completed ? "Completed!" : "Complete"}
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Daily Streak:</span>
                    <span className="text-base font-bold text-orange-500">{dailyStreak} 🔥</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activities" className="mt-4">
                <ActivitiesTabContent />
              </TabsContent>
              <TabsContent value="insights" className="mt-4">
                <InsightsTabContent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


        {/* Community Collaboration Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-500" />
              Community Collaboration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-blue-500">
                <List className="h-4 w-4" /> Global Leaderboard
              </h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {leaderboard.map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        user.isUser ? "bg-primary/10 font-bold" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{user.rank}.</span>
                        <span className="text-sm">{user.name}</span>
                      </div>
                      <span className="text-sm">{user.score} pts</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" className="w-full">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Your Score
                </Button>
              </div>
            </div>
            <div className="h-px bg-gray-200 my-4" />
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-orange-500">
                <Flame className="h-4 w-4" /> Team Challenges
              </h3>
              <div className="space-y-4">
                {teamChallengesData.map((challenge) => (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{challenge.name}</span>
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        {challenge.progress}% Complete
                      </Badge>
                    </div>
                    <Progress value={challenge.progress} className="h-3" />
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-px bg-gray-200 my-4" />
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1 text-green-500">
                <Leaf className="h-4 w-4" /> Eco-Communities
              </h3>
              <div className="space-y-2">
                {ecoCommunitiesData.map((community) => (
                  <div key={community.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">{community.name}</span>
                      <Badge variant="secondary">{community.members} Members</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{community.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unlocked Badges */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unlockedBadges.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No achievements yet. Keep going!</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {unlockedBadges.map((badge) => (
                  <div key={badge.id} className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 text-green-600">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <div>
                      <span className="text-sm font-semibold">{badge.name}</span>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Character Creator Section */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-gray-500" />
              Select Your Eco-Warrior
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {avatars.map(avatar => (
                <div 
                  key={avatar.id}
                  className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    selectedAvatar.id === avatar.id ? 'bg-primary/10 border-2 border-primary' : 'border-2 border-transparent'
                  }`}
                  onClick={() => setSelectedAvatar(avatar)}
                >
                  <img 
                    src={avatar.image_url} 
                    alt={avatar.name} 
                    className="w-16 h-16 rounded-full object-cover mb-1" 
                  />
                  <p className="text-xs text-center font-medium">{avatar.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* AI Advisor */}
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
      </div>
    </div>
  );
}
