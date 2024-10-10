import React, { useState } from "react";
import { Box, Text } from "ink";
import Select from "ink-select-input";
import SearchQuery from "./components/SearchQuery.js";
import { Alert, StatusMessage } from "@inkjs/ui";

interface Feature {
  value: string;
}

const App = () => {
  const [feature, setFeature] = useState<Feature | null>(null);

  if (feature?.value === "text-command") {
    return (
      <SearchQuery
        onSubmit={(query: string) => {
          console.log("User query:", query);
        }}
      />
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