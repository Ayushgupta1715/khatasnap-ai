import { useEffect, useRef } from 'react';
import { Activity, Radio, AlertCircle } from 'lucide-react';

interface AudioSpectrumProps {
  analyser: AnalyserNode | null;
  isListening: boolean;
  statusText: string;
  lastDetectionSpecies?: string | null;
  hasPermissionError?: boolean;
}

export const AudioSpectrum = ({ 
  analyser, 
  isListening, 
  statusText, 
  lastDetectionSpecies, 
  hasPermissionError 
}: AudioSpectrumProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle grid lines
      ctx.strokeStyle = 'rgba(27, 46, 35, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (!isListening || !analyser) {
        // Dormant flatline or slow calm ambient wave
        const time = Date.now() / 1000;
        ctx.beginPath();
        ctx.strokeStyle = hasPermissionError ? 'rgba(239, 68, 68, 0.6)' : 'rgba(27, 46, 35, 0.8)';
        ctx.lineWidth = 2;
        
        for (let x = 0; x < width; x += 4) {
          const y = (height / 2) + Math.sin(x * 0.02 + time * 1.0) * (hasPermissionError ? 2 : 4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 1. Get Live Time-Domain Waveform Data
      const timeDomainBuffer = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(timeDomainBuffer);

      // Draw real live time-domain osc waveform
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(0, 200, 150, 0.45)';
      const sliceWidth = width / timeDomainBuffer.length;
      let waveX = 0;

      for (let i = 0; i < timeDomainBuffer.length; i++) {
        const v = timeDomainBuffer[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) ctx.moveTo(waveX, y);
        else ctx.lineTo(waveX, y);

        waveX += sliceWidth;
      }
      ctx.stroke();

      // 2. Get Live Frequency Data
      const freqBufferLength = analyser.frequencyBinCount;
      const freqData = new Uint8Array(freqBufferLength);
      analyser.getByteFrequencyData(freqData);

      // Draw dynamic frequency bars
      const barCount = 52;
      const step = Math.floor(freqBufferLength / barCount);
      const barWidth = (width / barCount) - 2;

      for (let i = 0; i < barCount; i++) {
        const value = freqData[i * step] || 0;
        const percent = value / 255;
        const barHeight = Math.max(3, percent * (height - 12));
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Color mapped to frequency intensity
        if (percent > 0.7) {
          ctx.fillStyle = '#00C896';
        } else if (percent > 0.3) {
          ctx.fillStyle = '#76D7A5';
        } else {
          ctx.fillStyle = '#1B2E23';
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
        ctx.fill();

        // High frequency energy peak pip
        if (percent > 0.75) {
          ctx.fillStyle = '#F2C94C';
          ctx.fillRect(x, y - 3, barWidth, 1.5);
        }
      }

      // 3. Draw Bird Detection Marker if recently triggered
      if (lastDetectionSpecies) {
        ctx.fillStyle = 'rgba(0, 200, 150, 0.15)';
        ctx.fillRect(width * 0.45, 0, width * 0.25, height);

        ctx.strokeStyle = '#00C896';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(width * 0.45, 0);
        ctx.lineTo(width * 0.45, height);
        ctx.moveTo(width * 0.7, 0);
        ctx.lineTo(width * 0.7, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Marker label
        ctx.fillStyle = '#00C896';
        ctx.font = '10px monospace';
        ctx.fillText(`⚡ ${lastDetectionSpecies.toUpperCase()} CALL DETECTED`, width * 0.46, 16);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [analyser, isListening, lastDetectionSpecies, hasPermissionError]);

  return (
    <div className="w-full bg-[#070D0A] rounded-xl border border-[#1B2E23] p-3 flex flex-col items-center">
      
      {/* Dynamic Status Header */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#97A89D] mb-2 px-1">
        <span className="flex items-center gap-2">
          {hasPermissionError ? (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-rose-400 font-semibold">{statusText}</span>
            </>
          ) : isListening ? (
            <>
              <Radio className="w-3.5 h-3.5 text-[#00C896] animate-pulse" />
              <span className="text-[#00C896] font-semibold">{statusText}</span>
            </>
          ) : (
            <>
              <Activity className="w-3.5 h-3.5 text-zinc-600" />
              <span>{statusText}</span>
            </>
          )}
        </span>

        <span className="tabular-nums hidden sm:inline text-[#97A89D]">
          {isListening ? 'LIVE AUDIO FFT + OSC WAVEFORM' : 'MICROPHONE DORMANT'}
        </span>
      </div>

      {/* Real-time Oscilloscope + Spectrum Canvas */}
      <canvas
        ref={canvasRef}
        width={640}
        height={100}
        className="w-full h-24 rounded-lg bg-[#070D0A]"
      />
    </div>
  );
};
