## Development
1.  `npm run npm-dev` or `bun run bun-dev`
2.  load `SpotifyConfig.json` into Grayjay

## TO-DO
- [ ]   an entire podcast has a rating. maybe give the episode the podcast rating use this to load it https://api-partner.spotify.com/pathfinder/v1/query?operationName=queryShowMetadataV2&variables=%7B%22uri%22%3A%22spotify%3Ashow%3A5VzFvh1JlEhBMS6ZHZ8CNO%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%225fb034a236a3e8301e9eca0e23def3341ed66c891ea2d4fea374c091dc4b4a6a%22%7D%7D
- [ ]   there is data about the number of people following a podcast somewhere that shows up in the mobile app
- [ ]   music video support (not available in the us)
- [ ]   video podcast support (requires a better websocket api)
- [ ]   similar to bilibili i think we need to add id prefixes or suffixes because there could be collision
- [ ]   add offline playback for widevine support
        as far as i can tell this will not be possible. Spotify does not support offline playback in the 
        Web Player. Asking the ephemeral license server for a persistent license hasn't worked.
        Offline playback is likely possible if we emulate the desktop or mobile app functionality
        wireshark tips https://www.netresec.com/?page=PolarProxy to unencrypt
        https://docs.fedoraproject.org/en-US/quick-docs/using-shared-system-certificates/ for adding the root ca
        some reference offline/persistent widevine https://github.com/AnassHmida/react-native-video-drm/blob/main/android-exoplayer/src/main/java/com/brentvatne/exoplayer/DownloadTracker.java
- [ ]   androidx.media3.exoplayer.drm.DefaultDrmSessionManager$MissingSchemeDataException: Media does not support uuid: edef8ba9-79d6-4ace-a3c8-27dcd51d21ed
        is some weird DRM issue. happens at least for these albums
        https://open.spotify.com/album/5koG6JeFEwcINyN1QuXyiq
        https://open.spotify.com/album/3UEEPh5wsdhP7SKC31yvhu
- [ ]   maybe interleave search results
- [ ]   add whatever gets stuff to show up on the channels and support tabs on the cannel page. i think it is just polycentric stuff but idk
- [x]   (i think this is fixed) when the liked songs collection is in the recently played genre it doesn't show up in grayjay

## Grayjay Bugs
- [ ]   RatingScaler doesn't work
- [ ]   websockets are hard to use
- [ ]   datetime doesn't display for playlists
- [ ]   there is no way to get to the creator of a playlist
- [ ]   the pager that goes in the contents property of a playlist doesn't ever call the nextPage method
- [ ]   the channel about section doesn't render HTML
- [ ]   the isOpen property on WebSocket always returns false
- [ ]   when polycentric channels have issues not displaying channel playlists when the actual plugin that opened the channel doesn't support channel playlists
- [ ]   exceptions thrown inside wss message handlers don't get reported
