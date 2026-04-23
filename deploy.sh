#!/bin/bash

set -e

SERVER_USER="ubuntu"
SERVER_HOST="54.210.244.233"
SSH_KEY="$HOME/Desktop/LightsailDefaultKey-us-east-1.pem"
REMOTE_DIR="/home/ubuntu/340b-demo"

echo "Building..."
cd project && npm run build && cd ..

echo "Syncing to $SERVER_HOST..."
rsync -az --delete -e "ssh -i $SSH_KEY" \
  project/dist/ "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/dist/"

rsync -az -e "ssh -i $SSH_KEY" \
  docker-compose.yml project/Caddyfile \
  "$SERVER_USER@$SERVER_HOST:$REMOTE_DIR/"

echo "Restarting container..."
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" \
  "cd $REMOTE_DIR && docker compose up -d"

echo "Done! Site is live."
