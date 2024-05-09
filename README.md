## Development
1.  `npm run npm-dev` or `bun run bun-dev`
2.  load `BiliBiliConfig.json` into Grayjay

## TO-DO
- [ ]   check that share urls/uris work and share into the spotify app
- [ ]   an entire podcast has a rating. maybe give the episode the podcast rating use this to load it https://api-partner.spotify.com/pathfinder/v1/query?operationName=queryShowMetadataV2&variables=%7B%22uri%22%3A%22spotify%3Ashow%3A5VzFvh1JlEhBMS6ZHZ8CNO%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%225fb034a236a3e8301e9eca0e23def3341ed66c891ea2d4fea374c091dc4b4a6a%22%7D%7D
- [ ]   there is data about the number of people following a podcast somewhere that shows up in the mobile app
- [ ]   test the logged out version of the plugin
- [ ]   music video support (not available in the us)
- [ ]   video podcast support (requires a better websocket api)
- [ ]   support offline playback
- [ ]   similar to bilibili i think we need to add id prefixes or suffixes because there could be collision
- [ ]   add search support
- [ ]   add user playlists and follows support
- [ ]   add playback tracking support
- [ ]   add offline playback for widevine support

## Grayjay Bugs
- [ ]   RatingScaler doesn't work
- [ ]   websockets are hard to use
- [ ]   datetime doesn't display for playlists
- [ ]   there is no way to get to the creator of a playlist
- [ ]   the pager that goes in the contents property of a playlist doesn't ever call the nextPage method
- [ ]   the channel about section doesn't render HTML