FROM oven/bun
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
COPY src /app/src
COPY public /app/public
COPY tailwind.config.js /app/tailwind.config.js
RUN bun install
RUN bun run tailwind:build
COPY . .
EXPOSE 3000
ENTRYPOINT ["bun", "run", "start"]