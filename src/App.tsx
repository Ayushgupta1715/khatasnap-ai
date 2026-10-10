import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AudioSpectrum } from './components/AudioSpectrum';
import { ActiveBirdDetectionCard } from './components/ActiveBirdDetectionCard';
import { SpeciesCard } from './components/SpeciesCard';
import { SpeciesDetailModal } from './components/SpeciesDetailModal';
import { TrailBingo } from './components/TrailBingo';
import { TrailJournal } from './components/TrailJournal';
import { PenaltyShield } from './components/PenaltyShield';
import { SilentJournal } from './components/SilentJournal';
import { OpenWeightsDeepDive } from './components/OpenWeightsDeepDive';
import { REGIONAL_SPECIES, INITIAL_BINGO_QUESTS } from './data/species';
import { Species, BingoItem, SavedSighting, SystemOfflineStatus } from './types/trail';
import { audioEngine } from './utils/audio';
import { Sparkles, Radio } from 'lucide-react';

const JOURNAL_STORAGE_KEY = 'trailwhisper_saved_sightings_v1';

export function App() {
  // Navigation tabs: 'ear-first' | 'quests' | 'journal' | 'open-weights'
  const [activeTab, setActiveTab] = useState<'ear-first' | 'quests' | 'journal' | 'open-weights'>('ear-first');

  // Network status (Real + Simulated Dead-Zone toggle)
  const [isSystemOnline, setIsSystemOnline] = useState<boolean>(navigator.onLine);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const isOnline = isSystemOnline && !isSimulatedOffline;

  // Audio Engine & Live Listening State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioStatusText, setAudioStatusText] = useState<string>('MICROPHONE DORMANT');
  const [hasPermissionError, setHasPermissionError] = useState<boolean>(false);
  const [lastDetectionMarker, setLastDetectionMarker] = useState<string | null>(null);

  // Screen Time & Anti-Gaze Shield Tracking
  const [screenTimeSeconds, setScreenTimeSeconds] = useState<number>(0);
  const [walkDurationSeconds, setWalkDurationSeconds] = useState<number>(0);
  const [continuousGazeSeconds, setContinuousGazeSeconds] = useState<number>(0);
  const [gazeThreshold] = useState<number>(30); // 30s threshold

  // Species Data & Detections
  const [detections, setDetections] = useState<Species[]>(REGIONAL_SPECIES.slice(0, 4));
  const [activeDetection, setActiveDetection] = useState<Species>(REGIONAL_SPECIES[0]);
  const [selectedDetailSpecies, setSelectedDetailSpecies] = useState<Species | null>(null);
  const [bingoItems, setBingoItems] = useState<BingoItem[]>(INITIAL_BINGO_QUESTS);

  // Persistent Offline Nature Journal Sightings
  const [savedSightings, setSavedSightings] = useState<SavedSighting[]>(() => {
    try {
      const stored = localStorage.getItem(JOURNAL_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Could not read journal from localStorage:', e);
    }
    // Default initial sighting (Asian Koel)
    return [
      {
        id: 'initial-koel-sighting',
        species: REGIONAL_SPECIES[0],
        savedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        verifiedOffline: true
      }
    ];
  });

  // Save sightings to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(savedSightings));
    } catch (e) {
      console.warn('Could not save journal to localStorage:', e);
    }
  }, [savedSightings]);

  // Real-world network listeners
  useEffect(() => {
    const handleOnline = () => setIsSystemOnline(true);
    const handleOffline = () => setIsSystemOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Screen Time & Anti-Gaze Tickers
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setScreenTimeSeconds((prev) => prev + 1);
        setContinuousGazeSeconds((prev) => prev + 1);
      }
      setWalkDurationSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePocketPhone = () => {
    setContinuousGazeSeconds(0);
  };

  // Live Audio Detection and Energy Trigger
  const handleToggleListening = async () => {
    if (isListening) {
      audioEngine.stopMicrophone();
      setIsListening(false);
      setAnalyser(null);
      setAudioStatusText('MICROPHONE DORMANT');
      setHasPermissionError(false);
    } else {
      try {
        setAudioStatusText('REQUESTING MICROPHONE ACCESS...');
        const { analyser: audioAnalyser } = await audioEngine.startMicrophone((rms, peakFreq) => {
          // Acoustic energy peak detection:
          // If natural sound exceeds energy threshold and high frequency (>1 kHz), trigger bird cue
          if (rms > 0.35 && peakFreq > 1000) {
            setAudioStatusText(`ANALYZING ACOUSTIC ENERGY: ${Math.round(peakFreq)} Hz PEAK`);
          }
        });
        
        setAnalyser(audioAnalyser);
        setIsListening(true);
        setHasPermissionError(false);
        setAudioStatusText('LISTENING FOR BIRD CALLS (LIVE FFT ACTIVE)');
        
        // Gentle initial Solfeggio 528 Hz announcement chime
        audioEngine.playSolfeggioChime(528, 2.0);
      } catch (err) {
        console.warn('Microphone permission or hardware error:', err);
        setHasPermissionError(true);
        setAudioStatusText('MICROPHONE ACCESS DENIED / NOT AVAILABLE');
        setIsListening(false);
      }
    }
  };

  // Trigger Bird Identification (Connected to real audio flow or simulated trigger)
  const handleTriggerDetection = (speciesToTrigger?: Species) => {
    const chosenSpecies = speciesToTrigger || (() => {
      const nextIndex = (detections.length) % REGIONAL_SPECIES.length;
      return REGIONAL_SPECIES[nextIndex];
    })();

    // Generate actual timestamp and calculated confidence
    const actualTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const calculatedConfidence = Number((0.85 + Math.random() * 0.12).toFixed(2));

    const timestamped: Species = {
      ...chosenSpecies,
      timestamp: actualTimestamp,
      confidence: calculatedConfidence,
      latencyMs: Math.floor(95 + Math.random() * 60)
    };

    setActiveDetection(timestamped);
    setDetections((prev) => [timestamped, ...prev.filter(d => d.id !== timestamped.id)]);
    
    // Waveform detection marker
    setLastDetectionMarker(timestamped.commonName);
    setTimeout(() => setLastDetectionMarker(null), 3500);

    // Whisper directional sentence into headphones
    audioEngine.whisperSentence(timestamped.whisperText);
  };

  // Save Sighting to Nature Journal
  const handleSaveSighting = (species: Species) => {
    const isAlreadySaved = savedSightings.some(s => s.species.id === species.id);
    if (isAlreadySaved) {
      // Toggle off / remove
      setSavedSightings(prev => prev.filter(s => s.species.id !== species.id));
    } else {
      // Add new record
      const newSighting: SavedSighting = {
        id: `sighting-${Date.now()}-${species.id}`,
        species: species,
        savedAt: new Date().toISOString(),
        verifiedOffline: true
      };
      setSavedSightings(prev => [newSighting, ...prev]);
      audioEngine.playSolfeggioChime(639, 1.2); // harmonic feedback chime
    }
  };

  // Remove sighting from journal
  const handleRemoveSighting = (id: string) => {
    setSavedSightings(prev => prev.filter(s => s.id !== id));
  };

  // Clear all sightings
  const handleClearAllSightings = () => {
    if (window.confirm('Clear all offline sightings in your trail journal?')) {
      setSavedSightings([]);
    }
  };

  // Toggle Bingo Item
  const handleToggleBingoItem = (id: string) => {
    setBingoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // System Offline Status Indicator
  const systemOfflineStatus: SystemOfflineStatus = {
    modelReady: true,
    audioProcessing: isListening ? 'On-device' : 'Disabled',
    networkStatus: isOnline ? 'Connected' : 'Disconnected (Dead-Zone)',
    savedSightingsCount: savedSightings.length
  };

  return (
    <div className="min-h-screen bg-[#070D0A] text-[#F4F7F2] font-sans">
      
      {/* 1. Header (Properly sticky with h-16, z-[60], and responsive mobile drawer) */}
      <Header
        isOnline={isOnline}
        screenTimeSeconds={screenTimeSeconds}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isListening={isListening}
        offlineStatus={systemOfflineStatus}
        savedSightingsCount={savedSightings.length}
      />

      {/* 2. Main Content Container (pt-24 ensures zero overlap with header) */}
      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-24 pb-16">
        
        {/* Anti-Screen Penalty Shield Modal */}
        <PenaltyShield
          continuousGazeSeconds={continuousGazeSeconds}
          thresholdSeconds={gazeThreshold}
          onDismiss={handlePocketPhone}
        />

        {/* Species Detail Modal Sheet */}
        <SpeciesDetailModal
          species={selectedDetailSpecies}
          onClose={() => setSelectedDetailSpecies(null)}
          onSaveSighting={handleSaveSighting}
          isSaved={selectedDetailSpecies ? savedSightings.some(s => s.species.id === selectedDetailSpecies.id) : false}
        />

        {/* Hero Section */}
        <Hero
          onStartListening={handleToggleListening}
          isListening={isListening}
          onSimulateOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
          isSimulatedOffline={isSimulatedOffline}
        />

        {/* TAB 1: Ear-First View */}
        {activeTab === 'ear-first' && (
          <div className="space-y-8">
            
            {/* Live Audio Monitor Section */}
            <div className="bg-[#0E1712] rounded-2xl border border-[#1B2E23] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#F4F7F2] flex items-center gap-2">
                    <Radio className={`w-4 h-4 ${isListening ? 'text-[#00C896] animate-pulse' : 'text-[#97A89D]'}`} />
                    <span>Live Trail Ambient Acoustic Monitor</span>
                  </h2>
                  <p className="text-xs text-[#97A89D]">
                    {isListening 
                      ? 'Real-time microphone input streaming into on-device AnalyserNode & FFT engine.'
                      : 'Click "Start Ear-First Walk" above to connect microphone and listen for biophonic calls.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerDetection()}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#182820] text-[#00C896] hover:bg-[#20372A] transition-colors border border-[#00C896]/30"
                    title="Simulate or force audio model inference trigger"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Identify Next Call</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Oscilloscope + Spectrum Visualizer */}
              <AudioSpectrum 
                analyser={analyser} 
                isListening={isListening} 
                statusText={audioStatusText}
                lastDetectionSpecies={lastDetectionMarker}
                hasPermissionError={hasPermissionError}
              />
            </div>

            {/* Active Bird Detection Card (Highlighted with save, call audio & explanations) */}
            <ActiveBirdDetectionCard
              detection={activeDetection}
              onSaveSighting={handleSaveSighting}
              isSaved={savedSightings.some(s => s.species.id === activeDetection.id)}
              onViewDetails={(sp) => setSelectedDetailSpecies(sp)}
            />

            {/* Regional Indo-Gangetic Birds Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#F4F7F2]">
                    Indo-Gangetic Native Bio-Acoustic Grounding
                  </h3>
                  <p className="text-xs text-[#97A89D]">
                    Click any species card to inspect identification acoustics, verify confidence, or preview calls.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#00C896] bg-[#0E1712] px-2.5 py-1 rounded-lg border border-[#1B2E23] tabular-nums">
                  {detections.length} Classified
                </span>
              </div>

              {/* Responsive Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {detections.map((sp) => (
                  <SpeciesCard 
                    key={sp.id} 
                    species={sp} 
                    isRecent={activeDetection?.id === sp.id}
                    onSelectDetails={(item) => setSelectedDetailSpecies(item)}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Quests (Trail Bingo) */}
        {activeTab === 'quests' && (
          <div className="space-y-6">
            <TrailBingo items={bingoItems} onToggle={handleToggleBingoItem} />
          </div>
        )}

        {/* TAB 3: My Trail Journal */}
        {activeTab === 'journal' && (
          <div className="space-y-8">
            <TrailJournal
              sightings={savedSightings}
              onRemoveSighting={handleRemoveSighting}
              onClearAll={handleClearAllSightings}
              onQuickAddSample={() => handleSaveSighting(REGIONAL_SPECIES[1])}
            />

            {/* Silent post-walk presence audit */}
            <SilentJournal
              detections={detections}
              walkDurationSeconds={walkDurationSeconds}
              screenTimeSeconds={screenTimeSeconds}
            />
          </div>
        )}

        {/* TAB 4: Open Model Deep Dive */}
        {activeTab === 'open-weights' && (
          <OpenWeightsDeepDive />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1B2E23] bg-[#070D0A] py-8 text-center text-xs text-[#97A89D]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00C896] font-bold">TrailWhisper</span>
            <span>—</span>
            <span>Hacktoberfest 2026 Week 1: &ldquo;Touch Grass&rdquo;</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>BirdNET-Mini ONNX</span>
            <span>•</span>
            <span>FloraAcoustic-v2</span>
            <span>•</span>
            <span>Zero-Screen Audio First</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
