"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Settings, RotateCcw } from "lucide-react"

import type { Scenario } from "@/lib/scenarios"

interface ScenarioControlsProps {
  scenarios: Scenario[]
  onRunScenario: (scenario: Scenario) => void
  onReset: () => void
  isSimulating: boolean
  showAdvanced: boolean
  onToggleAdvanced: () => void
  scenarioSettings: Record<string, { multiplier: number }>
  onUpdateScenarioSettings: (settings: Record<string, { multiplier: number }>) => void
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
    const multiplier = Number.parseFloat(value)
    if (!isNaN(multiplier) && multiplier >= 0.1 && multiplier <= 2.0) {
      onUpdateScenarioSettings({
        ...scenarioSettings,
        [scenarioName]: { multiplier },
      })
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700 text-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-100">Run a Simulation</CardTitle>
            <CardDescription className="text-gray-400">Select a scenario to watch the agent work.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleAdvanced} className="text-gray-400 hover:text-gray-200">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="grow grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenarios.map((scenario) => {
              const multiplier = scenarioSettings[scenario.name]?.multiplier || 1.0
              const estimatedPercentage = Math.round(
                ((scenario.steps.reduce((acc, step) => acc + step.tokens, 0) * multiplier) / 200000) * 100,
              )

              return (
                <Button
                  key={scenario.name}
                  onClick={() => onRunScenario(scenario)}
                  disabled={isSimulating}
                  className="justify-start text-left h-auto py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-600"
                >
                  <div>
                    <p className="font-semibold text-white">{scenario.name}</p>
                    <p className="text-xs text-gray-400 font-normal">~{estimatedPercentage}% capacity</p>
                  </div>
                </Button>
              )
            })}
          </div>
          <Button
            onClick={onReset}
            disabled={isSimulating}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent sm:w-auto w-full"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        {showAdvanced && (
          <>
            <Separator className="bg-gray-700" />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-300">Advanced Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.name} className="space-y-2">
                    <label className="text-xs text-gray-400">{scenario.name} Multiplier</label>
                    <Input
                      type="number"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={scenarioSettings[scenario.name]?.multiplier || 1.0}
                      onChange={(e) => handleMultiplierChange(scenario.name, e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white text-sm h-8"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Adjust multipliers to change scenario token usage (0.1x to 2.0x)</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
