import type { SegmentType } from "./types"

export interface ScenarioStep {
  type: SegmentType
  tokens: number
  delay: number
}

export interface Scenario {
  name: string
  description: string
  steps: ScenarioStep[]
}

export const scenarios: Scenario[] = [
  {
    name: "Simple Query",
    description: "A basic request using one tool. (~25% full)",
    steps: [
      { type: "userInput", tokens: 5000, delay: 400 },
      { type: "agentThinking", tokens: 10000, delay: 600 },
      { type: "toolCalls", tokens: 5000, delay: 500 },
      { type: "agentThinking", tokens: 10000, delay: 600 },
      { type: "codeOutput", tokens: 20000, delay: 400 },
    ],
  },
  {
    name: "Code Generation",
    description: "Generate code, then refactor it. (~55% full)",
    steps: [
      // First request
      { type: "userInput", tokens: 8000, delay: 400 },
      { type: "agentThinking", tokens: 12000, delay: 600 },
      { type: "codeOutput", tokens: 30000, delay: 500 },
      // Follow-up request
      { type: "userInput", tokens: 5000, delay: 400 },
      { type: "agentThinking", tokens: 15000, delay: 600 },
      { type: "codeOutput", tokens: 40000, delay: 500 },
    ],
  },
  {
    name: "Complex Debugging",
    description: "Analyze a large file and fix a bug. (~75% full)",
    steps: [
      { type: "userInput", tokens: 15000, delay: 400 },
      { type: "agentThinking", tokens: 20000, delay: 600 },
      { type: "toolCalls", tokens: 50000, delay: 800 }, // "Reading" a large file
      { type: "agentThinking", tokens: 25000, delay: 600 },
      { type: "codeOutput", tokens: 40000, delay: 500 },
    ],
  },
]
