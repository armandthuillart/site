type Response<T> =
	| {
			data: T;
			error: null;
	  }
	| {
			data: null;
			error: Error;
	  };

function normalize(error: unknown): Error {
	if (error instanceof Error) {
		return error;
	}
	return new Error(String(error));
}

export async function tryCatch<T>(promise: Promise<T>): Promise<Response<T>> {
	try {
		return {
			data: await promise,
			error: null,
		};
	} catch (error: unknown) {
		return {
			data: null,
			error: normalize(error),
		};
	}
}
