// RecordAudioComponent.js
import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import GenerateAndSave from "./components/generateAndSave.js";


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
    const transcriptionProcess = exec(`echogarden transcribe ${filename} ${filename2} --overwrite`)
    console.log("hi1")

    //make it stop transcribing after 10 seconds
    const timeout = setTimeout(() => {
      console.log("hi2")

      
    }, 10000);

    fs.readFile(filename2, 'utf8', (err, data) => {
      console.log("hi3")
      if (err) {
        console.error(`Error reading transcribed text file: ${err}`);
        return;
      }
      console.log("hi4")

      setTranscription(data); // Set the transcription state with the content of the file
      <GenerateAndSave text={data} /> // Use generateAndSave component with the transcribed text
    });
  };

  return (
    <>
      <Text>{status}</Text>
      <Text>Transcription: {transcription}</Text>
    </>
  );
};


export default RecordAudioComponent;
