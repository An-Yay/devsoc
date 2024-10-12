// source/components/voice/RecordingUI.tsx

import React from 'react';
import { Box, Text } from 'ink';
import { Spinner, StatusMessage, Alert, Select } from '@inkjs/ui';

type VoiceRecorderUIProps = {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  recordingDuration: number;
  error: string | null;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

export const VoiceRecorderUI: React.FC<VoiceRecorderUIProps> = ({
  isRecording,
  isPaused,
  isTranscribing,
  recordingDuration,
  error,
  onStart,
  onPause,
  onResume,
  onStop,
}) => {
  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  const renderControls = () => {
    if (isTranscribing) {
      return null; // Don't show any controls while transcribing
    }

    if (!isRecording) {
      return (
        <Select
          options={[{ label: 'Start Recording', value: 'start' }]}
          onChange={() => onStart()}
        />
      );
    }

    return (
      <Select
        options={[
          { label: isPaused ? 'Resume' : 'Pause', value: isPaused ? 'resume' : 'pause' },
          { label: 'Stop', value: 'stop' }
        ]}
        onChange={(value) => {
          if (value === 'pause') onPause();
          else if (value === 'resume') onResume();
          else if (value === 'stop') onStop();
        }}
      />
    );
  };

  return (
    <Box flexDirection="column">
      <StatusMessage variant="info">
        {isRecording
          ? isPaused
            ? 'Recording paused'
            : 'Recording in progress...'
          : isTranscribing
          ? 'Transcribing...'
          : 'Ready to record'}
      </StatusMessage>

      {isRecording && !isTranscribing && (
        <Box marginY={1}>
          <Spinner />
          <Text> Recording: {recordingDuration} seconds</Text>
        </Box>
      )}

      {isTranscribing && (
        <Box marginY={1}>
          <Spinner />
          <Text> Transcribing audio...</Text>
        </Box>
      )}

      {renderControls()}
    </Box>
  );
};