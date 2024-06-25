export function throttle<T extends (...args: any[]) => void>(func: T, delay: number): T {
	let lastCall = 0;
	let timeoutId: ReturnType<typeof setTimeout> | undefined;

	return function (this: any, ...args: Parameters<T>) {
		const now = new Date().getTime();

		if (now - lastCall < delay) {
			if (timeoutId) clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				lastCall = now;
				func.apply(this, args);
			}, delay - (now - lastCall));
		} else {
			lastCall = now;
			func.apply(this, args);
		}
	} as T;
}
