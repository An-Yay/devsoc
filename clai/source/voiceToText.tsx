import React, { useState, useEffect } from 'react';
import { Text } from 'ink';
import whisper from 'whisper-node-ts';

const VoiceInput = () => {
      const [transcript, setTranscript] = useState('');

      useEffect(() => {
            const getTranscript = async () => {
                  try {
                        const result = await whisper("example/sample.wav");
                        setTranscript(result);
                  } catch (error) {
                        console.error("Error:", error);
                  }
            };

            getTranscript();

            // Cleanup function
            return () => {
                  // Any cleanup code if needed
            };
      }, []);

      return (
            <div>
                  <Text>Transcript:</Text>
                  <Text>{transcript}</Text>
            </div>
      );
};

export default VoiceInput;
