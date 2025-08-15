export type SegmentType = "userInput" | "agentThinking" | "toolCalls" | "codeOutput"

export interface Segment {
  id: string
  type: SegmentType
  tokens: number
}

export interface Agent {
  id: string
  name: string
  segments: Segment[]
  totalTokens: number
}
