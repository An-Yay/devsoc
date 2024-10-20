// source/components/voice/VoiceCommandMode.tsx

import React from "react";
import { Box } from "ink";
import { StatusMessage } from "@inkjs/ui";
import VoiceRecorder from "./VoiceRecorder.js";

interface VoiceCommandModeProps {
  onRecordingComplete: (transcript: string) => void;
}

const VoiceCommandMode: React.FC<VoiceCommandModeProps> = ({ onRecordingComplete }) => {
  return (
    <Box flexDirection="column" padding={1}>
      <StatusMessage variant="info">
        Voice Command Mode
      </StatusMessage>
      <VoiceRecorder onRecordingComplete={onRecordingComplete} />
    </Box>
  );
};

export default VoiceCommandMode;