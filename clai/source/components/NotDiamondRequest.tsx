// source/components/NotDiamondRequest.tsx
import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import Spinner from "ink-spinner";
import { NotDiamond } from 'notdiamond';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();
const notDiamond = new NotDiamond();

type NotDiamondRequestProps = {
  query: string;
  onComplete: (output: string) => void;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const NotDiamondRequest = ({ query, onComplete }: NotDiamondRequestProps) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleNotDiamondRequest = async () => {
    try {
      const result = await notDiamond.create({
        messages: [
          { role: 'system', content: 'You are a world class programmer.' },
          { role: 'user', content: query },
        ],
        llmProviders: [
          { provider: 'google', model: 'gemini-1.0-pro-latest'}
        ],
      });

      let outputContent = "";
      if (result) {
        if ('detail' in result) {
          throw new Error(`API Error: ${result.detail}`);
        } else {
          outputContent = result.content;
        }
      } else {
        throw new Error("No result received from Not Diamond API");
      }

      const filename = `output_${Date.now()}.txt`;
      const outputPath = path.join(process.cwd(), 'clai_history', filename);

      await fs.mkdir(path.join(process.cwd(), 'clai_history'), { recursive: true });
      await fs.writeFile(outputPath, outputContent, 'utf8');

      const successMessage = `Generation complete! Output saved to: ${outputPath}`;
      setOutput(successMessage);
      setIsLoading(false);
      onComplete(successMessage);
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prevCount => prevCount + 1);
        setOutput(`Attempt ${retryCount + 1} failed. Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await delay(RETRY_DELAY);
      } else {
        const errorMessage = `Error: ${error instanceof Error ? error.message : String(error)}\nMax retries reached. Please try again later.`;
        setOutput(errorMessage);
        setIsLoading(false);
        onComplete(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (query) {
      handleNotDiamondRequest();
    }
  }, [query, retryCount]);

  return (
    <Box flexDirection="column">
      {isLoading ? (
        <Box>
          <Text>
            <Spinner type="dots" />
            {retryCount > 0 ? ` Retrying (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})...` : " Generating..."}
          </Text>
        </Box>
      ) : (
        <Text>{output}</Text>
      )}
    </Box>
  );
};

export default NotDiamondRequest;