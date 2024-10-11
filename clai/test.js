import { whisper } from 'whisper-node';
import path from 'path';

async function testWhisper() {
  try {
    const audioPath = path.join(process.cwd(), 'recordings/recording_172867945459223.wav');
    const modelPath = path.join(process.cwd(), 'models', 'ggml-base.en.bin');
    
    console.log('Audio file:', audioPath);
    console.log('Model file:', modelPath);

    const result = await whisper(audioPath, {
      modelName: "base.en",
      // modelPath: modelPath,
      whisperOptions: {
        language: 'en',
        word_timestamps: false
      }
    });

    console.log('Whisper result:', result);
  } catch (error) {
    console.error('Whisper error:', error);
  }
}

testWhisper();