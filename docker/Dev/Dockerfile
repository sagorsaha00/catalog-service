# Use the base Node.js image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including dev dependencies
RUN npm install

# Optionally, install nodemon globally (if you want to run it directly)
RUN npm install -g nodemon

# Copy the application code
COPY . .

# Expose the required port
EXPOSE 5500

# Default command
CMD ["npm", "run", "dev"]
