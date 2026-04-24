#!/bin/bash

set -e

SERVER_USER="ubuntu"
SERVER_HOST="54.210.244.233"
SSH_KEY="$HOME/Desktop/LightsailDefaultKey-us-east-1.pem"
REMOTE_DIR="/home/ubuntu/340b-demo"

echo "Syncing source to $SERVER_HOST..."
rsync -az --delete -e "ssh -i $SSH_KEY" \
  --exclude='node_modules' --exclude='dist' \
  project/ "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/project/"

rsync -az -e "ssh -i $SSH_KEY" \
  docker-compose.yml Dockerfile \
  "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/"

echo "Building and restarting on server..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" \
  "cd $REMOTE_DIR && docker compose up -d --build"

echo "Done! Site is live."
