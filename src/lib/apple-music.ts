// ⚠️ horrible
import { importPKCS8, SignJWT } from "jose";

const KEY_ID = import.meta.env.APPLE_MUSIC_KEY_ID;
const TEAM_ID = import.meta.env.APPLE_MUSIC_TEAM_ID;
const USER_TOKEN = import.meta.env.APPLE_MUSIC_USER_TOKEN;
const PRIVATE_KEY = import.meta.env.APPLE_MUSIC_PRIVATE_KEY;

const API_BASE = "https://api.music.apple.com";
const MS_PER_SECOND = 1000;
const TOKEN_REFRESH_MARGIN_SECONDS = 60;
const RECENT_TRACKS_LIMIT = 25;
const TOP_N = 10;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getDeveloperToken(): Promise<string> {
	const now = Math.floor(Date.now() / MS_PER_SECOND);

	if (
		cachedToken &&
		tokenExpiry &&
		now < tokenExpiry - TOKEN_REFRESH_MARGIN_SECONDS
	) {
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

function getUserToken(): string {
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
		artwork?: { url: string; width: number; height: number };
		url?: string;
	};
	id: string;
}

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

function resolveArtworkUrl(
	artwork: { url: string } | undefined,
	size = 64,
): string | undefined {
	if (!artwork?.url) {
		return;
	}
	return artwork.url
		.replace(/{w}/gu, String(size))
		.replace(/{h}/gu, String(size));
}

function fetchAllPages<T>(
	path: string,
	headers: Record<string, string>,
	limit: number,
): Promise<T[]> {
	async function fetchPage(offset: number): Promise<T[]> {
		const res = await fetch(
			`${API_BASE}${path}?limit=${limit}&offset=${offset}`,
			{ headers },
		);

		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Apple Music API error ${res.status}: ${text}`);
		}

		const data = await res.json();
		const page: T[] = data.data ?? [];

		if (!data.next || page.length < limit) {
			return page;
		}

		return [...page, ...(await fetchPage(offset + limit))];
	}

	return fetchPage(0);
}

function topN<T, V>(
	items: T[],
	keyFn: (item: T) => string,
	valueFn: (item: T) => V,
	n: number,
): (V & { count: number })[] {
	const map = new Map<string, V & { count: number }>();

	for (const item of items) {
		const key = keyFn(item);
		const existing = map.get(key);
		if (existing) {
			existing.count += 1;
		} else {
			map.set(key, { ...valueFn(item), count: 1 });
		}
	}

	return [...map.values()].sort((a, b) => b.count - a.count).slice(0, n);
}

export async function getListeningStats() {
	const developerToken = await getDeveloperToken();
	const userToken = getUserToken();
	const headers = {
		Authorization: `Bearer ${developerToken}`,
		"Music-User-Token": userToken,
	};

	const tracks = await fetchAllPages<AppleMusicTrack>(
		"/v1/me/recent/played/tracks",
		headers,
		RECENT_TRACKS_LIMIT,
	);

	const topArtists: ArtistCount[] = topN(
		tracks,
		(t) => t.attributes.artistName,
		(t) => ({
			artworkUrl: resolveArtworkUrl(t.attributes.artwork),
			name: t.attributes.artistName,
		}),
		TOP_N,
	);

	const topTracks: TrackCount[] = topN(
		tracks,
		(t) => `${t.attributes.name}::${t.attributes.artistName}`,
		(t) => ({
			artist: t.attributes.artistName,
			artworkUrl: resolveArtworkUrl(t.attributes.artwork),
			name: t.attributes.name,
			url: t.attributes.url,
		}),
		TOP_N,
	);

	return { topArtists, topTracks, totalTracks: tracks.length };
}
