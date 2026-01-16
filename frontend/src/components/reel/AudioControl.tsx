import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

interface AudioControlProps {
  audioUrl: string;
}

const AudioControl: React.FC<AudioControlProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('0:00');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
    return () => {
      audioRef.current?.removeEventListener('timeupdate', updateProgress);
      audioRef.current?.pause();
    };
  }, [audioUrl]);

  const updateProgress = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);

      const remaining = total - current;
      const mins = Math.floor(remaining / 60);
      const secs = Math.floor(remaining % 60);
      setTimeLeft(`-${mins}:${secs.toString().padStart(2, '0')}`);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="flex flex-col items-center justify-end px-4 pb-10"
    >
      <div className="relative w-full overflow-hidden rounded-[28px] bg-[#1A1414]/95 p-1 shadow-2xl ring-1 ring-white/10 backdrop-blur-2xl">
        <div className="absolute left-0 top-0 h-1.5 w-full bg-white/5">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col gap-1 p-4">
          <div className="flex h-12 w-full items-center justify-center gap-1.5 px-4 opacity-70">
            {/* Simple Animated Waveform */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? [10, 30, 15, 25, 10][i % 5] : 10 }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                className="w-1.5 rounded-full bg-primary"
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between px-4">
            <div className="flex flex-col items-start gap-1 w-20">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Remaining</span>
              <span className="font-mono text-sm font-bold text-white/80">{timeLeft}</span>
            </div>

            <div className="relative -mt-10">
              <button
                onClick={togglePlay}
                className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white shadow-[0_10px_30px_rgba(236,109,19,0.5)] transition-all hover:scale-105 active:scale-95"
              >
                <Icon name={isPlaying ? "pause" : "play_arrow"} className="text-[40px] fill-1" />
              </button>
            </div>

            <div className="flex w-20 items-center justify-end gap-3">
              <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/40 transition hover:bg-white/10 active:scale-95 hover:text-white">
                <Icon name="volume_up" className="text-[22px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioControl;
