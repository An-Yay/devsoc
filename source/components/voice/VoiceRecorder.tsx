// source/components/voice/VoiceRecorder.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import NodeMic from 'node-mic';
import fs from 'fs';
import path from 'path';
import { AudioTranscriber } from './Transcriber.js';
import { VoiceRecorderUI } from './RecordingUI.js';

type VoiceRecorderProps = {
  onRecordingComplete: (transcript: string) => void;
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const micRef = useRef<NodeMic | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(() => {
    const mic = new NodeMic({
      rate: 16000,
      channels: 1,
      threshold: 6,
      fileType: 'wav'
    });

    const executionDir = process.env['PWD'] || process.cwd();

    const outputFileName = `recording_${Date.now()}.wav`;
    const outputFilePath = path.join(executionDir, 'recordings', outputFileName);
    
    if (!fs.existsSync(path.join(executionDir, 'recordings'))) {
      fs.mkdirSync(path.join(executionDir, 'recordings'));
    }

    const outputFileStream = fs.createWriteStream(outputFilePath);
    const micInputStream = mic.getAudioStream();
    micInputStream.pipe(outputFileStream);

    micInputStream.on('error', (err) => setError(err.message));
    micInputStream.on('started', () => {
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    });
    micInputStream.on('stopped', () => {
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setAudioFilePath(outputFilePath);
      setIsTranscribing(true);
    });

    mic.start();
    micRef.current = mic;
  }, []);

  const stopRecording = useCallback(() => {
    if (micRef.current) {
      micRef.current.stop();
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (micRef.current) {
      micRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (micRef.current) {
      micRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    }
  }, []);

  const handleTranscriptionComplete = useCallback((transcript: string) => {
    setIsTranscribing(false);
    onRecordingComplete(transcript);
  }, [onRecordingComplete]);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    setIsRecording(false);
    setIsPaused(false);
    setIsTranscribing(false);
  }, []);

  useEffect(() => {
    return () => {
      if (micRef.current) {
        micRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      <VoiceRecorderUI
        isRecording={isRecording}
        isPaused={isPaused}
        isTranscribing={isTranscribing}
        recordingDuration={recordingDuration}
        error={error}
        onStart={startRecording}
        onPause={pauseRecording}
        onResume={resumeRecording}
        onStop={stopRecording}
      />
      {isTranscribing && audioFilePath && (
        <AudioTranscriber
          inputFilePath={audioFilePath}
          onTranscriptionComplete={handleTranscriptionComplete}
          onError={handleError}
        />
      )}
    </>
  );
};

export default VoiceRecorder;