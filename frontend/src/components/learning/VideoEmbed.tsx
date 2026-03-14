import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  youtubeId: string;
  title: string;
}

export default function VideoEmbed({ youtubeId, title }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  if (playing) {
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full cursor-pointer group rounded-xl overflow-hidden"
      style={{ paddingBottom: '56.25%' }}
      onClick={() => setPlaying(true)}
    >
      <img
        src={thumbnail}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
          <Play size={24} className="text-white ml-1" fill="white" />
        </div>
      </div>
    </div>
  );
}
