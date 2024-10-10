import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";
import { NotDiamond } from 'notdiamond';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import { Spinner, ConfirmInput, Alert, StatusMessage, UnorderedList } from '@inkjs/ui';

const execPromise = util.promisify(exec);

dotenv.config();
const notDiamond = new NotDiamond();

type NotDiamondRequestProps = {
  query: string;
  onComplete: (output: string) => void;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const DANGEROUS_PATTERNS = [
  /\brm\b/, /\brmdir\b/, /\bdd\b/, /\bmv\b/, /\bchmod\b/, /\bchown\b/, /\bsed\b.*-i/, /\b>>\b/, /\b>\b/,
];

const NotDiamondRequest = ({ query, onComplete }: NotDiamondRequestProps) => {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [scriptContent, setScriptContent] = useState("");
  const [isDangerous, setIsDangerous] = useState(false);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const checkForDangerousOperations = (script: string) => {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(script));
  };

  const handleNotDiamondRequest = async () => {
    try {
      const result = await notDiamond.create({
        messages: [
          { 
            role: 'system', 
            content: 'You are a bash script generator. Respond only with a valid bash script that accomplishes the task described. Do not include any explanations, comments, or markdown formatting. Start the script with #!/bin/bash and include only the necessary commands.'
          },
          { 
            role: 'user', 
            content: `Generate a bash script that does the following:\n\n${query}\n\nRemember, respond only with the bash script, no explanations or additional text.`
          },
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

      outputContent += `\n\n# User query: ${query}`;

      setScriptContent(outputContent);
      setIsDangerous(checkForDangerousOperations(outputContent));
      setWaitingForConfirmation(true);
      setIsLoading(false);
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

  const executeScript = async () => {
    const filename = `script_${Date.now()}.sh`;
    const outputPath = path.join(process.cwd(), 'clai_history', filename);

    await fs.mkdir(path.join(process.cwd(), 'clai_history'), { recursive: true });
    await fs.writeFile(outputPath, scriptContent, 'utf8');
    await fs.chmod(outputPath, '755');

    const { stdout, stderr } = await execPromise(`bash ${outputPath}`);

    const successMessage = `Bash script generated and saved to: ${outputPath}\n\nScript execution output:\n${stdout}\n${stderr ? `Errors:\n${stderr}` : ''}`;
    setOutput(successMessage);
    onComplete(successMessage);
  };

  useEffect(() => {
    if (query) {
      handleNotDiamondRequest();
    }
  }, [query, retryCount]);

  if (isLoading) {
    return <Spinner label="Generating bash script..." />;
  }

  if (waitingForConfirmation) {
    return (
      <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
        <StatusMessage variant="info">Generated Script:</StatusMessage>
        <Box marginY={1} paddingX={1} borderStyle="single" borderColor="gray">
          <Text>{scriptContent}</Text>
        </Box>
        {isDangerous ? (
          <Alert variant="warning">
            This script contains potentially dangerous operations. Please review carefully.
          </Alert>
        ) : null}
        <Text>Do you want to execute this script?</Text>
        <ConfirmInput
          onConfirm={executeScript}
          onCancel={() => {
            setOutput("Script execution cancelled by user.");
            onComplete("Script execution cancelled by user.");
            setWaitingForConfirmation(false);
          }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <StatusMessage variant="success">Execution Result:</StatusMessage>
      <UnorderedList>
        {output.split('\n').map((line, index) => (
          <UnorderedList.Item key={index}>
            <Text>{line}</Text>
          </UnorderedList.Item>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default NotDiamondRequest;