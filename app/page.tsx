import ContextWindowVisualizer from "@/components/context-window-visualizer"

export default function Home() {
  return (
    <main className="bg-[#0a0a0a] text-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-500">
            AI Context Window Visualizer
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            Click a scenario to see how an AI agent's memory fills up. Use the settings gear to adjust token amounts.
          </p>
        </header>
        <ContextWindowVisualizer />
      </div>
    </main>
  )
}
