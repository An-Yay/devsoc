import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";
import { NotDiamond } from 'notdiamond';
import dotenv from 'dotenv';
dotenv.config();

const notDiamond = new NotDiamond();

type NotDiamondRequestProps = {
  query: string;
  onComplete: () => void;
};

const NotDiamondRequest = ({ query, onComplete }: NotDiamondRequestProps) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleNotDiamondRequest = async () => {
      try {
        const result = await notDiamond.create({
          messages: [
            { role: 'system', content: 'You are a world class programmer.' },
            { role: 'user', content: query },
          ],
          llmProviders: [
            // { provider: 'openai', model: 'gpt-4o' },
            // { provider: 'openai', model: 'gpt-4o-mini' },
            // { provider: 'anthropic', model: 'claude-3-5-sonnet-20240620' },
            { provider: 'google', model: 'gemini-1.0-pro-latest'}
          ],
        });

        if (result) {
          if ('detail' in result) {
            setOutput(`Error: ${result.detail}`);
          } else {
            setOutput(result.content);
          }
        } else {
          setOutput("No result received from Not Diamond API");
        }
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
        onComplete();
      }
    };

    if (query) {
      handleNotDiamondRequest();
    }
  }, [query, onComplete]);

  return (
    <Box flexDirection="column">
      {isLoading ? (
        <Box>
          <Text>
            <Spinner type="dots" />
            {" Generating..."}
          </Text>
        </Box>
      ) : (
        <Text>{output}</Text>
      )}
    </Box>
  );
};

export default NotDiamondRequest;