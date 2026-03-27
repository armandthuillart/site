import { importPKCS8, SignJWT } from "jose";

const API_BASE_URL = "https://api.music.apple.com";
const DEFAULT_TRACK_LIMIT = 25;
const ARTWORK_SIZE = 64;
const TOKEN_LIFETIME_SECONDS = 15_777_000;
const TOKEN_REFRESH_BUFFER_SECONDS = 60;
const MILLISECONDS_PER_SECOND = 1000;

interface Credentials {
  keyId: string;
  privateKey: string;
  teamId: string;
  userToken: string;
}

interface CachedDeveloperToken {
  expiresAt: number;
  token: string;
}

interface AppleMusicTrack {
  attributes: {
    artistName: string;
    artwork?: {
      url: string;
    };
    name: string;
    url?: string;
  };
  id: string;
}

interface AppleMusicPage {
  data?: AppleMusicTrack[];
  next?: string;
}

interface ListTracksOptions {
  limit?: number;
}

interface RotationTrack {
  artist: string;
  artworkUrl?: string;
  id: string;
  name: string;
  url?: string;
}

let cachedDeveloperToken: CachedDeveloperToken | null = null;

function getCredentials(): Credentials {
  const keyId = import.meta.env.APPLE_MUSIC_KEY_ID;
  const privateKey = import.meta.env.APPLE_MUSIC_PRIVATE_KEY;
  const teamId = import.meta.env.APPLE_MUSIC_TEAM_ID;
  const userToken = import.meta.env.APPLE_MUSIC_USER_TOKEN;

  if (!(keyId && privateKey && teamId)) {
    throw new Error(
      "Missing Apple Music credentials: APPLE_MUSIC_KEY_ID, APPLE_MUSIC_PRIVATE_KEY, or APPLE_MUSIC_TEAM_ID.",
    );
  }

  if (!userToken || userToken === "dummy") {
    throw new Error("Missing APPLE_MUSIC_USER_TOKEN. Run the auth page first.");
  }

  return { keyId, privateKey, teamId, userToken };
}

async function getDeveloperToken(credentials: Credentials): Promise<string> {
  const now = Math.floor(Date.now() / MILLISECONDS_PER_SECOND);

  if (cachedDeveloperToken && now < cachedDeveloperToken.expiresAt - TOKEN_REFRESH_BUFFER_SECONDS) {
    return cachedDeveloperToken.token;
  }

  const privateKey = await importPKCS8(credentials.privateKey, "ES256");
  const token = await new SignJWT()
    .setProtectedHeader({ alg: "ES256", kid: credentials.keyId })
    .setIssuer(credentials.teamId)
    .setIssuedAt(now)
    .setExpirationTime(now + TOKEN_LIFETIME_SECONDS)
    .sign(privateKey);

  cachedDeveloperToken = {
    expiresAt: now + TOKEN_LIFETIME_SECONDS,
    token,
  };

  return token;
}

export class MusicKit {
  private readonly credentials = getCredentials();

  readonly rotation = {
    tracks: {
      list: async (options: ListTracksOptions = {}): Promise<RotationTrack[]> =>
        this.listRotationTracks(options),
    },
  };

  private async listRotationTracks(options: ListTracksOptions): Promise<RotationTrack[]> {
    const limit = options.limit ?? DEFAULT_TRACK_LIMIT;
    const tracks: RotationTrack[] = [];
    let nextPath: string | null = `/v1/me/recent/played/tracks?limit=${limit}`;

    while (nextPath) {
      const page = await this.request(nextPath);
      const pageTracks = page.data ?? [];

      if (pageTracks.length === 0) {
        break;
      }

      for (const track of pageTracks) {
        const { artistName, artwork, name, url } = track.attributes;

        const artworkUrl = artwork?.url
          ?.replace(/\{w\}/gu, String(ARTWORK_SIZE))
          .replace(/\{h\}/gu, String(ARTWORK_SIZE));

        tracks.push({
          artist: artistName,
          artworkUrl,
          id: track.id,
          name,
          url,
        });
      }

      nextPath = page.next ?? null;
    }

    return tracks;
  }

  private async request(path: string): Promise<AppleMusicPage> {
    const developerToken = await getDeveloperToken(this.credentials);

    const response = await fetch(new URL(path, API_BASE_URL), {
      headers: {
        Authorization: `Bearer ${developerToken}`,
        "Music-User-Token": this.credentials.userToken,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Apple Music API request failed with ${response.status}: ${message}`);
    }

    return (await response.json()) as AppleMusicPage;
  }
}

export type { RotationTrack };
