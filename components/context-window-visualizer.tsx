"use client";

import { Button } from "@/components/ui/button";
import type { Scenario } from "@/lib/scenarios";
import { scenarios } from "@/lib/scenarios";
import type { Agent, Segment, SegmentType } from "@/lib/types";
import { Bot } from "lucide-react";
import { useState } from "react";
import AgentBar from "./agent-bar";
import ScenarioControls from "./scenario-controls";

const SEGMENT_CONFIG = {
  userInput: { color: "bg-segment-user", label: "User Input" },
  agentThinking: { color: "bg-segment-thinking", label: "Agent Thinking" },
  toolCalls: { color: "bg-segment-tools", label: "Tool Calls" },
  codeOutput: { color: "bg-segment-code", label: "Code Output" },
};

const DEFAULT_TOKEN_SIZES = {
  userInput: 2000,
  agentThinking: 8000,
  toolCalls: 2000,
  codeOutput: 8000,
};

const INITIAL_AGENTS: Agent[] = [
  {
    id: "main-agent",
    name: "Main Agent",
    segments: [],
    totalTokens: 200000,
  },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ContextWindowVisualizer() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scenarioSettings, setScenarioSettings] = useState<Record<string, { multiplier: number }>>({
    "Simple Query": { multiplier: 0.4 },
    "Code Generation": { multiplier: 0.8 },
    "Complex Debugging": { multiplier: 1.0 },
  });

  const addSegmentToAgent = (agentId: string, segment: Segment) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => {
        if (agent.id === agentId) {
          const usedTokens = agent.segments.reduce((acc, seg) => acc + seg.tokens, 0);
          if (usedTokens + segment.tokens > agent.totalTokens) {
            return agent;
          }
          return { ...agent, segments: [...agent.segments, segment] };
        }
        return agent;
      })
    );
  };

  const handleAddSegment = (agentId: string, type: SegmentType) => {
    const newSegment: Segment = {
      id: crypto.randomUUID(),
      type,
      tokens: DEFAULT_TOKEN_SIZES[type],
    };
    addSegmentToAgent(agentId, newSegment);
  };

  const handleRemoveSegment = (agentId: string, segmentId: string) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            segments: agent.segments.filter((seg) => seg.id !== segmentId),
          };
        }
        return agent;
      })
    );
  };

  const handleReorderSegments = (agentId: string, fromIndex: number, toIndex: number) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => {
        if (agent.id === agentId) {
          const newSegments = [...agent.segments];
          const [movedSegment] = newSegments.splice(fromIndex, 1);
          newSegments.splice(toIndex, 0, movedSegment);
          return { ...agent, segments: newSegments };
        }
        return agent;
      })
    );
  };

  const runScenario = async (scenario: Scenario) => {
    setIsSimulating(true);
    setAgents((prev) => [INITIAL_AGENTS[0], ...prev.slice(1)]);
    await sleep(300);

    const multiplier = scenarioSettings[scenario.name]?.multiplier || 1.0;

    for (const step of scenario.steps) {
      addSegmentToAgent("main-agent", {
        id: crypto.randomUUID(),
        type: step.type,
        tokens: Math.floor(step.tokens * multiplier),
      });
      await sleep(step.delay);
    }
    setIsSimulating(false);
  };

  const addRequestToSubAgent = (agentId: string) => {
    const genericRequest: Scenario = scenarios[0];

    const run = async () => {
      setIsSimulating(true);
      for (const step of genericRequest.steps) {
        addSegmentToAgent(agentId, {
          id: crypto.randomUUID(),
          type: step.type,
          tokens: Math.floor(step.tokens * 0.5),
        });
        await sleep(step.delay);
      }
      setIsSimulating(false);
    };
    run();
  };

  const spawnSubAgent = () => {
    setAgents((prevAgents) => [
      ...prevAgents,
      {
        id: `sub-agent-${prevAgents.length}`,
        name: `Sub-Agent ${prevAgents.length}`,
        segments: [],
        totalTokens: 200000,
      },
    ]);
  };

  const resetAll = () => {
    setAgents(INITIAL_AGENTS);
  };

  return (
    <div className="space-y-6">
      <ScenarioControls
        scenarios={scenarios}
        onRunScenario={runScenario}
        onReset={resetAll}
        isSimulating={isSimulating}
        showAdvanced={showAdvanced}
        onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
        scenarioSettings={scenarioSettings}
        onUpdateScenarioSettings={setScenarioSettings}
      />

      <div className="space-y-4">
        {agents.map((agent) => (
          <AgentBar
            key={agent.id}
            agent={agent}
            onAddRequest={addRequestToSubAgent}
            onAddSegment={handleAddSegment}
            onRemoveSegment={handleRemoveSegment}
            onReorderSegments={handleReorderSegments}
            segmentConfig={SEGMENT_CONFIG}
            isSimulating={isSimulating}
          />
        ))}
      </div>

      <div className="text-center">
        <Button onClick={spawnSubAgent} variant="outline" disabled={isSimulating}>
          <Bot className="mr-2 size-4" /> Spawn Sub-Agent
        </Button>
      </div>
    </div>
  );
}
