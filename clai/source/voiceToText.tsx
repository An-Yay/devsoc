// RecordAudioComponent.js
import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { exec } from 'child_process';
import path from 'path';

const RecordAudioComponent = () => {
  const [status, setStatus] = useState('Recording...');
  const [transcription, setTranscription] = useState('');

  useEffect(() => {
    const folder = './source/assets/audio/';
    const filename = path.join(folder, 'audio.wav');
    const duration = 5; // Duration in seconds

    const recordingProcess = exec(`pw-record ${filename}`);

    // Stop recording after the specified duration
    const timeout = setTimeout(() => {
      recordingProcess.kill('SIGINT');
      transcribeAudio(filename);
    }, duration * 1000);

    recordingProcess.on('close', () => {
      clearTimeout(timeout);
      setStatus('Recording complete');
    });

    return () => {
      recordingProcess.kill('SIGINT'); // Clean up on unmount
    };
  }, []);

  const transcribeAudio = (audioFile: string) => {
    const folder = './source/assets/audio/';
    const folder2 = './source/assets/text/'
    const filename = path.join(folder, 'audio.wav');
    const filename2 = path.join(folder2, 'transcribed.txt');
    const transcriptionProcess = exec(`echogarden transcribe ${filename} ${filename2} --overwrite`);
  };

  return (
    <>
      <Text>{status}</Text>
      <Text>Transcription: {transcription}</Text>
    </>
  );
};

export default RecordAudioComponent;
