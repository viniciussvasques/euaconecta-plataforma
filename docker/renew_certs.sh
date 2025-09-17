#!/usr/bin/env bash
set -euo pipefail
cd /opt/euaconecta-plataforma/docker
/usr/bin/docker run --rm --network host \
  -v $(pwd)/letsencrypt:/etc/letsencrypt \
  -v $(pwd)/www:/var/www/certbot \
  certbot/certbot:latest renew --quiet || exit 0
/usr/bin/docker-compose -f /opt/euaconecta-plataforma/docker/docker-compose.yml exec -T nginx nginx -s reload || true
