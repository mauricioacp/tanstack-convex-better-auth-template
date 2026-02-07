import { useCallback, useEffect, useRef, useState } from "react";

export function useCountdown() {
	const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clear = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const start = useCallback(
		(seconds: number) => {
			clear();
			setSecondsLeft(seconds);
			intervalRef.current = setInterval(() => {
				setSecondsLeft((prev) => {
					if (prev === null || prev <= 0) {
						clear();
						return null;
					}
					return prev - 1;
				});
			}, 1000);
		},
		[clear],
	);

	useEffect(() => clear, [clear]);

	return { secondsLeft, start };
}
