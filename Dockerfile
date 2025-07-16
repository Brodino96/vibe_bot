
# Use the official Bun image as a base
FROM oven/bun:1

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and bun.lockb
COPY package.json bun.lockb tsconfig.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Run the bot
CMD ["bun", "src/index.ts"]
