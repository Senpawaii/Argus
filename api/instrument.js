import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN, // empty => SDK disabled
  tracesSampleRate: 1.0,
  environment: 'local',
  release: 'argus-api@0.1.0',
});
