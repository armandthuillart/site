import { importPKCS8, SignJWT } from "jose";

const KEY_ID = import.meta.env.APPLE_MUSIC_KEY_ID;
const TEAM_ID = import.meta.env.APPLE_MUSIC_TEAM_ID;
const USER_TOKEN = import.meta.env.APPLE_MUSIC_USER_TOKEN;
const PRIVATE_KEY = import.meta.env.APPLE_MUSIC_PRIVATE_KEY;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getDeveloperToken(): Promise<string> {
	const now = Math.floor(Date.now() / 1000);

	if (cachedToken && tokenExpiry && now < tokenExpiry - 60) {
		return cachedToken;
	}

	if (!(PRIVATE_KEY && KEY_ID && TEAM_ID)) {
		throw new Error(
			"Missing Apple Music credentials (PRIVATE_KEY, KEY_ID, or TEAM_ID)",
		);
	}

	const key = await importPKCS8(PRIVATE_KEY, "ES256");
	const expiresIn = 15_777_000; // 6 months

	const jwt = await new SignJWT()
		.setProtectedHeader({ alg: "ES256", kid: KEY_ID })
		.setIssuer(TEAM_ID)
		.setIssuedAt(now)
		.setExpirationTime(now + expiresIn)
		.sign(key);

	cachedToken = jwt;
	tokenExpiry = now + expiresIn;

	return jwt;
}

export function getUserToken(): string {
	if (!USER_TOKEN || USER_TOKEN === "dummy") {
		throw new Error("Missing APPLE_MUSIC_USER_TOKEN. Run the auth page first.");
	}
	return USER_TOKEN;
}

interface AppleMusicTrack {
	attributes: {
		name: string;
		artistName: string;
		albumName: string;
		artwork?: {
			url: string;
			width: number;
			height: number;
		};
		url?: string;
	};
	id: string;
}

interface ArtistCount {
	count: number;
	name: string;
}

interface TrackCount {
	artist: string;
	count: number;
	name: string;
}

async function fetchRecentlyPlayedTracks(
	developerToken: string,
	userToken: string,
): Promise<AppleMusicTrack[]> {
	const tracks: AppleMusicTrack[] = [];
	let offset = 0;
	const limit = 25; // max per request for this endpoint

	while (true) {
		const res = await fetch(
			`https://api.music.apple.com/v1/me/recent/played/tracks?limit=${limit}&offset=${offset}`,
			{
				headers: {
					Authorization: `Bearer ${developerToken}`,
					"Music-User-Token": userToken,
				},
			},
		);

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Apple Music API error ${res.status}: ${text}`);
		}

		const data = await res.json();
		const items = data.data ?? [];
		tracks.push(...items);

		if (!data.next || items.length < limit) {
			break;
		}
		offset += limit;
	}

	return tracks;
}

export async function getListeningStats() {
	const developerToken = await getDeveloperToken();
	const userToken = getUserToken();
	const tracks = await fetchRecentlyPlayedTracks(developerToken, userToken);

	// Count artist frequency across recent listening history
	const artistMap = new Map<string, number>();
	for (const track of tracks) {
		const artist = track.attributes.artistName;
		artistMap.set(artist, (artistMap.get(artist) ?? 0) + 1);
	}

	const topArtists: ArtistCount[] = [...artistMap.entries()]
		.map(([name, count]) => ({ count, name }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	// Count track frequency (replayed songs rank higher)
	const trackMap = new Map<string, { artist: string; count: number }>();
	for (const track of tracks) {
		const key = `${track.attributes.name}::${track.attributes.artistName}`;
		const existing = trackMap.get(key);
		if (existing) {
			existing.count++;
		} else {
			trackMap.set(key, { artist: track.attributes.artistName, count: 1 });
		}
	}

	const topTracks: TrackCount[] = [...trackMap.entries()]
		.map(([key, val]) => ({
			artist: val.artist,
			count: val.count,
			name: key.split("::")[0],
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	return { topArtists, topTracks, totalTracks: tracks.length };
}
