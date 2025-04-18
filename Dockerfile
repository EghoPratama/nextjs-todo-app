FROM node:18-bullseye

# Set environment variables
ENV PG_FORCE_NATIVE=false
ENV NODE_ENV=development
ENV NODE_OPTIONS=--openssl-legacy-provider

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3000

# Run dev server
CMD ["npm", "run", "dev"]
