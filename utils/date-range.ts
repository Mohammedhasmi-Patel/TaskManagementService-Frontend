export const DATE_FILTER_PRESETS = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom" },
] as const;

export type DateFilterPreset = (typeof DATE_FILTER_PRESETS)[number]["value"];

export interface DateRangeBounds {
    fromDate?: string;
    toDate?: string;
}

export function getDateRangeBounds(
    preset: DateFilterPreset,
    customFrom?: string,
    customTo?: string
): DateRangeBounds {
    if (preset === "all") {
        return {};
    }

    if (preset === "custom") {
        const bounds: DateRangeBounds = {};
        if (customFrom) {
            const [y, m, d] = customFrom.split("-").map(Number);
            if (y && m && d) {
                bounds.fromDate = new Date(y, m - 1, d, 0, 0, 0, 0).toISOString();
            }
        }
        if (customTo) {
            const [y, m, d] = customTo.split("-").map(Number);
            if (y && m && d) {
                bounds.toDate = new Date(y, m - 1, d, 23, 59, 59, 999).toISOString();
            }
        }
        return bounds;
    }

    const now = new Date();

    if (preset === "today") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return { fromDate: start.toISOString(), toDate: end.toISOString() };
    }

    if (preset === "week") {
        const dayOffset = (now.getDay() + 6) % 7; // Monday as start of week
        const start = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - dayOffset,
            0,
            0,
            0,
            0
        );
        const end = new Date(
            start.getFullYear(),
            start.getMonth(),
            start.getDate() + 6,
            23,
            59,
            59,
            999
        );
        return { fromDate: start.toISOString(), toDate: end.toISOString() };
    }

    if (preset === "month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { fromDate: start.toISOString(), toDate: end.toISOString() };
    }

    if (preset === "year") {
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { fromDate: start.toISOString(), toDate: end.toISOString() };
    }

    return {};
}

