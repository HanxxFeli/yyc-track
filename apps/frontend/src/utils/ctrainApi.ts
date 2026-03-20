/**
 * src/utils/ctrainApi.ts
 *
 * API client for the YYC Track Azure Functions.
 * Handles all communication between the frontend and the live
 * CTrain GTFS-RT data endpoints.
 *
 * Base URL is set via VITE_AZURE_FUNCTIONS_URL in your .env file.
 * Falls back to localhost:7071 for local development.
 *
 * Usage:
 *   import { fetchCombinedFeed, fetchVehicles, fetchServiceAlerts } from "@/utils/ctrainApi";
 */

const BASE_URL: string =
    (import.meta.env.VITE_AZURE_FUNCTIONS_URL as string) ??
    "http://localhost:7071/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FeedMeta {
    timestamp?: number;
    fetchedAt: string;
    incrementality?: string;
    cacheHits?: number;
    feedsTotal?: number;
    feedsSucceeded?: number;
}

export interface CTrainVehicle {
    vehicleId: string;
    label: string;
    routeId: string;            // "201" | "202"
    routeName: string;          // "Red Line" | "Blue Line"
    tripId: string;
    directionId: number;        // 0 = outbound, 1 = inbound
    latitude: number;
    longitude: number;
    bearing?: number;           // compass degrees, 0 = north
    speed?: number;             // metres per second — use msToKmh() to convert
    currentStopSequence?: number;
    currentStatus?: "INCOMING_AT" | "STOPPED_AT" | "IN_TRANSIT_TO";
    stopId?: string;            // ID of the next stop
    timestamp?: number;         // Unix epoch seconds
}

export interface StopTimeUpdate {
    stopSequence?: number;
    stopId: string;
    arrival?: ArrivalDeparture;
    departure?: ArrivalDeparture;
    scheduleRelationship?: "SCHEDULED" | "SKIPPED" | "NO_DATA";
}

export interface ArrivalDeparture {
    delay?: number;   // seconds behind schedule (negative = early)
    time?: number;    // Unix epoch seconds
    uncertainty?: number;
}

export interface CTrainTripUpdate {
    tripId: string;
    routeId: string;
    routeName: string;
    directionId?: number;
    startTime?: string;         // "HH:MM:SS"
    startDate?: string;         // "YYYYMMDD"
    scheduleRelationship?: "SCHEDULED" | "ADDED" | "UNSCHEDULED" | "CANCELED";
    vehicleId?: string;
    stopTimeUpdates: StopTimeUpdate[];
}

export interface CTrainServiceAlert {
    alertId: string;
    effect?: string;            // "NO_SERVICE" | "REDUCED_SERVICE" | "SIGNIFICANT_DELAYS" etc.
    cause?: string;             // "CONSTRUCTION" | "ACCIDENT" | "WEATHER" etc.
    severityLevel?: "INFO" | "WARNING" | "SEVERE" | "UNKNOWN_SEVERITY";
    activePeriods: { start?: number; end?: number }[];
    informedEntities: {
        routeId?: string;
        routeType?: number;
        stopId?: string;
        tripId?: string;
        directionId?: number;
    }[];
    headerText?: string;
    descriptionText?: string;
    url?: string;
}

export interface CTrainStop {
    stopId: string;
    name: string;
    latitude: number;
    longitude: number;
    routeIds: string[];
}

export interface CombinedFeedResponse {
    meta: FeedMeta;
    vehicles: CTrainVehicle[];
    trips: CTrainTripUpdate[];
    alerts: CTrainServiceAlert[];
}

export interface VehiclesResponse {
    meta: FeedMeta;
    vehicles: CTrainVehicle[];
}

export interface TripsResponse {
    meta: FeedMeta;
    trips: CTrainTripUpdate[];
}

export interface AlertsResponse {
    meta: FeedMeta;
    count: number;
    alerts: CTrainServiceAlert[];
}

export interface StopsResponse {
    stops: CTrainStop[];
}

type RouteFilter = "201" | "202";

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
    const url = `${BASE_URL}${path}`;

    const response = await fetch(url, {
        headers: { Accept: "application/json" },
    });

    if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`CTrain API error ${response.status} at ${url}: ${body}`);
    }

    return response.json() as Promise<T>;
}

// ─── Public API functions ─────────────────────────────────────────────────────

/**
 * Fetches all three feeds (vehicles, trips, alerts) in one request.
 * Use this for initial page load to minimise round-trips.
 *
 * @param route - Optional: "201" (Red Line) or "202" (Blue Line)
 */
export async function fetchCombinedFeed(
    route?: RouteFilter
): Promise<CombinedFeedResponse> {
    const qs = route ? `?route=${route}` : "";
    return apiFetch<CombinedFeedResponse>(`/ctrain/feed${qs}`);
}

/**
 * Fetches live GPS positions of all active CTrain vehicles.
 *
 * @param route - Optional: "201" or "202"
 */
export async function fetchVehicles(
    route?: RouteFilter
): Promise<VehiclesResponse> {
    const qs = route ? `?route=${route}` : "";
    return apiFetch<VehiclesResponse>(`/ctrain/vehicles${qs}`);
}

/**
 * Fetches real-time trip updates — delays, cancellations, predictions.
 *
 * @param route  - Optional: "201" or "202"
 * @param stopId - Optional: filter to a specific stop (e.g. "9066" for City Hall)
 */
export async function fetchTripUpdates(
    route?: RouteFilter,
    stopId?: string
): Promise<TripsResponse> {
    const params = new URLSearchParams();

    if (route) params.set("route", route);
    if (stopId) params.set("stopId", stopId);

    const qs = params.toString() ? `?${params.toString()}` : "";
    
    return apiFetch<TripsResponse>(`/ctrain/trips${qs}`);
}

/**
 * Fetches active service alerts affecting CTrain.
 *
 * @param route  - Optional: "201" or "202"
 * @param active - Default true — only return currently active alerts
 */
export async function fetchServiceAlerts(
    route?: RouteFilter,
    active = true
): Promise<AlertsResponse> {
    const params = new URLSearchParams();

    if (route) params.set("route", route);
    params.set("active", String(active));

    return apiFetch<AlertsResponse>(`/ctrain/alerts?${params.toString()}`);
}

/**
 * Fetches all CTrain station coordinates for map pinning.
 * Static data cached for 24 hours — call once on app load.
 * Requires ctrainStops.ts to be added to the Azure Functions repo first.
 *
 * @param route - Optional: "201" or "202"
 */
export async function fetchStops(route?: RouteFilter): Promise<StopsResponse> {
    const qs = route ? `?route=${route}` : "";
    return apiFetch<StopsResponse>(`/ctrain/stops${qs}`);
}

// ─── Utility helpers ──────────────────────────────────────────────────────────

/**
 * Converts a GTFS-RT Unix timestamp (seconds) to a readable local time string.
 * e.g. 1717200000 → "3:20 PM"
 */
export function formatGtfsTime(unixSeconds: number): string {
    return new Date(unixSeconds * 1000).toLocaleTimeString("en-CA", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

/**
 * Converts a delay in seconds to a human-readable string.
 * e.g. 120 → "+2 min late" | -60 → "1 min early" | 0 → "On time"
 */
export function formatDelay(delaySeconds: number | undefined): string {
    if (delaySeconds === undefined || delaySeconds === null) return "On time";

    const minutes = Math.round(delaySeconds / 60);

    if (minutes === 0) return "On time";

    return minutes > 0
        ? `+${minutes} min late`
        : `${Math.abs(minutes)} min early`;
}

/**
 * Converts speed from m/s (GTFS unit) to km/h for display.
 */
export function msToKmh(metersPerSecond: number): number {
    return Math.round(metersPerSecond * 3.6);
}

/**
 * Returns the next upcoming arrival or departure for a trip at a given stop.
 */
export function getNextArrival(
    trip: CTrainTripUpdate,
    stopId: string
): ArrivalDeparture | undefined {
    const stu = trip.stopTimeUpdates.find((s) => s.stopId === stopId);
    return stu?.arrival ?? stu?.departure;
}