import { MusicKit } from "@lib/music-kit";

export const prerender = false;

const CACHE_TTL_MINUTES = 10;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const CACHE_TTL_MS = CACHE_TTL_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const TRACK_LIMIT = 25;
const TOP_RESULTS_LIMIT = 10;
const STALE_WHILE_REVALIDATE_SECONDS = 300;
const CACHE_CONTROL_HEADER = `public, s-maxage=${CACHE_TTL_MINUTES * SECONDS_PER_MINUTE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`;

interface ArtistCount {
  artworkUrl?: string;
  count: number;
  name: string;
}

interface TrackCount {
  artist: string;
  artworkUrl?: string;
  count: number;
  name: string;
  url?: string;
}

interface MusicStats {
  topArtists: ArtistCount[];
  topTracks: TrackCount[];
  totalTracks: number;
}

interface CacheEntry {
  data: MusicStats;
  expiresAt: number;
}

let cache: CacheEntry | null = null;

export async function GET() {
  if (cache && Date.now() < cache.expiresAt) {
    return Response.json(cache.data, {
      headers: {
        "Cache-Control": CACHE_CONTROL_HEADER,
      },
    });
  }

  try {
    const client = new MusicKit();
    const tracks = await client.rotation.tracks.list({ limit: TRACK_LIMIT });
    const artists = new Map<string, ArtistCount>();
    const topTracks = new Map<string, TrackCount>();

    for (const track of tracks) {
      const artist = artists.get(track.artist);

      if (artist) {
        artist.count += 1;
      }

      if (!artist) {
        artists.set(track.artist, {
          artworkUrl: track.artworkUrl,
          count: 1,
          name: track.artist,
        });
      }

      const trackKey = `${track.name}::${track.artist}`;
      const topTrack = topTracks.get(trackKey);

      if (topTrack) {
        topTrack.count += 1;
      }

      if (!topTrack) {
        topTracks.set(trackKey, {
          artist: track.artist,
          artworkUrl: track.artworkUrl,
          count: 1,
          name: track.name,
          url: track.url,
        });
      }
    }

    const data = {
      topArtists: [...artists.values()]
        .sort((left, right) => right.count - left.count)
        .slice(0, TOP_RESULTS_LIMIT),
      topTracks: [...topTracks.values()]
        .sort((left, right) => right.count - left.count)
        .slice(0, TOP_RESULTS_LIMIT),
      totalTracks: tracks.length,
    };

    cache = {
      data,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };

    return Response.json(data, {
      headers: {
        "Cache-Control": CACHE_CONTROL_HEADER,
      },
    });
  } catch (error) {
    let message = "Failed to load music stats.";

    if (error instanceof Error) {
      const { message: errorMessage } = error;
      message = errorMessage;
    }

    return Response.json(
      { error: message },
      {
        headers: {
          "Cache-Control": "no-store",
        },
        status: 500,
      },
    );
  }
}
