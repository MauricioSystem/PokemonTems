import { useEffect, useRef, useState } from 'react';
import '../styles/AudioPlayer.scss';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(() => {});
    }
  }, [volume]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} loop autoPlay>
        <source src="/musica.mp3" type="audio/mpeg" />
      </audio>
      <button onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => {
          setVolume(parseFloat(e.target.value));
          if (audioRef.current) {
            audioRef.current.muted = false;
            setMuted(false);
          }
        }}
      />
    </div>
  );
}
