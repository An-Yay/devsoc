// source/app.tsx
import React, { useState } from "react";
import { Box } from "ink";
import { useFeatureState } from "./hooks/useFeatureState.js";
import MainMenu from "./components/common/MainMenu.js";
import TextCommandMode from "./components/text/TextCommandMode.js";
import VoiceCommandMode from "./components/voice/VoiceCommandMode.js";
import HelpMode from "./components/common/HelpPanel.js";
import NotDiamondRequest from "./components/common/NotDiamondRequest.js";

const App = () => {
  const { feature, setFeature } = useFeatureState();
  const [transcribedText, setTranscribedText] = useState<string | null>(null);

  const handleRecordingComplete = (transcript: string) => {
    console.log(`Transcript: ${transcript}`);
    setTranscribedText(transcript);
  };

  const handleScriptGeneration = (output: string) => {
    console.log("Script generation completed:", output);
    setTranscribedText(null);
    setFeature(null);
  };

  switch (feature?.value) {
    case "text-command":
      return <TextCommandMode />;
    case "voice-command":
      return transcribedText ? (
        <NotDiamondRequest query={transcribedText} onComplete={handleScriptGeneration} />
      ) : (
        <VoiceCommandMode onRecordingComplete={handleRecordingComplete} />
      );
    case "help":
      return <HelpMode onBack={() => setFeature(null)} />;
    default:
      return (
        <Box flexDirection="column" padding={1}>
          <MainMenu onSelect={setFeature} />
        </Box>
      );
  }
};

export default App;