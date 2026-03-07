// ⚠️ horrible
import { getListeningStats } from "@/lib/apple-music.ts";
import { tryCatch } from "@/lib/utils";

export const prerender = false;

const MS_PER_SECOND = 1000;
const CACHE_TTL_MINUTES = 10;
const SECONDS_PER_MINUTE = 60;

const TTL_MS = CACHE_TTL_MINUTES * SECONDS_PER_MINUTE * MS_PER_SECOND;

let cache: {
	data: Awaited<ReturnType<typeof getListeningStats>>;
	expiry: number;
} | null = null;

export async function GET() {
	const now = Date.now();

	if (cache && now < cache.expiry) {
		return Response.json(cache.data);
	}

	const { data, error } = await tryCatch(getListeningStats());

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { "Content-Type": "application/json" },
			status: 500,
		});
	}

	cache = { data, expiry: now + TTL_MS };

	return Response.json(data);
}
