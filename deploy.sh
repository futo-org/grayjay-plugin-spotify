#!/bin/sh
DOCUMENT_ROOT=/var/www/sources

# Take site offline
echo "Taking site offline..."
touch $DOCUMENT_ROOT/maintenance.file

# Swap over the content
echo "Deploying content..."
mkdir -p $DOCUMENT_ROOT/Spotify
cp build/SpotifyIcon.png $DOCUMENT_ROOT/Spotify
cp build/SpotifyConfig.json $DOCUMENT_ROOT/Spotify
cp build/SpotifyScript.js $DOCUMENT_ROOT/Spotify
sh sign.sh $DOCUMENT_ROOT/Spotify/SpotifyScript.js $DOCUMENT_ROOT/Spotify/SpotifyConfig.json

# Notify Cloudflare to wipe the CDN cache
echo "Purging Cloudflare cache for zone $CLOUDFLARE_ZONE_ID..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"files":["https://plugins.grayjay.app/Spotify/SpotifyIcon.png", "https://plugins.grayjay.app/Spotify/SpotifyConfig.json", "https://plugins.grayjay.app/Spotify/SpotifyScript.js"]}'

# Take site back online 
echo "Bringing site back online..."
rm $DOCUMENT_ROOT/maintenance.file