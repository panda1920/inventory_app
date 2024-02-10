FROM node:18-alpine AS base
# content copied from:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker-multi-env/docker/production/Dockerfile

# 1. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT 3000
# ENV HOSTNAME localhost

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001 -G nodejs

COPY ./public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs ./.next/standalone ./
COPY --chown=nextjs:nodejs ./.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
