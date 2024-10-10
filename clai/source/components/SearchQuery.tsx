import React, { useState } from "react";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import NotDiamondRequest from './NotDiamondRequest.js';

type SearchQueryProps = {
  onSubmit: (query: string) => void;
};

const SearchQuery = ({ onSubmit }: SearchQueryProps) => {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
      setSubmittedQuery(query);
      setQuery("");
      setIsGenerating(true);
    }
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
  };

  if (isGenerating) {
    return <NotDiamondRequest query={submittedQuery} onComplete={handleGenerationComplete} />;
  }

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
};

export default SearchQuery;