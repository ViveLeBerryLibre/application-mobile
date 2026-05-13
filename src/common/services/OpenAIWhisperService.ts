import OpenAI from 'openai';
import { VoiceRecorder } from 'capacitor-voice-recorder';

export interface WhisperTranscriptionResult {
  text: string;
  success: boolean;
  error?: string;
}

export interface VoiceRecordingResult {
  recordDataBase64: string;
  msDuration: number;
  mimeType: string;
}

class OpenAIWhisperService {
  private openai: OpenAI | null = null;
  private apiKey: string = '';

  constructor() {
    // Initialize OpenAI client when API key is set
  }

  /**
   * Set the OpenAI API key
   * @param apiKey - OpenAI API key
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: this.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }

  /**
   * Check if voice recording permission is granted
   */
  async checkPermissions(): Promise<boolean> {
    try {
      const permission = await VoiceRecorder.hasAudioRecordingPermission();
      return permission.value;
    } catch (error) {
      console.error('Error checking voice recording permissions:', error);
      return false;
    }
  }

  /**
   * Request voice recording permission
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const permission = await VoiceRecorder.requestAudioRecordingPermission();
      return permission.value;
    } catch (error) {
      console.error('Error requesting voice recording permissions:', error);
      return false;
    }
  }

  /**
   * Start voice recording
   */
  async startRecording(): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermissions();
      if (!hasPermission) {
        const granted = await this.requestPermissions();
        if (!granted) {
          throw new Error('Voice recording permission not granted');
        }
      }

      await VoiceRecorder.startRecording();
      return true;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      return false;
    }
  }

  /**
   * Stop voice recording and get the recorded data
   */
  async stopRecording(): Promise<VoiceRecordingResult | null> {
    try {
      const result = await VoiceRecorder.stopRecording();
      return {
        recordDataBase64: result.value.recordDataBase64,
        msDuration: result.value.msDuration,
        mimeType: result.value.mimeType
      };
    } catch (error) {
      console.error('Error stopping voice recording:', error);
      return null;
    }
  }

  /**
   * Convert base64 audio data to File object
   */
  private base64ToFile(base64Data: string, mimeType: string, filename: string): File {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    
    return new File([blob], filename, { type: mimeType });
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  async transcribeAudio(recordingResult: VoiceRecordingResult): Promise<WhisperTranscriptionResult> {
    try {
      if (!this.openai) {
        return {
          text: '',
          success: false,
          error: 'OpenAI API key not set. Please configure your API key.'
        };
      }

      // Convert base64 to File
      const audioFile = this.base64ToFile(
        recordingResult.recordDataBase64,
        recordingResult.mimeType,
        'recording.webm'
      );

      // Call OpenAI Whisper API
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'fr', // French language
        response_format: 'text'
      });

      return {
        text: transcription,
        success: true
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Record voice and transcribe in one operation
   */
  async recordAndTranscribe(): Promise<WhisperTranscriptionResult> {
    try {
      // Start recording
      const recordingStarted = await this.startRecording();
      if (!recordingStarted) {
        return {
          text: '',
          success: false,
          error: 'Failed to start recording'
        };
      }

      // Note: In a real implementation, you would need to handle the recording duration
      // and provide UI controls for the user to stop recording
      
      return {
        text: '',
        success: false,
        error: 'Recording started. Use stopRecording() and then transcribeAudio() to complete the process.'
      };
    } catch (error) {
      console.error('Error in recordAndTranscribe:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Check if currently recording
   */
  async isRecording(): Promise<boolean> {
    try {
      const status = await VoiceRecorder.getCurrentStatus();
      return status.status === 'RECORDING';
    } catch (error) {
      console.error('Error checking recording status:', error);
      return false;
    }
  }
}

// Export singleton instance
export default new OpenAIWhisperService();