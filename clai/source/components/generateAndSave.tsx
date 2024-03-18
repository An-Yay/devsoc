import React, { useEffect } from 'react';
import { Text } from 'ink';
import fs from 'fs';
import { exec } from 'child_process';

interface Props {
  text: string;
}

const generateAndSave: React.FC<Props> = ({ text }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "userInput": text }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();

        // Extract the string from the JSON response
        const { response: bashScript } = responseData;

        // Write the extracted string to a temporary bash script
        fs.writeFileSync('temp.sh', bashScript);

        // Execute the bash script
        exec('bash temp.sh', (err: any, stdout: any, stderr: any) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(stdout);
          console.error(stderr);
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [text]);

  return <Text>Component with prop text: {text}</Text>;
};

export default generateAndSave;
