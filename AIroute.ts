// code not currently in use

import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, userProgress } = await request.json()

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    if (!process.env.XAI_API_KEY) {
      console.error("[v0] XAI_API_KEY environment variable is missing")
      return new Response("AI service not configured", { status: 500 })
    }

    const systemPrompt = `You are Grok, a helpful and witty AI assistant created by xAI, serving as a sustainability advisor for EcoFactory. 

User's current progress:
- Sustainability Score: ${userProgress.sustainabilityScore}%
- Completed Personal Actions: ${userProgress.completedActions}/${userProgress.totalActions}
- CO₂ Reduction: ${userProgress.co2Reduction}%
- Recycling Rate: ${userProgress.recyclingRate}%
- Energy Saved: ${userProgress.completedActions * 8}%

Provide helpful, encouraging, and specific sustainability advice. Keep responses concise (2-3 sentences) and actionable. Reference their current progress when relevant. Focus on practical tips for energy saving, waste reduction, transportation, and sustainable living.`

    console.log("[v0] Sending request to xAI with user progress:", userProgress)

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: message,
      system: systemPrompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return new Response("Failed to generate response", { status: 500 })
  }
}
