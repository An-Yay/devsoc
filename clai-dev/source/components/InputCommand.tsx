import React, { useState } from 'react';
import { render, Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import GenerateAndSave from './generateAndSave.js';

const SearchQuery = () => {
      const [query, setQuery] = useState('');

      const handleSubmit = () => {
            // Render the GenerateAndSave component with the query as a prop
            render(<GenerateAndSave text={query} />);
      };

      return (
            <Box>
                  <Box marginRight={1}>
                        <Text>Enter your query:</Text>
                  </Box>
                  <TextInput value={query} onChange={setQuery} onSubmit={handleSubmit} />
            </Box>
      );
};
