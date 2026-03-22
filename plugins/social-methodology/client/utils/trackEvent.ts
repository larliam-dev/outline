import { client } from "~/utils/ApiClient";

/**
 * Tracks a Social Methodology learning event for analytics.
 * Fire-and-forget — errors are silently swallowed so tracking never
 * disrupts the user experience.
 *
 * @param event - Event name, e.g. "simulator.step", "case.submit".
 * @param data - Optional metadata associated with the event.
 */
export function trackEvent(
  event: string,
  data?: Record<string, unknown>
): void {
  void client.post("/methodology.track", { event, data });
}
