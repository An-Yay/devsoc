// source/components/SearchQuery.tsx
import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import Select from "ink-select-input";
import NotDiamondRequest from './NotDiamondRequest.js';

type SearchQueryProps = {
  onSubmit: (query: string) => void;
};

const SearchQuery = ({ onSubmit }: SearchQueryProps) => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [continuationChoice, setContinuationChoice] = useState<string | null>(null);
  const [outputMessage, setOutputMessage] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
      setSubmittedQuery(query);
      setQuery("");
      setIsGenerating(true);
      setIsComplete(false);
      setContinuationChoice(null);
      setOutputMessage("");
    }
  };

  const handleGenerationComplete = (output: string) => {
    setIsGenerating(false);
    setIsComplete(true);
    setOutputMessage(output);
  };

  const handleContinuationChoice = (choice: { value: string }) => {
    setContinuationChoice(choice.value);
    if (choice.value === 'yes') {
      setIsComplete(false);
      setOutputMessage("");
    }
  };

  if (isGenerating) {
    return <NotDiamondRequest query={submittedQuery} onComplete={handleGenerationComplete} />;
  }

  if (isComplete) {
    return (
      <Box flexDirection="column">
        <Text>{outputMessage}</Text>
        <Text>Would you like to continue?</Text>
        <Select
          items={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          onSelect={handleContinuationChoice}
        />
      </Box>
    );
  }

  if (continuationChoice === 'no') {
    return (
      <Box flexDirection="column">
        <Text>{outputMessage}</Text>
        <Text>Thank you for using the CLI app. Goodbye!</Text>
      </Box>
    );
  }
  else {
    return (
      <Box flexDirection="column">
        <Box>
          <Text>Enter your query:</Text>
        </Box>
        <Box>
          <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
        </Box>
      </Box>
    );
  }

};

export default SearchQuery;