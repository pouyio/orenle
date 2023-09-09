FROM oven/bun

# Create and set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install application dependencies
RUN bun install

# Copy the rest of the application source code to the container
COPY . .

# Expose a port that the application will listen on
EXPOSE 3000

# Define the command to run your application (replace "app.js" with your entry point)
CMD ["bun", "start"]