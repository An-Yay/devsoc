import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { Spinner, StatusMessage, Alert } from '@inkjs/ui';
import NodeMic from 'node-mic';
import fs from 'fs';
import path from 'path';
import { whisper, ITranscriptLine, IOptions } from 'whisper-node';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

type VoiceRecorderProps = {
  onRecordingComplete: (transcript: string) => void;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mic = new NodeMic({
      rate: 16000,
      channels: 1,
      threshold: 6,
      fileType: 'wav'
    });

    const outputFileName = `recording_${Date.now()}.wav`;
    const outputFilePath = path.join(process.cwd(), 'recordings', outputFileName);
    const formattedFilePath = path.join(process.cwd(), 'recordings', `formatted_${outputFileName}`);

    // Ensure the recordings directory exists
    if (!fs.existsSync(path.join(process.cwd(), 'recordings'))) {
      fs.mkdirSync(path.join(process.cwd(), 'recordings'));
    }

    const outputFileStream = fs.createWriteStream(outputFilePath);
    const micInputStream = mic.getAudioStream();

    micInputStream.pipe(outputFileStream);

    outputFileStream.on('finish', () => {
      console.log('Audio file saved:', outputFilePath);
      console.log('File size:', fs.statSync(outputFilePath).size, 'bytes');
    });

    micInputStream.on('error', (err) => {
      setError(`Error: ${err.message}`);
      setIsRecording(false);
    });

    micInputStream.on('started', () => {
      setIsRecording(true);
      setRecordingDuration(0);
    });

    micInputStream.on('stopped', async () => {
      setIsRecording(false);
      setIsTranscribing(true);

      try {
        console.log('Starting transcription...');
        
        // Format the audio file using ffmpeg
        const ffmpegCommand = `ffmpeg -i ${outputFilePath} -ar 16000 -ac 1 ${formattedFilePath}`;
        console.log('Executing ffmpeg command:', ffmpegCommand);
        await execPromise(ffmpegCommand);
        console.log('Audio file formatted successfully');

        console.log('Formatted file path:', formattedFilePath);

        const whisperOptions: IOptions = {
          modelName: "base.en",
          whisperOptions: {
            language: 'auto',
            word_timestamps: false
          }
        };

        console.log('Whisper options:', whisperOptions);

        // Check if the formatted file exists and log its size
        if (fs.existsSync(formattedFilePath)) {
          const stats = fs.statSync(formattedFilePath);
          console.log(`Formatted audio file size: ${stats.size} bytes`);
        } else {
          throw new Error(`Formatted audio file not found: ${formattedFilePath}`);
        }

        console.log('Calling whisper function...');
        const transcriptResult = await whisper(formattedFilePath, whisperOptions);
        console.log('Raw transcript result:', transcriptResult);

        if (transcriptResult === undefined) {
          throw new Error('Whisper function returned undefined');
        }

        if (Array.isArray(transcriptResult) && transcriptResult.length > 0) {
          const fullTranscript = transcriptResult.map((t: ITranscriptLine) => t.speech).join(' ');
          console.log('Full transcript:', fullTranscript);
          onRecordingComplete(fullTranscript);
        } else {
          throw new Error('Transcription result is empty or invalid');
        }
      } catch (err) {
        console.error('Transcription error:', err);
        setError(`Transcription error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsTranscribing(false);
        // Clean up temporary files
        fs.unlinkSync(outputFilePath);
        fs.unlinkSync(formattedFilePath);
      }
    });

    // Start recording
    mic.start();

    // Stop recording after 10 seconds
    const timer = setInterval(() => {
      setRecordingDuration(prev => {
        if (prev >= 10) {
          clearInterval(timer);
          mic.stop();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      mic.stop();
    };
  }, [onRecordingComplete]);

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <Box flexDirection="column">
      <StatusMessage variant="info">
        {isRecording ? 'Recording in progress...' : isTranscribing ? 'Transcribing...' : 'Preparing to record...'}
      </StatusMessage>
      {isRecording && (
        <Box marginTop={1}>
          <Spinner />
          <Text> Recording: {recordingDuration} seconds</Text>
        </Box>
      )}
      {isTranscribing && (
        <Box marginTop={1}>
          <Spinner />
          <Text> Transcribing audio...</Text>
        </Box>
      )}
    </Box>
  );
};

export default VoiceRecorder;