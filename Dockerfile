FROM debian:latest

# Install npm in order to obtain Vue & dependencies:
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - ; \
    apt-get install -y nodejs

# Install simple http server for serving static content:
RUN npm install -g http-server

# Make the 'app' folder the working dir
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' (if available):
COPY package*.json ./

# Install project dependencies:
RUN npm install

# Copy project files and folders to the current workdir:
COPY . .

# Build the app for 'production' with minification:
RUN npm run build

# For port binding, TBD around runtime, but container port will never change:
EXPOSE 8080

# Run itt:
CMD ['http-server', 'dist']