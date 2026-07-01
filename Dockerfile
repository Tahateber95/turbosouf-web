# ── Stage 1: Dependencies ─────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_API_URL=https://api.turbo-souf.com
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51PFv4YHobNL4f3GiDiQxFKcMygJwP01TRr5YoKUk1MRs0ZdapK7Hi3DCvsilIbnvRhUxe4r2PoJvupJvMNi15wcp00vYKxyAdZ
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Run ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
