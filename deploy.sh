#!/bin/bash

set -e

DOMAIN=$1
EMAIL=$2
PROJECT=$3

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ] || [ -z "$PROJECT" ]; then
  echo "ERROR: DOMAIN, EMAIL, PROJECT required"
  exit 1
fi

echo "=================================="
echo "Setting up: $DOMAIN"
echo "Email: $EMAIL"
echo "Project: $PROJECT"
echo "=================================="



echo "Updating packages..."
apt update -y
apt upgrade -y

echo "Installing required packages..."
apt install -y \
  nginx \
  curl \
  gnupg \
  ca-certificates \
  ufw \
  sudo \
  certbot \
  python3-certbot-nginx

echo "Configuring firewall..."
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

rm -f /etc/nginx/sites-enabled/default

echo "Creating nginx log directory..."
mkdir -p /var/log/nginx/$DOMAIN

echo "Writing nginx HTTP config (NO SSL YET)..."

cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location / {
        return 200 "Nginx ready for SSL setup";
    }
}
EOF

echo "Enabling nginx site..."
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

nginx -t
systemctl restart nginx

echo "Requesting SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email $EMAIL

echo "Rewriting final nginx config with app proxy..."

cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    root projects/$PROJECT/client/dist;

    index index.html;

    access_log /var/log/nginx/$DOMAIN/access.log;
    error_log /var/log/nginx/$DOMAIN/error.log;

    location / {
        try_files \$uri /index.html;
    }
}


EOF

nginx -t
systemctl restart nginx

echo "DONE: https://$DOMAIN"

cd /$PROJECT

echo "Starting Docker services..."
docker compose -f /docker-compose.yaml build --no-cache
docker compose -f /docker-compose.yaml up -d


