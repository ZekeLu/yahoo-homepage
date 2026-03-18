import type { Metric } from 'web-vitals';

export function reportWebVitals(metric: Metric): void {
  // Log Core Web Vitals to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value);
  }

  // In production, send to your analytics endpoint
  // Example: navigator.sendBeacon('/api/vitals', JSON.stringify(metric));
}
