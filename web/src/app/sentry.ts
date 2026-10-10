import * as Sentry from '@sentry/angular';

export interface RuntimeConfig {
  sentryDsn?: string;
}

/** Loads public/runtime-config.json (gitignored). Missing file => Sentry disabled. */
export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    const res = await fetch('/runtime-config.json');
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return {};
    return await res.json();
  } catch {
    return {};
  }
}

export function initSentry(config: RuntimeConfig): void {
  if (!config.sentryDsn) {
    console.warn('[argus] No sentryDsn in runtime-config.json - Sentry disabled');
    return;
  }
  Sentry.init({
    dsn: config.sentryDsn,
    environment: 'local',
    release: 'argus-web@0.1.0',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({ colorScheme: 'system' }),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['localhost', /^\/api\//],
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  });
}
