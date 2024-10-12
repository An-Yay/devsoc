// source/app.tsx
import React from "react";
import { Box } from "ink";
import { useFeatureState } from "./hooks/useFeatureState.js";
import MainMenu from "./components/MainMenu.js";
import TextCommandMode from "./components/text/TextCommandMode.js";
import VoiceCommandMode from "./components/voice/VoiceCommandMode.js";
import HelpMode from "./components/HelpMode.js";

const App = () => {
  const { feature, setFeature } = useFeatureState();

  const handleRecordingComplete = (transcript: string) => {
    console.log(`Transcription completed.\nTranscript: ${transcript}`);
    setFeature(null);
  };

  switch (feature?.value) {
    case "text-command":
      return <TextCommandMode />;
    case "voice-command":
      return <VoiceCommandMode onRecordingComplete={handleRecordingComplete} />;
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