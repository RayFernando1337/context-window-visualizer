"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Settings } from "lucide-react";

import type { Scenario } from "@/lib/scenarios";

interface ScenarioControlsProps {
  scenarios: Scenario[];
  onRunScenario: (scenario: Scenario) => void;
  onReset: () => void;
  isSimulating: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
  scenarioSettings: Record<string, { multiplier: number }>;
  onUpdateScenarioSettings: (settings: Record<string, { multiplier: number }>) => void;
}

export default function ScenarioControls({
  scenarios,
  onRunScenario,
  onReset,
  isSimulating,
  showAdvanced,
  onToggleAdvanced,
  scenarioSettings,
  onUpdateScenarioSettings,
}: ScenarioControlsProps) {
  const handleMultiplierChange = (scenarioName: string, value: string) => {
    const multiplier = Number.parseFloat(value);
    if (!isNaN(multiplier) && multiplier >= 0.1 && multiplier <= 2.0) {
      onUpdateScenarioSettings({
        ...scenarioSettings,
        [scenarioName]: { multiplier },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Run a Simulation</CardTitle>
            <CardDescription>Select a scenario to watch the agent work.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleAdvanced}>
            <Settings className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grow grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarios.map((scenario) => {
              const multiplier = scenarioSettings[scenario.name]?.multiplier || 1.0;
              const estimatedPercentage = Math.round(
                ((scenario.steps.reduce((acc, step) => acc + step.tokens, 0) * multiplier) /
                  200000) *
                  100
              );

              return (
                <Button
                  key={scenario.name}
                  onClick={() => onRunScenario(scenario)}
                  disabled={isSimulating}
                  variant="secondary"
                  className="justify-start text-left h-auto py-3 px-4"
                >
                  <div>
                    <p className="font-semibold">{scenario.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">
                      ~{estimatedPercentage}% capacity
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
          <Button
            onClick={onReset}
            disabled={isSimulating}
            variant="outline"
            className="sm:w-auto w-full"
          >
            <RotateCcw className="mr-2 size-4" /> Reset
          </Button>
        </div>

        {showAdvanced && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Advanced Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.name} className="space-y-2">
                    <label className="text-xs text-muted-foreground">
                      {scenario.name} Multiplier
                    </label>
                    <Input
                      type="number"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={scenarioSettings[scenario.name]?.multiplier || 1.0}
                      onChange={(e) => handleMultiplierChange(scenario.name, e.target.value)}
                      className="text-sm h-8"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Adjust multipliers to change scenario token usage (0.1x to 2.0x)
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
