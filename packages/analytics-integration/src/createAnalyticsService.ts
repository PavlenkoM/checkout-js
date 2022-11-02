export default function createAnalyticsService<T>(createFn: (args?: any) => T, createArguments: any[] = []) {
    let analyticsTracker: T;

    return () => {
        if (analyticsTracker) {
            return analyticsTracker;
        }

        analyticsTracker = createFn(...createArguments);
        return analyticsTracker;
    };
}
