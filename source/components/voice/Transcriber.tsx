// source/components/voice/Transcriber.tsx

import { useEffect } from 'react';
import { whisper, ITranscriptLine, IOptions } from 'whisper-node';
import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);

type AudioTranscriberProps = {
  inputFilePath: string;
  onTranscriptionComplete: (transcript: string) => void;
  onError: (error: Error) => void;
};

export const AudioTranscriber: React.FC<AudioTranscriberProps> = ({
  inputFilePath,
  onTranscriptionComplete,
  onError,
}) => {
  useEffect(() => {
    const transcribe = async () => {
      const executionDir = process.env['PWD'] || process.cwd();

      const formattedFilePath = path.join(executionDir, 'recordings', `formatted_${path.basename(inputFilePath)}`);

      try {
        const ffmpegCommand = `ffmpeg -i ${inputFilePath} -ar 16000 -ac 1 ${formattedFilePath}`;
        await execPromise(ffmpegCommand);

        const whisperOptions: IOptions = {
          modelName: "base.en",
          whisperOptions: {
            language: 'auto',
            word_timestamps: false
          }
        };

        const transcriptResult = await whisper(formattedFilePath, whisperOptions);

        if (transcriptResult === undefined) {
          throw new Error('Whisper function returned undefined');
        }

        if (Array.isArray(transcriptResult) && transcriptResult.length > 0) {
          const fullTranscript = transcriptResult.map((t: ITranscriptLine) => t.speech).join(' ');
          onTranscriptionComplete(fullTranscript);
        } else {
          throw new Error('Transcription result is empty or invalid');
        }
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(formattedFilePath);
      }
    };

    transcribe();
  }, [inputFilePath, onTranscriptionComplete, onError]);

  return null;
};