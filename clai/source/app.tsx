// source/app.tsx

import React, { useState } from "react";
import { Box, Text } from "ink";
import Select from "ink-select-input";
import SearchQuery from "./components/SearchQuery.js";

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
    <Box flexDirection="column">
      <Text>CLAI</Text>
      <Text>Choose an option:</Text>
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