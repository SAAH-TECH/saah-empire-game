import React from "react";
import "./App.css";
import { GameProvider } from "./context/GameContext";
import GameScreen from "./components/GameScreen";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <GameProvider>
      <div className="App">
        <GameScreen />
        <Toaster />
      </div>
    </GameProvider>
  );
}

export default App;