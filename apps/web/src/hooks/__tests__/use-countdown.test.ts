import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useCountdown } from "../use-countdown";

describe("useCountdown", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should return null when inactive", () => {
		const { result } = renderHook(() => useCountdown());
		expect(result.current.secondsLeft).toBeNull();
	});

	it("should count down from N to 0", () => {
		const { result } = renderHook(() => useCountdown());

		act(() => {
			result.current.start(3);
		});

		expect(result.current.secondsLeft).toBe(3);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.secondsLeft).toBe(2);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.secondsLeft).toBe(1);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.secondsLeft).toBe(0);
	});

	it("should return null after countdown finishes", () => {
		const { result } = renderHook(() => useCountdown());

		act(() => {
			result.current.start(1);
		});

		expect(result.current.secondsLeft).toBe(1);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.secondsLeft).toBe(0);

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.secondsLeft).toBeNull();
	});

	it("should reset when start is called again", () => {
		const { result } = renderHook(() => useCountdown());

		act(() => {
			result.current.start(5);
		});

		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(result.current.secondsLeft).toBe(3);

		act(() => {
			result.current.start(10);
		});
		expect(result.current.secondsLeft).toBe(10);
	});

	it("should clean up interval on unmount", () => {
		const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
		const { result, unmount } = renderHook(() => useCountdown());

		act(() => {
			result.current.start(5);
		});

		unmount();
		expect(clearIntervalSpy).toHaveBeenCalled();
		clearIntervalSpy.mockRestore();
	});
});
