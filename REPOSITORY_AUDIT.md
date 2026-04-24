# Repository Audit: Pardeep Hospital (Step-by-Step)

## 1) Project Type and Architecture
- Framework: **Next.js App Router** with TypeScript + React.
- The app uses route folders under `app/` for public pages, patient pages, and admin pages.
- There is no backend service implementation in this repository (no API routes, no server actions, no DB layer).

## 2) What Is Actually Implemented Today

### UI and Navigation
- Public landing, departments, doctors, events, queue, pharmacy, login pages exist.
- Admin dashboard pages exist (patients, doctors, appointments, queue, pharmacy, reports, settings, users, notifications).
- Layout wrappers and sidebars are implemented for normal and admin experiences.

### Data Handling
- Most data is **mock/static in local TypeScript files**, especially `data/admin.ts`.
- This means dashboards currently simulate hospital data but do not persist real records.

### State Management
- React local state and context are used for UI state.
- Admin role state is driven by a React Context provider.

## 3) Dependency Usage Review (Used vs Not Used)

### Core dependencies currently used
- `next`, `react`, `lucide-react` are actively imported across pages/components.
- `tailwindcss` is used for styling setup.

### Dependencies declared but not used in app code
- `framer-motion` (installed but no imports).
- `clsx` (installed but no imports).
- `tailwind-merge` (installed but no imports).

### Potential issue
- `hooks/useAdminRole.ts` imports `zustand`, but `zustand` is not in `package.json`.
- This hook appears unused, so app does not currently break from it, but it is dead/risky code.

## 4) API Audit (What type of APIs are used)
- **No internal API routes** found (no `app/api/**/route.ts`).
- **No external REST/GraphQL API integrations** found (no `fetch`, `axios`, SDK clients).
- Current app behaves as a **frontend prototype with static data**.

## 5) What Is Used vs Not Used (Feature-Level)

### Used now
- Multi-page UI/UX flow.
- Admin UI sections for operations.
- Mock analytics/charts-like widgets and lists.

### Not used / not implemented yet
- Real authentication/authorization backend.
- Real patient/doctor/appointment CRUD APIs.
- Real queue engine (live token state is mocked).
- Real pharmacy inventory and billing workflows.
- Payment processing.
- Notifications infrastructure (SMS/WhatsApp/email/push).
- Audit logs/compliance pipeline.
- File/document management for reports and prescriptions.

## 6) Paid Tools/APIs Recommended to Make It Production-Worthy

### A) Identity & Access
- Use **Clerk** or **Auth0** (or AWS Cognito) for secure auth, session handling, RBAC, MFA.
- Why: hospital admin access is sensitive; building auth correctly from scratch is costly.

### B) Database + ORM + Backups
- Use **PostgreSQL** on managed infra (Supabase, Neon, RDS, Cloud SQL) + Prisma/Drizzle.
- Why: persistent records, relational integrity, audit-ready schema.

### C) Transactional Messaging
- **SMS/OTP**: Twilio / MSG91 / Gupshup.
- **WhatsApp**: Meta WhatsApp Business API providers (Twilio, Interakt, Gupshup).
- **Email**: Postmark / SendGrid / Resend.
- Why: appointment reminders, queue alerts, prescription-ready messages.

### D) File Storage + Security
- Use **AWS S3 / Cloudflare R2 / GCP Storage** for reports/prescriptions.
- Add signed URLs, lifecycle rules, encryption at rest.

### E) Observability + Error Tracking
- **Sentry** for frontend/backend errors.
- **Datadog/New Relic/Grafana Cloud** for uptime, APM, infra metrics.
- Why: detect failures before they impact patients.

### F) Analytics/Product Intelligence
- **PostHog / Mixpanel / GA4** for user funnels and conversion analytics.
- Why: improve booking completion and reduce queue drop-offs.

### G) Payments (if booking/prepay needed)
- India-focused: **Razorpay / Cashfree**.
- Global: **Stripe**.
- Why: online consultation payments, deposits, pharmacy checkout.

### H) Compliance & Security Add-ons
- Secrets manager (AWS/GCP/Vault).
- WAF/CDN (Cloudflare/AWS).
- Optional SIEM/SOC tooling depending on scale.

## 7) Priority Roadmap (Practical Next Steps)
1. Replace static `data/*.ts` with real DB models + API routes.
2. Add auth + role-based permissions (admin/doctor/pharmacist/reception).
3. Implement appointments + queue + patient records CRUD.
4. Add messaging integrations for reminders and queue tokens.
5. Add audit logs, backups, and monitoring.
6. Add billing/payments if required.

## 8) Quick ROI Guidance
- Short-term ROI: reminders + queue notifications + online booking.
- Mid-term ROI: pharmacy digitization + staff workflow automation.
- Long-term ROI: reporting, analytics, retention and no-show reduction.
