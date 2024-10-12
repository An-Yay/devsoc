# CLAI - Command Line AI Assistant

CLAI is an advanced Command Line Interface (CLI) application that integrates text and voice commands with AI-powered responses. It uses the Not Diamond API for generating responses and incorporates voice transcription capabilities.

## Features

- Text-based command input
- Voice command recording and transcription
- AI-powered response generation using Not Diamond API
- Bash script generation and execution
- Voice-to-text transcription using Whisper
- User-friendly CLI interface using Ink and Ink UI components

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- FFmpeg (for audio processing)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/clai.git
   cd clai
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Not Diamond API key:
   ```
   NOT_DIAMOND_API_KEY=your_api_key_here
   ```

## Usage

To start the CLAI application, run:

```
npm start
```

### Text Commands

1. Choose the "Text Command" option from the main menu.
2. Type your query and press Enter.
3. The AI will generate a response or a bash script based on your input.
4. If a bash script is generated, you'll be prompted to review and execute it.

### Voice Commands

1. Choose the "Voice Command" option from the main menu.
2. Speak your query clearly (recording lasts for 10 seconds).
3. The application will transcribe your speech and process it as a text command.

## Project Structure

```
clai/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── NotDiamondRequest.tsx
│   │   ├── SearchQuery.tsx
│   │   └── VoiceRecorder.tsx
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Dependencies

- `@inkjs/ui`: UI components for the CLI interface
- `ink`: React for CLI applications
- `node-mic`: Audio recording
- `whisper-node`: Speech-to-text transcription
- `notdiamond`: AI response generation
- `dotenv`: Environment variable management

## Configuration

You can configure various aspects of the application by modifying the following files:

- `src/components/VoiceRecorder.tsx`: Adjust recording duration, audio settings
- `src/components/common/NotDiamondRequest.tsx`: Modify AI prompt, dangerous patterns detection

## Troubleshooting

- If you encounter issues with voice recording, ensure that your system's microphone is properly configured and that you have the necessary permissions.
- For transcription errors, check that FFmpeg is correctly installed and accessible from the command line.
- If you receive API errors, verify that your Not Diamond API key is correctly set in the `.env` file.

## Contributing

Contributions to CLAI are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

If you have any questions or feedback, please open an issue in the GitHub repository or contact the maintainer at your@email.com.

## Acknowledgements

- [Not Diamond API](https://notdiamond.ai)
- [Ink](https://github.com/vadimdemedes/ink)
- [Whisper](https://github.com/openai/whisper)
- All other open-source libraries used in this project
