export interface Species {
  id: string;
  commonName: string;
  hindiName?: string;
  scientificName: string;
  type: 'bird' | 'tree' | 'insect' | 'plant' | 'sound';
  confidence: number;
  direction: string; // e.g. "14m East • High Mango Canopy"
  audioCharacteristics: string;
  whisperText: string;
  habitat: string;
  badge: 'LIVE EDGE' | 'SIMULATED DEMO';
  modelArch: string; // e.g. "BirdNET-Mini (Open-Weights ONNX FP16)"
  latencyMs: number;
  timestamp: string;
  sha256: string;
  whyThisBird?: string; // Short explanation for identification
  frequencyRange?: string; // e.g. "1.8 - 3.2 kHz"
  seasonalNote?: string;
}

export interface SavedSighting {
  id: string;
  species: Species;
  savedAt: string; // ISO date string
  note?: string;
  coordinates?: string;
  verifiedOffline: boolean;
}

export interface BingoItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  completed: boolean;
  timestamp?: string;
}

export interface SystemOfflineStatus {
  modelReady: boolean;
  audioProcessing: 'On-device' | 'Disabled';
  networkStatus: 'Connected' | 'Disconnected (Dead-Zone)';
  savedSightingsCount: number;
}
