import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  MoreHorizontal,
  Clock,
  Music,
  Radio,
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Playlist {
  id: string;
  title: string;
  artist: string;
  description: string | null;
  cover_url: string;
  plays: string | null;
  tracks_count: number;
  is_live: boolean;
  mood_tag_id: string | null;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  duration: string;
  plays: string | null;
  playlist_id: string;
  sort_order: number;
}

interface Category {
  id: string;
  title: string;
  gradient: string;
  sort_order: number;
}

interface MoodTag {
  id: string;
  label: string;
  is_active: boolean;
  sort_order: number;
}

type Screen = 'home' | 'search' | 'playlist' | 'library';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [progress, setProgress] = useState(35);
  const [volume, setVolume] = useState(75);
  const [greeting, setGreeting] = useState('');

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [moodTags, setMoodTags] = useState<MoodTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [playlistsRes, categoriesRes, moodTagsRes] = await Promise.all([
        supabase.from('playlists').select('*').order('created_at'),
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('mood_tags').select('*').order('sort_order'),
      ]);

      if (playlistsRes.data) setPlaylists(playlistsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (moodTagsRes.data) setMoodTags(moodTagsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const fetchTracks = useCallback(async (playlistId: string) => {
    const { data } = await supabase
      .from('tracks')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('sort_order');
    if (data) setTracks(data);
  }, []);

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    fetchTracks(playlist.id);
    setCurrentScreen('playlist');
  };

  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const Sidebar = () => (
    <aside className="fixed left-0 top-0 bottom-20 w-60 bg-black flex flex-col z-40">
      <div className="p-4">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex gap-0">
            <span className="text-xl font-bold text-orange-500">Lofi</span>
            <span className="text-xl font-bold text-white">Bros</span>
          </div>
        </button>
      </div>

      <nav className="flex-1 px-2">
        {[
          { icon: Home, label: 'Home', screen: 'home' as Screen },
          { icon: Search, label: 'Search', screen: 'search' as Screen },
          { icon: Library, label: 'Your Library', screen: 'library' as Screen },
        ].map(({ icon: Icon, label, screen }) => (
          <button
            key={label}
            onClick={() => setCurrentScreen(screen)}
            className={`flex items-center gap-4 w-full px-4 py-3 rounded text-sm font-bold transition-colors ${
              currentScreen === screen ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span>{label}</span>
          </button>
        ))}

        <div className="mt-6 pt-4 border-t border-zinc-800">
          <button className="flex items-center gap-4 w-full px-4 py-3 rounded text-sm font-bold text-gray-400 hover:text-white transition-colors">
            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-black" />
            </div>
            <span className="font-semibold">Create Playlist</span>
          </button>

          <button className="flex items-center gap-4 w-full px-4 py-3 rounded text-sm font-bold text-gray-400 hover:text-white transition-colors">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-700 to-indigo-400 flex items-center justify-center">
              <Heart className="w-3 h-3 text-white" fill="currentColor" />
            </div>
            <span className="font-semibold">Liked Songs</span>
          </button>
        </div>

        <div className="mt-4 border-t border-zinc-800 pt-2 overflow-y-auto flex-1">
          {playlists.slice(0, 3).map((p) => (
            <button
              key={p.id}
              onClick={() => handlePlaylistClick(p)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors truncate"
            >
              {p.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-green-500" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">Lofi Bros User</p>
            <p className="text-xs text-gray-400">Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );

  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => {
    const [isHovered, setIsHovered] = useState(false);
    const subtitle = playlist.plays ? playlist.artist : `${playlist.tracks_count} tracks`;

    return (
      <button
        onClick={() => handlePlaylistClick(playlist)}
        className="bg-zinc-900 rounded-lg p-4 text-left transition-all duration-300 hover:bg-zinc-800 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative mb-4">
          <img
            src={playlist.cover_url}
            alt={playlist.title}
            className="w-full aspect-square object-cover rounded-md shadow-lg"
          />
          {isHovered && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg transform translate-y-0 opacity-100 transition-all duration-200 hover:scale-105 hover:brightness-110"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-current" />
              ) : (
                <Play className="w-5 h-5 text-black fill-current ml-0.5" />
              )}
            </button>
          )}
        </div>
        <h3 className="font-bold text-white truncate text-base">{playlist.title}</h3>
        <p className="text-sm text-gray-400 truncate mt-1">{subtitle}</p>
      </button>
    );
  };

  const NowPlayingBar = () => (
    <footer className="fixed left-0 right-0 bottom-0 h-20 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 z-50">
      <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
        {currentTrack && selectedPlaylist && (
          <>
            <img
              src={selectedPlaylist.cover_url}
              alt={currentTrack.title}
              className="w-14 h-14 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm text-white font-semibold truncate">{currentTrack.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
            <button className="ml-2 text-gray-400 hover:text-white transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipBack className="w-4 h-4 fill-current" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-black" />
            ) : (
              <Play className="w-4 h-4 text-black fill-current ml-0.5" />
            )}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-gray-400 w-10 text-right">1:12</span>
          <div
            className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, percent)));
            }}
          >
            <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-gray-400 w-10">3:24</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
        <button className="text-gray-400 hover:text-white transition-colors">
          <Volume2 className="w-4 h-4" />
        </button>
        <div
          className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            setVolume(Math.max(0, Math.min(100, percent)));
          }}
        >
          <div className="h-full bg-white rounded-full" style={{ width: `${volume}%` }} />
        </div>
      </div>
    </footer>
  );

  const HomeScreen = () => {
    const topMixes = playlists.filter((p) => p.plays).slice(0, 5);
    const chillBeats = playlists.filter((p) => !p.plays && p.is_live).slice(0, 4);
    const focusFlow = playlists.filter((p) => !p.plays && !p.is_live && p.tracks_count > 40).slice(0, 4);

    return (
      <main className="ml-60 pb-24">
        <header className="px-8 pt-4 pb-6 bg-gradient-to-b from-indigo-900/40 to-black -mt-8 pt-14">
          <h1 className="text-2xl font-bold text-white mb-6">{greeting}</h1>

          <div className="grid grid-cols-3 gap-3">
            {topMixes.slice(0, 6).map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist)}
                className="flex items-center gap-4 bg-zinc-900/80 rounded overflow-hidden hover:bg-zinc-800/80 transition-colors group"
              >
                <img src={playlist.cover_url} alt={playlist.title} className="w-20 h-20 object-cover" />
                <span className="font-bold text-white truncate text-sm">{playlist.title}</span>
                <div className="ml-auto mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </header>

        <section className="px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your Top Lofi Mixes</h2>
            <button className="text-sm text-gray-400 font-bold hover:underline">SHOW ALL</button>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {topMixes.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        <section className="px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Chill Beats</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">
                <Radio className="w-3 h-3" />
                LIVE
              </span>
            </div>
            <button className="text-sm text-gray-400 font-bold hover:underline">SHOW ALL</button>
          </div>

          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
            {moodTags.map((tag) => (
              <button
                key={tag.id}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  tag.is_active
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-6">
            {chillBeats.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>

        <section className="px-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Focus Flow</h2>
            <button className="text-sm text-gray-400 font-bold hover:underline">SHOW ALL</button>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {focusFlow.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      </main>
    );
  };

  const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
      <main className="ml-60 pb-24">
        <header className="px-8 pt-14 sticky top-0 bg-gradient-to-b from-black via-zinc-900 to-black z-30">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full bg-white text-black placeholder-gray-500 rounded-full py-3 pl-12 pr-4 font-semibold"
            />
          </div>
        </header>

        <section className="px-8 mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Browse all</h2>
          <div className="grid grid-cols-5 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="aspect-[3/2] rounded-lg overflow-hidden relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
                <span className="absolute top-4 left-4 text-white font-bold text-lg">{cat.title}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    );
  };

  const PlaylistScreen = () => {
    if (!selectedPlaylist) return null;

    const totalDuration = tracks.reduce((acc, track) => {
      const [min, sec] = track.duration.split(':').map(Number);
      return acc + min * 60 + sec;
    }, 0);
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);

    return (
      <main className="ml-60 pb-24">
        <header className="px-8 py-8 bg-gradient-to-b from-indigo-900/60 to-black flex items-end gap-6">
          <img
            src={selectedPlaylist.cover_url}
            alt={selectedPlaylist.title}
            className="w-56 h-56 shadow-2xl rounded"
          />
          <div className="text-sm font-bold text-white">
            <p className="text-xs mt-6 uppercase tracking-wider text-gray-400">Public Playlist</p>
            <h1 className="text-5xl font-bold mt-2">{selectedPlaylist.title}</h1>
            <div className="flex items-center gap-1 mt-4 text-gray-400">
              <div className="flex items-center gap-1 text-gray-400">
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 bg-orange-500 rounded-full" />
                  <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white" style={{ clipPath: 'inset(75% 0 0 0)' }} />
                </div>
              </div>
              <span className="text-white font-semibold">{selectedPlaylist.artist}</span>
              <span className="mx-1">-</span>
              <span>{tracks.length} songs, about {hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`}</span>
            </div>
          </div>
        </header>

        <div className="px-8">
          <div className="flex items-center gap-6 mt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-black fill-current" />
              ) : (
                <Play className="w-7 h-7 text-black fill-current ml-1" />
              )}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Shuffle className="w-6 h-6" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            </button>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 text-gray-400 text-xs font-semibold border-b border-zinc-800 uppercase tracking-wider">
              <div className="flex justify-center">
                <span>#</span>
              </div>
              <span>Title</span>
              <span>Album</span>
              <div className="flex justify-end">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              {tracks.map((track, index) => {
                const isActive = currentTrack?.id === track.id;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackClick(track)}
                    className={`w-full grid grid-cols-[16px_4fr_3fr_1fr] gap-4 px-4 py-2 rounded group text-left hover:bg-zinc-800 ${
                      isActive ? 'bg-zinc-800' : ''
                    }`}
                  >
                    <div className="flex justify-center items-center">
                      <span className={`group-hover:hidden ${isActive ? 'hidden' : ''} text-gray-400 text-sm`}>
                        {index + 1}
                      </span>
                      {isActive ? (
                        <Music className="w-4 h-4 text-green-500" />
                      ) : (
                        <Play className="w-4 h-4 text-white hidden group-hover:block" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={selectedPlaylist.cover_url}
                        alt={track.album || ''}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${isActive ? 'text-green-500' : 'text-white'}`}>
                          {track.title}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm truncate self-center">{track.album}</span>
                    <div className="flex justify-end items-center gap-4">
                      <Heart className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity" />
                      <span className="text-gray-400 text-sm">{track.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    );
  };

  const LibraryScreen = () => (
    <main className="ml-60 pb-24 px-8 pt-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-full bg-white text-black font-bold text-sm">
            Playlists
          </button>
          <button className="px-4 py-2 rounded-full bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
            Podcasts
          </button>
          <button className="px-4 py-2 rounded-full bg-zinc-800 text-white font-bold text-sm hover:bg-zinc-700 transition-colors">
            Albums
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </main>
  );

  const renderScreen = () => {
    if (loading) {
      return (
        <main className="ml-60 pb-24 flex items-center justify-center min-h-screen">
          <div className="text-white text-lg">Loading...</div>
        </main>
      );
    }

    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'search':
        return <SearchScreen />;
      case 'playlist':
        return <PlaylistScreen />;
      case 'library':
        return <LibraryScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      {renderScreen()}
      <NowPlayingBar />
    </div>
  );
}
