"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Agent, SegmentType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlusCircle, X } from "lucide-react";
import { useState } from "react";

interface AgentBarProps {
  agent: Agent;
  onAddRequest: (agentId: string) => void;
  onAddSegment: (agentId: string, type: SegmentType) => void;
  onRemoveSegment: (agentId: string, segmentId: string) => void;
  onReorderSegments: (agentId: string, fromIndex: number, toIndex: number) => void;
  segmentConfig: Record<SegmentType, { color: string; label: string }>;
  isSimulating: boolean;
}

const DEFAULT_TOKEN_SIZES = {
  userInput: 2000,
  agentThinking: 8000,
  toolCalls: 2000,
  codeOutput: 8000,
};

export default function AgentBar({
  agent,
  onAddRequest,
  onAddSegment,
  onRemoveSegment,
  onReorderSegments,
  segmentConfig,
  isSimulating,
}: AgentBarProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const usedTokens = agent.segments.reduce((acc, seg) => acc + seg.tokens, 0);
  const percentage = (usedTokens / agent.totalTokens) * 100;

  const barColorClass =
    percentage >= 80
      ? "bg-status-danger/10 border-status-danger/50"
      : percentage >= 50
      ? "bg-status-warning/10 border-status-warning/50"
      : "bg-card border-border";

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderSegments(agent.id, draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleLegendClick = (type: SegmentType) => {
    if (!isSimulating) {
      onAddSegment(agent.id, type);
    }
  };

  const handleRemoveSegment = (e: React.MouseEvent, segmentId: string) => {
    e.stopPropagation();
    onRemoveSegment(agent.id, segmentId);
  };

  return (
    <Card className={cn("transition-all", barColorClass)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-bold">{agent.name}</CardTitle>
          <CardDescription
            className={cn(
              "text-sm",
              percentage >= 80
                ? "text-status-danger"
                : percentage >= 50
                ? "text-status-warning"
                : "text-muted-foreground"
            )}
          >
            Context Window: 200,000 Tokens
          </CardDescription>
        </div>
        {agent.id !== "main-agent" && (
          <Button size="sm" onClick={() => onAddRequest(agent.id)} disabled={isSimulating}>
            <PlusCircle className="mr-2 size-4" /> Add Request
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold">
            {usedTokens.toLocaleString()}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / {agent.totalTokens.toLocaleString()}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "text-lg font-mono",
              percentage >= 80
                ? "bg-status-danger text-white"
                : percentage >= 50
                ? "bg-status-warning text-foreground"
                : ""
            )}
          >
            {percentage.toFixed(2)}%
          </Badge>
        </div>

        {/* Interactive Progress Bar */}
        <div className="w-full bg-muted rounded-full h-8 flex overflow-hidden border border-border relative">
          {agent.segments.map((segment, index) => (
            <div
              key={segment.id}
              draggable={!isSimulating}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "h-full transition-all duration-300 ease-in-out relative group cursor-move flex items-center justify-center",
                segmentConfig[segment.type].color,
                dragOverIndex === index && "ring-2 ring-primary ring-inset",
                draggedIndex === index && "opacity-50",
                !isSimulating && "hover:brightness-110"
              )}
              style={{ width: `${(segment.tokens / agent.totalTokens) * 100}%` }}
              title={`${
                segmentConfig[segment.type].label
              }: ${segment.tokens.toLocaleString()} tokens`}
            >
              {/* Remove button - only show on hover and if segment is wide enough */}
              {!isSimulating && segment.tokens / agent.totalTokens > 0.05 && (
                <button
                  onClick={(e) => handleRemoveSegment(e, segment.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-0.5 hover:bg-black/70"
                >
                  <X className="size-3 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          {Object.entries(segmentConfig).map(([type, config]) => {
            const total = agent.segments
              .filter((s) => s.type === type)
              .reduce((acc, s) => acc + s.tokens, 0);

            return (
              <button
                key={type}
                onClick={() => handleLegendClick(type as SegmentType)}
                disabled={isSimulating}
                className={cn(
                  "flex items-center text-sm transition-all",
                  isSimulating
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-muted-foreground hover:text-foreground cursor-pointer hover:scale-105"
                )}
                title={`Click to add ${config.label} (${DEFAULT_TOKEN_SIZES[
                  type as SegmentType
                ].toLocaleString()} tokens)`}
              >
                <div className={cn("size-3 rounded-sm mr-2", config.color)} />
                <span>{config.label}:</span>
                <span className="font-mono font-semibold ml-2 text-foreground">
                  {total > 0 ? total.toLocaleString() : "0"}
                </span>
              </button>
            );
          })}
        </div>

        {!isSimulating && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 Click legend items to add segments • Drag segments to reorder • Hover segments to
            remove
          </p>
        )}
      </CardContent>
    </Card>
  );
}
