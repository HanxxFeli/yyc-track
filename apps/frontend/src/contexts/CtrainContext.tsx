/**
 * src/contexts/CTrainContext.tsx
 *
 * React context that holds all live CTrain data and polls the Azure
 * Functions every 30 seconds — matching Calgary Transit's GTFS-RT
 * update frequency.
 *
 * Follows the same pattern as AuthContext.jsx so it fits naturally
 * into the existing app structure.
 *
 * Usage:
 *   import { useCTrain } from "@/contexts/CTrainContext";
 *
 *   function CalgaryMap() {
 *     const { vehicles, alerts, loading, error } = useCTrain();
 *   }
 */

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";

import {
    fetchCombinedFeed,
    CTrainVehicle,
    CTrainTripUpdate,
    CTrainServiceAlert,
    FeedMeta,
} from "../utils/ctrainApi";

// ─── Context shape ────────────────────────────────────────────────────────────

interface CTrainContextValue {
    // Raw data from the API
    vehicles: CTrainVehicle[];
    trips: CTrainTripUpdate[];
    alerts: CTrainServiceAlert[];
    meta: FeedMeta | null;

    // Derived — pre-filtered so components don't have to filter themselves
    redLineVehicles: CTrainVehicle[];       // route 201 only
    blueLineVehicles: CTrainVehicle[];      // route 202 only
    criticalAlerts: CTrainServiceAlert[];   // WARNING or SEVERE only

    // Whether any trips are currently cancelled
    hasCancellations: boolean;

    // State
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;

    // Call this to force an immediate re-fetch without waiting for the next poll
    refresh: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CTrainContext = createContext<CTrainContextValue | null>(null);

// ─── Provider props ───────────────────────────────────────────────────────────

interface CTrainProviderProps {
    children: ReactNode;
    
    /** Optional: "201" or "202" — filters all data to one line */
    route?: "201" | "202";
    
    /** Polling interval in ms. Default: 30000 (matches Calgary Transit's 30s update) */
    pollInterval?: number;
    
    /** Set to false to pause polling, e.g. when the map tab is not visible */
    enabled?: boolean;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CTrainProvider({
    children,
    route,
    pollInterval = 30_000,
    enabled = true,
}: CTrainProviderProps) {
    const [vehicles, setVehicles] = useState<CTrainVehicle[]>([]);
    const [trips, setTrips] = useState<CTrainTripUpdate[]>([]);
    const [alerts, setAlerts] = useState<CTrainServiceAlert[]>([]);
    const [meta, setMeta] = useState<FeedMeta | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch ───────────────────────────────────────────────────────────────────
    async function loadFeed(): Promise<void> {
        try {
            const data = await fetchCombinedFeed(route);
            setVehicles(data.vehicles ?? []);
            setTrips(data.trips ?? []);
            setAlerts(data.alerts ?? []);
            setMeta(data.meta ?? null);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            // Keep showing existing data on transient errors — don't blank the map
            const message =
                err instanceof Error ? err.message : "Failed to load CTrain data";
            setError(message);
            console.error("[CTrainContext] fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    // ── Poll on mount, then every pollInterval ──────────────────────────────────
    useEffect(() => {
        if (!enabled) return;

        loadFeed();
        intervalRef.current = setInterval(loadFeed, pollInterval);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [route, pollInterval, enabled]);

    // ── Derived values ──────────────────────────────────────────────────────────
    const redLineVehicles = vehicles.filter((v) => v.routeId === "201");
    const blueLineVehicles = vehicles.filter((v) => v.routeId === "202");

    const criticalAlerts = alerts.filter(
        (a) => a.severityLevel === "SEVERE" || a.severityLevel === "WARNING"
    );

    const hasCancellations = trips.some(
        (t) => t.scheduleRelationship === "CANCELED"
    );

    // ── Context value ───────────────────────────────────────────────────────────
    const value: CTrainContextValue = {
        vehicles,
        trips,
        alerts,
        meta,
        redLineVehicles,
        blueLineVehicles,
        criticalAlerts,
        hasCancellations,
        loading,
        error,
        lastUpdated,
        refresh: loadFeed,
    };

    return (
        <CTrainContext.Provider value={value}>{children}</CTrainContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns live CTrain data from context.
 * Must be used inside a <CTrainProvider>.
 *
 * @throws if used outside of CTrainProvider
 */
export function useCTrain(): CTrainContextValue {
    const context = useContext(CTrainContext);
    if (!context) {
        throw new Error("useCTrain must be used inside a <CTrainProvider>");
    }
    return context;
}