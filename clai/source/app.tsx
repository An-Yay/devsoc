import React, { useState } from "react";
import { Box, Text } from "ink";
import Select from "ink-select-input";
import SearchQuery from "./components/SearchQuery.js";
import VoiceRecorder from "./components/VoiceRecorder.js";
import { Alert, StatusMessage } from "@inkjs/ui";

interface Feature {
  value: string;
}

const App = () => {
  const [feature, setFeature] = useState<Feature | null>(null);

  const handleRecordingComplete = (transcript: string) => {
    console.log(`Transcription completed. Transcript: ${transcript}`);
    setFeature(null);
  };

  if (feature?.value === "text-command") {
    return (
      <SearchQuery
        onSubmit={(query: string) => {
          console.log("User query:", query);
        }}
      />
    );
  }

  if (feature?.value === "voice-command") {
    return (
      <Box flexDirection="column" padding={1}>
        <StatusMessage variant="info">
          Voice Command Mode
        </StatusMessage>
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
      </Box>
    );
  }

  if (feature?.value === "help") {
    return (
      <Box flexDirection="column" padding={1}>
        <StatusMessage variant="info">
          Help Information
        </StatusMessage>
        <Text>
          {`CLAI is your Command Line AI Assistant. You can use text or voice commands to interact with it.
          - Text Command: Type your query and press Enter.
          - Voice Command: Speak your query (limited to 10 seconds).
          - Help: Display this help information.
          - Exit: Close the application.`}
        </Text>
        <Box marginTop={1}>
          <Select
            items={[{ label: "Back to Main Menu", value: "back" }]}
            onSelect={() => setFeature(null)}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1} justifyContent="center">
        <Text color="cyan" bold>
          {`
   █▀▀ █░░ ▄▀█ █
   █▄▄ █▄▄ █▀█ █
          `}
        </Text>
      </Box>

      <StatusMessage variant="info">
        Welcome to CLAI - Your Command Line AI Assistant
      </StatusMessage>

      <Alert variant="info">
        Choose an option to get started
      </Alert>

      <Box marginBottom={1}>
        <Text bold>Available options:</Text>
      </Box>

      <Select
        items={[
          { label: "Text Command", value: "text-command" },
          { label: "Voice Command", value: "voice-command" },
          { label: "Help", value: "help" },
          { label: "Exit", value: "exit" },
        ]}
        onSelect={(item) => {
          setFeature(item);
          if (item.value === "exit") {
            process.exit();
          }
        }}
      />
    </Box>
  );
};

export default App;