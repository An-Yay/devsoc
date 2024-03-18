import React, { useState } from "react";
import { render, Box, Text } from "ink";
import TextInput from "ink-text-input";
import { useInput } from "ink";
import GenerateAndSave from "./components/generateAndSave.js";

type SearchQueryProps = {
      onSubmit: (query: string) => void;
};

const SearchQuery = ({ onSubmit }: SearchQueryProps) => {
      const [query, setQuery] = useState("");
      const [showOptions, setShowOptions] = useState(false);

      /* tslint:disable:no-unused-variable */
      useInput((input, key) => {
            if (key.return) {
                  setShowOptions(true);
            }
      });

      const _handleContinue = () => {
            onSubmit(query);
            setQuery("");
            setShowOptions(false);
      };

      const _handleExit = () => {
            process.exit();
      };
      const handleSubmit = () => {
            // Render the GenerateAndSave component with the query as a prop
            render(<GenerateAndSave text={query} />);
      };

      return (
            <Box flexDirection="column">
                  <Box>
                        <Text>Enter your query:</Text>
                  </Box>
                  <Box>
                        <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
                  </Box>
                  {showOptions && (
                        <Box marginTop={1}>
                              <Text>Press "c" to Continue, "e" to Exit</Text>
                        </Box>
                  )}
                  {showOptions && (
                        <Box>
                              <Text>[c] Continue</Text>
                              <Text>[e] Exit</Text>
                        </Box>
                  )}
            </Box>
      );
};

export default SearchQuery;
