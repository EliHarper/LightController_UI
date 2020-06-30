FROM debian:latest

# Install npm in order to obtain Vue & dependencies:
RUN apt update && apt upgrade ; \
    apt install -y apt-utils curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - ; \
    apt-get install -y nodejs npm && \
    npm i npm@latest -g

# Install simple http server for serving static content:
RUN npm install -g http-server

# Make the 'app' folder the working dir
WORKDIR /app

# Copy 'package.json' and 'package-lock.json' (if available):
COPY package*.json ./

# Copy environment variables in:
# COPY .env ./

# Install project dependencies:
RUN npm install

# Copy project files and folders to the current workdir:
COPY . .

# For port binding, TBD around runtime, but container port will never change:
EXPOSE 8080

# Aight, run itt:
CMD ["npm", "run", "serve"]