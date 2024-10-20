# CLAI - Command Line AI Assistant

CLAI is an Command Line Interface (CLI) application that integrates text and voice commands with AI-powered responses. It uses the [Not Diamond API](https://www.notdiamond.ai/) for generating responses and incorporates voice transcription capabilities.

![Screenshot](assets/clai.gif)

## Features

- Text-based command input
- Voice command recording and transcription
- AI powered response generation using Not Diamond API
- Bash script generation and execution
- Voice-to-text transcription using Whisper
- User-friendly CLI interface using Ink and Ink UI components

## Prerequisites

Before you begin, ensure you have the following requirements:

- Node.js
- npm
- FFmpeg

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/ayushh2k/clai.git
   cd clai
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Not Diamond API key:
   ```
   NOTDIAMOND_API_KEY=your_api_key_here
   ```
   You can get the Not Diamond API key from [here](https://app.notdiamond.ai), add the API keys of the LLM models of your choice by reffering to the notdiamond [page](https://docs.notdiamond.ai/docs/llm-models#defining-additional-model-configurations)
   Eg . `GOOGLE_API_KEY=your_key`
4.  Download whisper model of choice

    ```
    npx whisper-node download
    ```
5. Configure the LLM models you want to use in `source/components/common/NotDiamondRequest.tsx`

## Usage
Make sure you have `make` and `g++` compiler installed.
To start the CLAI application, run:

```
npm run build
node --no-warnings dist/cli.js
```
You can create an alias for `node --no-warnings dist/cli.js` named `clai`

### Text Commands

1. Choose the "Text Command" option from the main menu.
2. Type your query and press Enter.
3. The AI will generate a response or a bash script based on your input.
4. If a bash script is generated, you'll be prompted to review and execute it.

### Voice Commands (beta)

1. Choose the "Voice Command" option from the main menu.
2. Speak your query clearly and stop the recording.
3. The application will transcribe your speech and process it as a text command.

## Dependencies

- `@inkjs/ui`: UI components for the CLI interface
- `ink`: React for CLI applications
- `node-mic`: Audio recording
- `whisper-node`: Speech-to-text transcription
- `notdiamond`: AI response generation
- `dotenv`: Environment variable management

## Configuration

You can configure various aspects of the application by modifying the following files:

- `source/components/voice/VoiceRecorder.tsx`: Adjust recording duration, audio settings
- `source/components/common/NotDiamondRequest.tsx`: Modify AI prompt, dangerous patterns detection and the llm models used

## Troubleshooting

- If you encounter issues with voice recording, ensure that your system's microphone is properly configured and that you have the necessary permissions.
- For transcription errors, check that FFmpeg is correctly installed and accessible from the command line.
- If you receive API errors, verify that your Not Diamond API key is correctly set in the `.env` file.
- If you encounter issues with microphone or while transcripting, you can refer to the pages of [node-mic](https://www.npmjs.com/package/node-mic) and [whisper-node](https://www.npmjs.com/package/whisper-node).

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

If you have any questions or feedback, please open an issue in the GitHub repository.
