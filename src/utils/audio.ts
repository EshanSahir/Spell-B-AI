// Web Speech API text-to-speech helper for Spelling Bee pronunciation

class PronunciationManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.voices = this.synth.getVoices();
    }
  }

  public speakWord(word: string, slow: boolean = false, rateOverride?: number) {
    if (!this.synth) return;

    this.synth.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(word);
    
    // Choose best English voice
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    const preferredVoice = englishVoices.find(v => 
      v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Natural')
    ) || englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = rateOverride ?? (slow ? 0.6 : 0.88);
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  public speakSentence(sentence: string) {
    if (!this.synth) return;
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = 0.9;
    this.synth.speak(utterance);
  }

  public spellOutLetters(word: string) {
    if (!this.synth) return;
    this.synth.cancel();

    const letters = word.toUpperCase().split('').join(', ');
    const utterance = new SpeechSynthesisUtterance(letters);
    utterance.rate = 0.75;
    this.synth.speak(utterance);
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const pronouncer = new PronunciationManager();
