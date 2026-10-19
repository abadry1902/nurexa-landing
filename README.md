# Nurexa Digital Solutions

Arabic-first AI SaaS landing page for Nurexa Digital Solutions.

Live site: https://nurexa-business-ai.a-badry1902.chatgpt.site

React, TypeScript, Tailwind CSS, Vinext and Cloudflare D1. Includes a signup wizard, guided chat, customer journey video, and animated green/blue halos.

## Development

Requires Node.js >=22.13.0.

```sh
npm run install:ci
npm run dev
npm run build
```

The backend requires a Cloudflare D1 binding named `DB` and the included Drizzle migrations. The chat is a guided demo; an external AI provider is not configured. Submissions save contact/demo requests rather than confirmed calendar bookings.

See the source's Sites configuration and build scripts for the hosting integration. Production lead data and credentials are not included.
