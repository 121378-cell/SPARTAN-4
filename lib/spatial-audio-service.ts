/**
 * Spatial Audio Service for SPARTAN 4
 * Provides 3D spatial audio cues for training guidance
 */

export interface SpatialAudioCue {
  id: string;
  message: string;
  position: { x: number; y: number; z: number };
  volume: number; // 0-1
  priority: number; // 1-10, higher is more important
  type: 'form-correction' | 'motivation' | 'warning' | 'instruction' | 'completion';
  duration?: number; // in milliseconds
}

export interface SpatialAudioConfig {
  enabled: boolean;
  masterVolume: number;
  voiceLanguage: string;
  voiceType: 'male' | 'female' | 'neutral';
  spatialEnabled: boolean;
}

export class SpatialAudioService {
  private static instance: SpatialAudioService;
  private audioContext: AudioContext | null = null;
  private config: SpatialAudioConfig;
  private activeCues: Map<string, SpatialAudioCue> = new Map();
  private pannerNodes: Map<string, PannerNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private isInitialized = false;

  private constructor() {
    this.config = {
      enabled: true,
      masterVolume: 0.8,
      voiceLanguage: 'es-ES',
      voiceType: 'male',
      spatialEnabled: true
    };
  }

  static getInstance(): SpatialAudioService {
    if (!SpatialAudioService.instance) {
      SpatialAudioService.instance = new SpatialAudioService();
    }
    return SpatialAudioService.instance;
  }

  /**
   * Initialize the spatial audio service
   */
  async initialize(): Promise<boolean> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context on first user interaction
      const resumeContext = () => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
        document.removeEventListener('click', resumeContext);
        document.removeEventListener('touchstart', resumeContext);
      };
      
      document.addEventListener('click', resumeContext);
      document.addEventListener('touchstart', resumeContext);
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize spatial audio service:', error);
      return false;
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): SpatialAudioConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<SpatialAudioConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Play a spatial audio cue
   */
  async playCue(cue: SpatialAudioCue): Promise<void> {
    if (!this.config.enabled || !this.isInitialized || !this.audioContext) {
      return;
    }

    try {
      // Check if cue with same ID already exists
      if (this.activeCues.has(cue.id)) {
        this.stopCue(cue.id);
      }

      // Add to active cues
      this.activeCues.set(cue.id, cue);

      // Create speech synthesis
      const utterance = new SpeechSynthesisUtterance(cue.message);
      utterance.lang = this.config.voiceLanguage;
      utterance.volume = cue.volume * this.config.masterVolume;

      // Create spatial panner node if enabled
      if (this.config.spatialEnabled) {
        const panner = this.audioContext.createPanner();
        panner.panningModel = 'HRTF';
        panner.distanceModel = 'inverse';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;
        
        // Set position
        panner.setPosition(cue.position.x, cue.position.y, cue.position.z);
        
        // Create gain node
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = cue.volume * this.config.masterVolume;
        
        // Connect nodes
        panner.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Store references
        this.pannerNodes.set(cue.id, panner);
        this.gainNodes.set(cue.id, gainNode);
        
        // Play audio through Web Audio API
        // Note: For full spatial audio, we would need to use a more advanced approach
        // This is a simplified implementation
      }

      // Play the speech
      speechSynthesis.speak(utterance);

      // Set timeout to remove cue after duration
      if (cue.duration) {
        setTimeout(() => {
          this.stopCue(cue.id);
        }, cue.duration);
      }

      // Remove from active cues when finished
      utterance.onend = () => {
        this.activeCues.delete(cue.id);
        this.pannerNodes.delete(cue.id);
        this.gainNodes.delete(cue.id);
      };
    } catch (error) {
      console.error('Failed to play spatial audio cue:', error);
      this.activeCues.delete(cue.id);
    }
  }

  /**
   * Stop a specific audio cue
   */
  stopCue(cueId: string): void {
    // Cancel speech synthesis for this cue
    const utterances = speechSynthesis.speaking 
      ? speechSynthesis.getVoices().map(() => new SpeechSynthesisUtterance('')) 
      : [];
    
    // In a real implementation, we would track utterances better
    // For now, we'll just remove from active cues
    this.activeCues.delete(cueId);
    this.pannerNodes.delete(cueId);
    this.gainNodes.delete(cueId);
  }

  /**
   * Stop all active audio cues
   */
  stopAllCues(): void {
    speechSynthesis.cancel();
    this.activeCues.clear();
    this.pannerNodes.clear();
    this.gainNodes.clear();
  }

  /**
   * Update position of an active cue
   */
  updateCuePosition(cueId: string, position: { x: number; y: number; z: number }): void {
    const cue = this.activeCues.get(cueId);
    if (!cue || !this.config.spatialEnabled) return;

    cue.position = position;
    
    const panner = this.pannerNodes.get(cueId);
    if (panner) {
      panner.setPosition(position.x, position.y, position.z);
    }
  }

  /**
   * Get active cues
   */
  getActiveCues(): SpatialAudioCue[] {
    return Array.from(this.activeCues.values());
  }

  /**
   * Play a form correction cue
   */
  playFormCorrectionCue(message: string, position: { x: number; y: number; z: number }): void {
    const cue: SpatialAudioCue = {
      id: `form-${Date.now()}`,
      message,
      position,
      volume: 0.9,
      priority: 8,
      type: 'form-correction',
      duration: 5000
    };
    
    this.playCue(cue);
  }

  /**
   * Play a motivation cue
   */
  playMotivationCue(message: string): void {
    const cue: SpatialAudioCue = {
      id: `motivation-${Date.now()}`,
      message,
      position: { x: 0, y: 0, z: 0 }, // Center position
      volume: 0.7,
      priority: 5,
      type: 'motivation',
      duration: 3000
    };
    
    this.playCue(cue);
  }

  /**
   * Play a warning cue
   */
  playWarningCue(message: string): void {
    const cue: SpatialAudioCue = {
      id: `warning-${Date.now()}`,
      message,
      position: { x: 0, y: 0, z: 0 }, // Center position for attention
      volume: 1.0,
      priority: 10,
      type: 'warning',
      duration: 4000
    };
    
    this.playCue(cue);
  }

  /**
   * Play an instruction cue
   */
  playInstructionCue(message: string): void {
    const cue: SpatialAudioCue = {
      id: `instruction-${Date.now()}`,
      message,
      position: { x: 0, y: 0, z: 0 }, // Center position
      volume: 0.8,
      priority: 7,
      type: 'instruction',
      duration: 5000
    };
    
    this.playCue(cue);
  }

  /**
   * Play a completion cue
   */
  playCompletionCue(message: string): void {
    const cue: SpatialAudioCue = {
      id: `completion-${Date.now()}`,
      message,
      position: { x: 0, y: 0, z: 0 }, // Center position
      volume: 0.9,
      priority: 6,
      type: 'completion',
      duration: 4000
    };
    
    this.playCue(cue);
  }
}

// Export singleton instance
export const spatialAudioService = SpatialAudioService.getInstance();

// Example usage:
// spatialAudioService.initialize().then(() => {
//   spatialAudioService.playFormCorrectionCue(
//     "Corrige la posición de tus rodillas", 
//     { x: 0.5, y: 1.2, z: 1.0 }
//   );
// });