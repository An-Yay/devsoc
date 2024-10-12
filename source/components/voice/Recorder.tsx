// source/components/voice/Recorder.tsx

import React, { useEffect, useCallback } from 'react';
import NodeMic from 'node-mic';
import fs from 'fs';
import path from 'path';

type AudioRecorderProps = {
  onRecordingStart: () => void;
  onRecordingStop: (filePath: string) => void;
  onError: (error: Error) => void;
};

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingStart,
  onRecordingStop,
  onError,
}) => {
  const startRecording = useCallback(() => {
    const mic = new NodeMic({
      rate: 16000,
      channels: 1,
      threshold: 6,
      fileType: 'wav'
    });

    const outputFileName = `recording_${Date.now()}.wav`;
    const outputFilePath = path.join(process.cwd(), 'recordings', outputFileName);

    if (!fs.existsSync(path.join(process.cwd(), 'recordings'))) {
      fs.mkdirSync(path.join(process.cwd(), 'recordings'));
    }

    const outputFileStream = fs.createWriteStream(outputFilePath);
    const micInputStream = mic.getAudioStream();

    micInputStream.pipe(outputFileStream);

    micInputStream.on('error', (err) => onError(err));
    micInputStream.on('started', onRecordingStart);
    micInputStream.on('stopped', () => onRecordingStop(outputFilePath));

    mic.start();

    setTimeout(() => mic.stop(), 10000); // Stop after 10 seconds

    return () => mic.stop();
  }, [onRecordingStart, onRecordingStop, onError]);

  useEffect(() => {
    const cleanup = startRecording();
    return cleanup;
  }, [startRecording]);

  return null;
};