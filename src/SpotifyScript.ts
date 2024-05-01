//#region constants
import {
    type AlbumResponse,
    type AlbumTracksResponse,
    type ArtistDetails,
    type ArtistMetadataResponse,
    type ContentType,
    type EpisodeMetadataResponse,
    type FileManifestResponse,
    type GetLicenseResponse,
    type LyricsResponse,
    type PlaylistContent,
    type PlaylistContentResponse,
    type PlaylistResponse,
    type PlaylistType,
    type PodcastMetadataResponse,
    type Settings,
    type SongMetadataResponse,
    type State,
    type TrackMetadataResponse,
    type Tracks,
    type TranscriptResponse,
} from "./types.js"

const CONTENT_REGEX = /^https:\/\/open\.spotify\.com\/(track|episode)\/([a-zA-Z0-9]*)($|\/)/
const PLAYLIST_REGEX = /^https:\/\/open\.spotify\.com\/(album|playlist)\/([a-zA-Z0-9]*)($|\/)/
const SONG_URL_PREFIX = "https://open.spotify.com/track/" as const
const PODCAST_URL_PREFIX = "https://open.spotify.com/show/" as const
const ARTIST_URL_PREFIX = "https://open.spotify.com/artist/" as const
const ALBUM_URL_PREFIX = "https://open.spotify.com/album/" as const
const QUERY_URL = "https://api-partner.spotify.com/pathfinder/v1/query" as const
const IMAGE_URL_PREFIX = "https://i.scdn.co/image/" as const

const PLATFORM = "Spotify" as const
// const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0" as const

const HARDCODED_ZERO = 0 as const
const HARDCODED_EMPTY_STRING = "" as const

const local_http = http
// const local_utility = utility

// set missing constants
Type.Order.Chronological = "Latest releases"
Type.Order.Views = "Most played"
Type.Order.Favorites = "Most favorited"

/** State */
let local_state: State
//#endregion

//#region source methods
source.enable = enable
source.disable = disable
source.saveState = saveState
source.getHome = getHome

// source.searchSuggestions = searchSuggestions
// source.getSearchCapabilities = getSearchCapabilities
// source.search = search

// source.searchChannels = searchChannels
// source.isChannelUrl = isChannelUrl
// source.getChannel = getChannel

// source.getChannelCapabilities = getChannelCapabilities
// source.getChannelContents = getChannelContents
// source.getSearchChannelContentsCapabilities = getSearchChannelContentsCapabilities
// source.searchChannelContents = searchChannelContents

source.isContentDetailsUrl = isContentDetailsUrl
source.getContentDetails = getContentDetails

source.isPlaylistUrl = isPlaylistUrl
// source.searchPlaylists = searchPlaylists
source.getPlaylist = getPlaylist

// source.getComments = getComments
// source.getSubComments = getSubComments
// source.getLiveChatWindow = getLiveChatWindow

// source.getUserSubscriptions = getUserSubscriptions
// source.getUserPlaylists = getUserPlaylists

/*
if (IS_TESTING) {
    const assert_source: SpotifySource = {
        enable,
        disable,
        saveState,
        getHome,
        searchSuggestions,
        search,
        getSearchCapabilities,
        isContentDetailsUrl,
        getContentDetails,
        isChannelUrl,
        getChannel,
        getChannelContents,
        getChannelCapabilities,
        searchChannelContents,
        getSearchChannelContentsCapabilities,
        searchChannels,
        getComments,
        getSubComments,
        isPlaylistUrl,
        getPlaylist,
        searchPlaylists,
        getLiveChatWindow,
        getUserPlaylists,
        getUserSubscriptions
    }
    if (source.enable === undefined) { assert_never(source.enable) }
    if (source.disable === undefined) { assert_never(source.disable) }
    if (source.saveState === undefined) { assert_never(source.saveState) }
    if (source.getHome === undefined) { assert_never(source.getHome) }
    if (source.searchSuggestions === undefined) { assert_never(source.searchSuggestions) }
    if (source.search === undefined) { assert_never(source.search) }
    if (source.getSearchCapabilities === undefined) { assert_never(source.getSearchCapabilities) }
    if (source.isContentDetailsUrl === undefined) { assert_never(source.isContentDetailsUrl) }
    if (source.getContentDetails === undefined) { assert_never(source.getContentDetails) }
    if (source.isChannelUrl === undefined) { assert_never(source.isChannelUrl) }
    if (source.getChannel === undefined) { assert_never(source.getChannel) }
    if (source.getChannelContents === undefined) { assert_never(source.getChannelContents) }
    if (source.getChannelCapabilities === undefined) { assert_never(source.getChannelCapabilities) }
    if (source.searchChannelContents === undefined) { assert_never(source.searchChannelContents) }
    if (source.getSearchChannelContentsCapabilities === undefined) { assert_never(source.getSearchChannelContentsCapabilities) }
    if (source.searchChannels === undefined) { assert_never(source.searchChannels) }
    if (source.getComments === undefined) { assert_never(source.getComments) }
    if (source.getSubComments === undefined) { assert_never(source.getSubComments) }
    if (source.isPlaylistUrl === undefined) { assert_never(source.isPlaylistUrl) }
    if (source.getPlaylist === undefined) { assert_never(source.getPlaylist) }
    if (source.searchPlaylists === undefined) { assert_never(source.searchPlaylists) }
    if (source.getLiveChatWindow === undefined) { assert_never(source.getLiveChatWindow) }
    if (source.getUserPlaylists === undefined) { assert_never(source.getUserPlaylists) }
    if (source.getUserSubscriptions === undefined) { assert_never(source.getUserSubscriptions) }
    if (IS_TESTING) {
        log(assert_source)
    }
}
*/
//#endregion

//#region enable
function enable(conf: SourceConfig, settings: Settings, savedState: string | null) {
    if (IS_TESTING) {
        log("IS_TESTING true")
        log("logging configuration")
        log(conf)
        log("logging settings")
        log(settings)
        log("logging savedState")
        log(savedState)
    }
    if (savedState !== null) {
        const state: State = JSON.parse(savedState)
        local_state = state
    } else {
        // download bearer token
        const homepage_url = "https://open.spotify.com"
        const bearer_token_regex = /<script id="session" data-testid="session" type="application\/json">({.*?})<\/script><script id="features" type="application\/json">/

        // use the authenticated client to get a logged in bearer token
        const homepage_response = local_http.GET(homepage_url, {}, true)

        const match_result = homepage_response.body.match(bearer_token_regex)
        if (match_result === null) {
            throw new ScriptException("regex error")
        }
        const maybe_json = match_result[1]
        if (maybe_json === undefined) {
            throw new ScriptException("regex error")
        }
        const token_response: { accessToken: string } = JSON.parse(maybe_json)
        const bearer_token = token_response.accessToken


        // download license uri
        const get_license_url_url = "https://gue1-spclient.spotify.com/melody/v1/license_url?keysystem=com.widevine.alpha&sdk_name=harmony&sdk_version=4.41.0"
        const get_license_url_response = local_http.GET(
            get_license_url_url,
            { Authorization: `Bearer ${bearer_token}` },
            false
        )
        const get_license_response: GetLicenseResponse = JSON.parse(
            get_license_url_response.body
        )
        const license_uri = `https://gue1-spclient.spotify.com/${get_license_response.uri}`


        local_state = {
            bearer_token,
            license_uri: license_uri
        }
    }
    if (is_premium()) {
        local_state = {
            bearer_token: "BQB5uzdWBsXahudafNcc3RR7kExwq4vpsbkSCOuGkn06aYQ8it6x-M5PmaVi2gapw5NgXMO4tlDSenQcCqv2dQg94a_4fsi11yX5qkAeqW0f_bRNHZ3cg1QlJgX8kKnOmEs5I8jmhY2pR0k8ParLvLZt7tVQYVceei3NJM4w4oKr6thqYyCST-3BHJximVhvT5_cmMrFac5VBWkgioQPxNUSO1U6ICi0hN2W5WMYg8KjdrjCPKfFiYTE3Z9myO0fGI13o1uWzNRrXHc075HuOYvvv_5UbobXPyPVbSEfLqGuaPstmN8Ubj7XV6FXYPnvNSNnJlLx1GwLx2EoyA",
            license_uri: local_state.license_uri
        }
    }



}
//#endregion

function disable() {
    log("Spotify log: disabling")
}

function saveState() {
    return JSON.stringify(local_state)
}

//#region home
function getHome() {
    const playlists = [
        new PlatformPlaylist({
            id: new PlatformID(PLATFORM, "an album id", plugin.config.id),
            name: "the coolest album of all time",
            // thumbnails: new Thumbnails([new Thumbnail("https://i.scdn.co/image/ab6765630000ba8a95af9fcb5c610d710793568a", 11)]),
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, "an artist id", plugin.config.id), "beyonce", "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"),
            // datetime: 1714580179,
            datetime: 1714580179,
            url: "https://open.spotify.com/album/6BzxX6zkDsYKFJ04ziU5xQ",
            videoCount: 11,
            /** Only usable for IPlatformPlaylistDef not IPlatformPlaylistDetailsDef */
            thumbnail: "https://i.scdn.co/image/ab6765630000ba8ab3d3d2577970462809eb1145"
        }),
        new PlatformPlaylist({
            id: new PlatformID(PLATFORM, "an album id", plugin.config.id),
            name: "dayly mix mix 1111",
            // thumbnails: new Thumbnails([new Thumbnail("https://i.scdn.co/image/ab6765630000ba8a95af9fcb5c610d710793568a", 11)]),
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, "an artist id", plugin.config.id), "beyonce", "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"),
            // datetime: 1714580179,
            datetime: 1714580179,
            url: "https://open.spotify.com/playlist/37i9dQZF1E38112qhvV3BT",
            videoCount: 11,
            /** Only usable for IPlatformPlaylistDef not IPlatformPlaylistDetailsDef */
            thumbnail: "https://i.scdn.co/image/ab6765630000ba8ab3d3d2577970462809eb1145"
        }),
        new PlatformPlaylist({
            id: new PlatformID(PLATFORM, "an album id", plugin.config.id),
            name: "tines for two",
            // thumbnails: new Thumbnails([new Thumbnail("https://i.scdn.co/image/ab6765630000ba8a95af9fcb5c610d710793568a", 11)]),
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, "an artist id", plugin.config.id), "beyonce", "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"),
            // datetime: 1714580179,
            datetime: 1714580179,
            url: "https://open.spotify.com/playlist/4ClcTeCoE9aPMhy0CLoD9P",
            videoCount: 11,
            /** Only usable for IPlatformPlaylistDef not IPlatformPlaylistDetailsDef */
            thumbnail: "https://i.scdn.co/image/ab6765630000ba8ab3d3d2577970462809eb1145"
        })
    ]
    return new ContentPager(playlists, false)
    /*
    const song_uri_id = "6XXxKsu3RJeN3ZvbMYrgQW"
    const song_url = `${SONG_URL_PREFIX}${song_uri_id}`

    const { url: metadata_url, headers: metadata_headers } = song_metadata_args(song_uri_id)
    const song_metadata_response: SongMetadataResponse = JSON.parse(local_http.GET(metadata_url, metadata_headers, false).body)
    const first_artist = song_metadata_response.artist[0]
    if (first_artist === undefined) {
        throw new ScriptException("missing artist")
    }
    //https://spclient.wg.spotify.com/metadata/4/track/e4eac7232f3d48fb965b5a03c49eb93a
    const songs = [new PlatformVideo({
        id: new PlatformID(PLATFORM, song_uri_id, plugin.config.id),
        name: song_metadata_response.name,
        author: new PlatformAuthorLink(new PlatformID(PLATFORM, first_artist.gid, plugin.config.id), first_artist.name, "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"),
        url: song_url,
        thumbnails: new Thumbnails(song_metadata_response.album.cover_group.image.map(function (image) {
            return new Thumbnail(`${IMAGE_URL_PREFIX}${image.file_id}`, image.height)
        })),
        duration: song_metadata_response.duration / 1000,
        viewCount: HARDCODED_ZERO,
        isLive: false,
        shareUrl: song_metadata_response.canonical_uri,
        // readonly uploadDate?: number
    })]
    return new VideoPager(songs, false)
    */
}
//#endregion

//#region content
// https://open.spotify.com/track/6XXxKsu3RJeN3ZvbMYrgQW
// https://open.spotify.com/episode/3Z88ZE0i3L7AIrymrBwtqg
function isContentDetailsUrl(url: string) {
    return CONTENT_REGEX.test(url)
}

function getContentDetails(url: string) {
    if (!bridge.isLoggedIn()) {
        throw new LoginRequiredException("login to listen to songs")
    }
    const match_result = url.match(CONTENT_REGEX)
    if (match_result === null) {
        throw new ScriptException("regex error")
    }
    const maybe_content_type = match_result[1]
    if (maybe_content_type === undefined) {
        throw new ScriptException("regex error")
    }
    const content_type: ContentType = maybe_content_type as ContentType
    const content_uri_id = match_result[2]
    if (content_uri_id === undefined) {
        throw new ScriptException("regex error")
    }
    switch (content_type) {
        case "track": {
            const song_url = `${SONG_URL_PREFIX}${content_uri_id}`

            const { url: metadata_url, headers: metadata_headers } = song_metadata_args(content_uri_id)
            const { url: track_metadata_url, headers: _track_metadata_headers } = track_metadata_args(content_uri_id)
            const batch = local_http
                .batch()
                .GET(metadata_url, metadata_headers, false)
                .GET(track_metadata_url, _track_metadata_headers, false)
            if (is_premium()) {
                const { url, headers } = lyrics_args(content_uri_id)
                batch.GET(url, headers, false)
            }
            const results = batch
                .execute()
            if (results[0] === undefined || results[1] === undefined) {
                throw new ScriptException("unreachable")
            }
            const song_metadata_response: SongMetadataResponse = JSON.parse(results[0].body)
            const track_metadata_response: TrackMetadataResponse = JSON.parse(results[1].body)
            const first_artist = track_metadata_response.data.trackUnion.firstArtist.items[0]
            if (first_artist === undefined) {
                throw new ScriptException("missing artist")
            }
            const artist_url = `https://open.spotify.com/artist/${first_artist.id}`
            const highest_quality_artist_cover_art = first_artist.visuals.avatarImage.sources.reduce(function (accumulator, current) {
                return accumulator.height > current.height ? accumulator : current
            })

            let subtitles: ISubtitleSource[] = []

            if (results[2] !== undefined) {
                const lyrics_response: LyricsResponse = JSON.parse(results[2].body)
                const subtitle_name = function () {
                    switch (lyrics_response.lyrics.language) {
                        case "en":
                            return "English"
                        default:
                            throw assert_no_fall_through(lyrics_response.lyrics.language, "unreachable")
                    }
                }()
                const convert = milliseconds_to_WebVTT_timestamp
                let vtt_text = `WEBVTT ${subtitle_name}\n`
                vtt_text += "\n"
                lyrics_response.lyrics.lines.forEach(function (line, index) {
                    const next = lyrics_response.lyrics.lines[index + 1]
                    let end = next?.startTimeMs
                    if (end === undefined) {
                        end = track_metadata_response.data.trackUnion.duration.totalMilliseconds.toString()
                    }
                    vtt_text += `${convert(parseInt(line.startTimeMs))} --> ${convert(parseInt(end))}\n`
                    vtt_text += `${line.words}\n`
                    vtt_text += "\n"
                })
                subtitles = [{
                    url: song_url,
                    name: subtitle_name,
                    getSubtitles() {
                        return vtt_text
                    },
                    format: "text/vtt",
                }]
            }

            const format = is_premium() ? "MP4_256" : "MP4_128"

            const maybe_file_id = song_metadata_response.file.find(function (file) { return file.format === format })?.file_id
            if (maybe_file_id === undefined) {
                throw new ScriptException("missing expected format")
            }

            const { url, headers } = file_manifest_args(maybe_file_id)
            const { url: artist_metadata_url, headers: artist_metadata_headers } = artist_metadata_args(first_artist.id)
            const second_results = local_http
                .batch()
                .GET(url, headers, false)
                .GET(artist_metadata_url, artist_metadata_headers, false)
                .execute()
            if (second_results[0] === undefined || second_results[1] === undefined) {
                throw new ScriptException("unreachable")
            }
            const file_manifest: FileManifestResponse = JSON.parse(second_results[0].body)
            const artist_metadata_response: ArtistMetadataResponse = JSON.parse(second_results[1].body)

            const duration = track_metadata_response.data.trackUnion.duration.totalMilliseconds / 1000

            const file_url = file_manifest.cdnurl[0]
            if (file_url === undefined) {
                throw new ScriptException("unreachable")
            }
            const codecs = "mp4a.40.2"
            const audio_sources = [new AudioUrlWidevineSource({
                //audio/mp4; codecs="mp4a.40.2
                name: codecs,
                bitrate: function (format: "MP4_128" | "MP4_256") {
                    switch (format) {
                        case "MP4_128":
                            return 128000
                        case "MP4_256":
                            return 256000
                        default:
                            throw assert_no_fall_through(format, "unreachable")
                    }
                }(format),
                container: "audio/mp4",
                codecs,
                duration,
                url: file_url,
                language: Language.UNKNOWN,
                bearerToken: local_state.bearer_token,
                licenseUri: local_state.license_uri
            })]

            return new PlatformVideoDetails({
                id: new PlatformID(PLATFORM, content_uri_id, plugin.config.id),
                name: song_metadata_response.name,
                author: new PlatformAuthorLink(
                    new PlatformID(PLATFORM, first_artist.id, plugin.config.id),
                    first_artist.profile.name,
                    artist_url,
                    highest_quality_artist_cover_art.url,
                    artist_metadata_response.data.artistUnion.stats.monthlyListeners
                ),
                url: song_url,
                thumbnails: new Thumbnails(song_metadata_response.album.cover_group.image.map(function (image) {
                    return new Thumbnail(`${IMAGE_URL_PREFIX}${image.file_id}`, image.height)
                })),
                duration,
                viewCount: parseInt(track_metadata_response.data.trackUnion.playcount),
                isLive: false,
                shareUrl: song_metadata_response.canonical_uri,
                datetime: new Date(track_metadata_response.data.trackUnion.albumOfTrack.date.isoString).getTime() / 1000,
                description: HARDCODED_EMPTY_STRING,
                video: new UnMuxVideoSourceDescriptor([], audio_sources),
                rating: new RatingLikes(HARDCODED_ZERO),
                subtitles
            })
        }

        case "episode": {
            const episode_url = `https://open.spotify.com/episode/${content_uri_id}`

            const { url: transcript_url, headers: transcript_headers } = transcript_args(content_uri_id)
            const { url, headers } = episode_metadata_args(content_uri_id)
            const responses = local_http.batch()
                .GET(transcript_url, transcript_headers, false)
                .GET(url, headers, false)
                .execute()
            if (responses[0] === undefined || responses[1] === undefined) {
                throw new ScriptException("unreachable")
            }
            const transcript_response: TranscriptResponse = JSON.parse(responses[0].body)
            const episode_metadata_response: EpisodeMetadataResponse = JSON.parse(responses[1].body)

            if (episode_metadata_response.data.episodeUnionV2.mediaTypes.length === 2) {
                function assert_video(_mediaTypes: ["AUDIO", "VIDEO"]) { }
                assert_video(episode_metadata_response.data.episodeUnionV2.mediaTypes)
                //TODO since we don't use the transcript we should only load it when audio only podcasts are played

                // TODO handle video podcasts. Grayjay doesn't currently support the websocket functionality necessary
                // the basic process to get the video play info is
                // connect to the websocket wss://gue1-dealer.spotify.com/?access_token=<bearer-token> 
                // register the device https://gue1-spclient.spotify.com/track-playback/v1/devices
                //      generate the device id using code found in the min js like this
                /*
                        web player js
                        const t = Math.ceil(e / 2);
                        return function(e) {
                            let t = "";
                            for (let n = 0; n < e.length; n++) {
                                const i = e[n];
                                i < 16 && (t += "0"),
                                t += i.toString(16)
                            }
                            return t
                        }(Oe(t))
                */
                // load devices info https://gue1-spclient.spotify.com/connect-state/v1/devices/hobs_aced97d86694f14d304dd4e6f1f7f8c3bff
                // transfer to our device https://gue1-spclient.spotify.com/connect-state/v1/connect/transfer/from/9a7079bd5b5605839c1d9080d0f4368bfcd6d2eb/to/aced97d86694f14d304dd4e6f1f7f8c3bff
                // signal the play of the given podcast (not quite sure how this works :/)
                // recieve the video play info via the websocket connection
                //
            }

            const format = "MP4_128"
            const maybe_file_id = episode_metadata_response.data.episodeUnionV2.audio.items.find(function (file) { return file.format === format })?.fileId
            if (maybe_file_id === undefined) {
                throw new ScriptException("missing expected format")
            }

            const limited_podcast_metadata = episode_metadata_response.data.episodeUnionV2.podcastV2.data
            const podcast_uri_id = id_from_uri(limited_podcast_metadata.uri)
            const highest_quality_cover_art = limited_podcast_metadata.coverArt.sources.reduce(function (accumulator, current) {
                return accumulator.height > current.height ? accumulator : current
            })

            const { url: manifest_url, headers: manifest_headers } = file_manifest_args(maybe_file_id)
            const { url: podcast_metadata_url, headers: podcast_metadata_headers } = podcast_metadata_args(podcast_uri_id)
            const results = local_http
                .batch()
                .GET(podcast_metadata_url, podcast_metadata_headers, false)
                .GET(manifest_url, manifest_headers, false)
                .execute()
            if (results[0] === undefined || results[1] === undefined) {
                throw new ScriptException("unreachable")
            }
            const full_podcast_metadata: PodcastMetadataResponse = JSON.parse(results[0].body)
            const file_manifest: FileManifestResponse = JSON.parse(results[1].body)

            const duration = episode_metadata_response.data.episodeUnionV2.duration.totalMilliseconds / 1000

            const file_url = file_manifest.cdnurl[0]
            if (file_url === undefined) {
                throw new ScriptException("unreachable")
            }
            const codecs = "mp4a.40.2"
            const audio_sources = [new AudioUrlWidevineSource({
                //audio/mp4; codecs="mp4a.40.2
                name: codecs,
                bitrate: 128000,
                container: "audio/mp4",
                codecs,
                duration,
                url: file_url,
                language: Language.UNKNOWN,
                bearerToken: local_state.bearer_token,
                licenseUri: local_state.license_uri
            })]

            const subtitle_name = function () {
                switch (transcript_response.language) {
                    case "en":
                        return "English"
                    default:
                        throw assert_no_fall_through(transcript_response.language, "unreachable")
                }
            }()

            let vtt_text = `WEBVTT ${subtitle_name}\n`
            vtt_text += "\n"
            transcript_response.section.forEach(function (section, index) {
                if ("title" in section) {
                    return
                }
                const next = transcript_response.section[index + 1]
                let end = next?.startMs
                if (end === undefined) {
                    end = episode_metadata_response.data.episodeUnionV2.duration.totalMilliseconds
                }
                vtt_text += `${milliseconds_to_WebVTT_timestamp(section.startMs)} --> ${milliseconds_to_WebVTT_timestamp(end)}\n`
                vtt_text += `${section.text.sentence.text}\n`
                vtt_text += "\n"
            })

            return new PlatformVideoDetails({
                id: new PlatformID(PLATFORM, content_uri_id, plugin.config.id),
                name: episode_metadata_response.data.episodeUnionV2.name,
                author: new PlatformAuthorLink(
                    new PlatformID(PLATFORM, podcast_uri_id, plugin.config.id),
                    limited_podcast_metadata.name,
                    `${PODCAST_URL_PREFIX}${podcast_uri_id}`,
                    highest_quality_cover_art.url,
                ),
                url: episode_url,
                thumbnails: new Thumbnails(episode_metadata_response.data.episodeUnionV2.coverArt.sources.map(function (image) {
                    return new Thumbnail(image.url, image.height)
                })),
                duration,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: episode_metadata_response.data.episodeUnionV2.uri,
                datetime: new Date(episode_metadata_response.data.episodeUnionV2.releaseDate.isoString).getTime() / 1000,
                description: episode_metadata_response.data.episodeUnionV2.htmlDescription,
                video: new UnMuxVideoSourceDescriptor([], audio_sources),
                rating: new RatingScaler(full_podcast_metadata.data.podcastUnionV2.rating.averageRating.average),
                subtitles: [{
                    url: episode_url,
                    name: subtitle_name,
                    getSubtitles() {
                        return vtt_text
                    },
                    format: "text/vtt",
                }]
            })
        }

        default:
            throw assert_no_fall_through(content_type, "unreachable")
    }
}

function podcast_metadata_args(podcast_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:show:${podcast_uri_id}`
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "5fb034a236a3e8301e9eca0e23def3341ed66c891ea2d4fea374c091dc4b4a6a"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryShowMetadataV2")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}

function transcript_args(episode_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const transcript_url_prefix = "https://spclient.wg.spotify.com/transcript-read-along/v2/episode/"
    const url = new URL(`${transcript_url_prefix}${episode_uri_id}`)
    url.searchParams.set("format", "json")
    return {
        url: url.toString(),
        headers: { Authorization: `Bearer ${local_state.bearer_token}` }
    }
}

function lyrics_args(song_uri_id: string): {
    readonly url: string, readonly headers: {
        Authorization: string,
        Accept: string,
        "app-platform": "WebPlayer"
    }
} {
    const url = new URL(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${song_uri_id}`)
    return {
        url: url.toString(),
        headers: {
            Accept: "application/json",
            "app-platform": "WebPlayer",
            Authorization: `Bearer ${local_state.bearer_token}`
        }
    }
}

function file_manifest_args(file_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const file_manifest_url_prefix = "https://gue1-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/10/"
    const file_manifest_params = "?product=9&alt=json"
    return {
        url: `${file_manifest_url_prefix}${file_id}${file_manifest_params}`,
        headers: { Authorization: `Bearer ${local_state.bearer_token}` }
    }
}

function episode_metadata_args(episode_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:episode:${episode_uri_id}`
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9697538fe993af785c10725a40bb9265a20b998ccd2383bd6f586e01303824e9"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "getEpisodeOrChapter")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}

function track_metadata_args(song_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:track:${song_uri_id}`
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "ae85b52abb74d20a4c331d4143d4772c95f34757bfa8c625474b912b9055b5c0"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "getTrack")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}

function song_metadata_args(song_uri_id: string): {
    readonly url: string,
    readonly headers: {
        Authorization: string,
        Accept: "application/json"
    }
} {
    const song_metadata_url = "https://spclient.wg.spotify.com/metadata/4/track/"
    return {
        url: `${song_metadata_url}${get_gid(song_uri_id)}`,
        headers: {
            Authorization: `Bearer ${local_state.bearer_token}`,
            Accept: "application/json"
        }
    }
}

function artist_metadata_args(artist_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:artist:${artist_uri_id}`,
        locale: "",
        includePrerelease: true
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "da986392124383827dc03cbb3d66c1de81225244b6e20f8d78f9f802cc43df6e"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryArtistOverview")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
//#endregion

//#region playlists
// https://open.spotify.com/album/6BzxX6zkDsYKFJ04ziU5xQ
// https://open.spotify.com/playlist/37i9dQZF1E38112qhvV3BT
function isPlaylistUrl(url: string): boolean {
    return PLAYLIST_REGEX.test(url)
}
function getPlaylist(url: string): PlatformPlaylistDetails {
    const match_result = url.match(PLAYLIST_REGEX)
    if (match_result === null) {
        throw new ScriptException("regex error")
    }
    const maybe_playlist_type = match_result[1]
    if (maybe_playlist_type === undefined) {
        throw new ScriptException("regex error")
    }
    const playlist_type: PlaylistType = maybe_playlist_type as PlaylistType
    const playlist_uri_id = match_result[2]
    if (playlist_uri_id === undefined) {
        throw new ScriptException("regex error")
    }
    switch (playlist_type) {
        case "album": {
            // if the author is the same as the album then include the artist pick otherwise nothing
            // TODO we could load in extra info for all the other artists but it might be hard to do that in a request efficient way

            const pagination_limit = 50 as const
            const offset = 0

            const { url, headers } = album_metadata_args(playlist_uri_id, offset, pagination_limit)
            const album_metadata_response: AlbumResponse = JSON.parse(local_http.GET(url, headers, false).body)
            const album_artist = album_metadata_response.data.albumUnion.artists.items[0]
            if (album_artist === undefined) {
                throw new ScriptException("missing album artist")
            }
            const unix_time = new Date(album_metadata_response.data.albumUnion.date.isoString).getTime() / 1000

            return new PlatformPlaylistDetails({
                id: new PlatformID(PLATFORM, playlist_uri_id, plugin.config.id),
                name: album_metadata_response.data.albumUnion.name,
                author: new PlatformAuthorLink(
                    new PlatformID(PLATFORM, album_artist.id, plugin.config.id),
                    album_artist.profile.name,
                    `${ARTIST_URL_PREFIX}${album_artist.id}`,
                    album_artist.visuals.avatarImage.sources[album_artist.visuals.avatarImage.sources.length - 1]?.url
                ),
                datetime: unix_time,
                url: `${ALBUM_URL_PREFIX}${playlist_uri_id}`,
                videoCount: album_metadata_response.data.albumUnion.tracks.totalCount,
                contents: new AlbumPager(playlist_uri_id, offset, pagination_limit, album_metadata_response, album_artist, unix_time)
            })
        }
        case "playlist": {
            if (!bridge.isLoggedIn()) {
                throw new LoginRequiredException("login to open playlists")
            }
            const pagination_limit = 25 as const
            const offset = 0

            const { url, headers } = fetch_playlist_args(playlist_uri_id, offset, pagination_limit)
            const playlist_response: PlaylistResponse = JSON.parse(local_http.GET(url, headers, false).body)
            const owner = playlist_response.data.playlistV2.ownerV2.data

            return new PlatformPlaylistDetails({
                id: new PlatformID(PLATFORM, playlist_uri_id, plugin.config.id),
                name: playlist_response.data.playlistV2.name,
                author: new PlatformAuthorLink(
                    new PlatformID(PLATFORM, owner.username, plugin.config.id),
                    owner.name,
                    `${ARTIST_URL_PREFIX}${owner.username}`,
                    owner.avatar?.sources[owner.avatar.sources.length - 1]?.url
                ),
                url: `${ALBUM_URL_PREFIX}${playlist_uri_id}`,
                videoCount: playlist_response.data.playlistV2.content.totalCount,
                contents: new SpotifyPlaylistPager(playlist_uri_id, offset, pagination_limit, playlist_response)
            })
        }
        default: {
            throw assert_no_fall_through(playlist_type, "unreachable")
        }
    }
}
class SpotifyPlaylistPager extends VideoPager {
    private offset: number
    private readonly total_tracks: number
    constructor(
        private readonly playlist_uri_id: string,
        offset: number,
        private readonly pagination_limit: number,
        playlist_response: PlaylistResponse
    ) {
        const total_tracks = playlist_response.data.playlistV2.content.totalCount

        const songs = format_playlist_tracks(playlist_response.data.playlistV2.content)

        super(songs, total_tracks > offset + pagination_limit)
        this.offset = offset + pagination_limit
        this.total_tracks = total_tracks
    }
    override nextPage(this: SpotifyPlaylistPager): SpotifyPlaylistPager {
        const { url, headers } = fetch_playlist_contents_args(this.playlist_uri_id, this.offset, this.pagination_limit)
        const playlist_content_response: PlaylistContentResponse = JSON.parse(local_http.GET(url, headers, false).body)

        const songs = format_playlist_tracks(playlist_content_response.data.playlistV2.content)
        this.results = songs
        this.hasMore = this.total_tracks > this.offset + this.pagination_limit
        this.offset += this.pagination_limit
        return this
    }
    override hasMorePagers(this: SpotifyPlaylistPager): boolean {
        return this.hasMore
    }
}
function format_playlist_tracks(content: PlaylistContent) {
    return content.items.map(function (playlist_track_metadata) {
        const song = playlist_track_metadata.itemV2.data
        const track_uri_id = id_from_uri(song.uri)
        const artist = song.artists.items[0]
        if (artist === undefined) {
            throw new ScriptException("missing artist")
        }
        const url = `${SONG_URL_PREFIX}${track_uri_id}`
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, track_uri_id, plugin.config.id),
            name: song.name,
            author: new PlatformAuthorLink(
                new PlatformID(PLATFORM, id_from_uri(artist.uri), plugin.config.id),
                artist.profile.name,
                `${ARTIST_URL_PREFIX}${id_from_uri(artist.uri)}`
                // TODO figure out a way to get the artist thumbnail
            ),
            url,
            thumbnails: new Thumbnails(song.albumOfTrack.coverArt.sources.map(function (source) {
                return new Thumbnail(source.url, source.height)
            })),
            duration: song.trackDuration.totalMilliseconds / 1000,
            viewCount: parseInt(song.playcount),
            isLive: false,
            shareUrl: url,
            datetime: new Date(playlist_track_metadata.addedAt.isoString).getTime() / 1000
        })
    })
}
/**
 * 
 * @param playlist_uri_id 
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns 
 */
function fetch_playlist_contents_args(playlist_uri_id: string, offset: number, limit: number): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:playlist:${playlist_uri_id}`,
        offset: offset,
        limit: limit
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "91d4c2bc3e0cd1bc672281c4f1f59f43ff55ba726ca04a45810d99bd091f3f0e"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "fetchPlaylistContents")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
/**
 * 
 * @param playlist_uri_id 
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns 
 */
function fetch_playlist_args(playlist_uri_id: string, offset: number, limit: number): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:playlist:${playlist_uri_id}`,
        offset: offset,
        limit: limit
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "91d4c2bc3e0cd1bc672281c4f1f59f43ff55ba726ca04a45810d99bd091f3f0e"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "fetchPlaylist")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
class AlbumPager extends VideoPager {
    private offset: number
    private readonly thumbnails: Thumbnails
    private readonly album_artist: ArtistDetails
    private readonly unix_time: number
    private readonly total_tracks: number
    constructor(
        private readonly album_uri_id: string,
        offset: number,
        private readonly pagination_limit: number,
        album_metadata_response: AlbumResponse,
        album_artist: ArtistDetails,
        unix_time: number,
    ) {
        const total_tracks = album_metadata_response.data.albumUnion.tracks.totalCount
        const thumbnails = new Thumbnails(album_metadata_response.data.albumUnion.coverArt.sources.map(function (source) {
            return new Thumbnail(source.url, source.height)
        }))

        const songs = format_album_tracks(album_metadata_response.data.albumUnion.tracks, thumbnails, album_artist, unix_time)

        super(songs, total_tracks > offset + pagination_limit)
        this.offset = offset + pagination_limit
        this.thumbnails = thumbnails
        this.album_artist = album_artist
        this.unix_time = unix_time
        this.total_tracks = total_tracks
    }
    override nextPage(this: AlbumPager): AlbumPager {
        const { url, headers } = album_tracks_args(this.album_uri_id, this.offset, this.pagination_limit)
        const album_tracks_response: AlbumTracksResponse = JSON.parse(local_http.GET(url, headers, false).body)

        const songs = format_album_tracks(album_tracks_response.data.albumUnion.tracks, this.thumbnails, this.album_artist, this.unix_time)
        this.results = songs
        this.hasMore = this.total_tracks > this.offset + this.pagination_limit
        this.offset += this.pagination_limit
        return this
    }
    override hasMorePagers(this: AlbumPager): boolean {
        return this.hasMore
    }
}
function format_album_tracks(tracks: Tracks, thumbnails: Thumbnails, album_artist: ArtistDetails, unix_time: number) {
    return tracks.items.map(function (track) {
        const track_uri_id = id_from_uri(track.track.uri)
        const artist = track.track.artists.items[0]
        if (artist === undefined) {
            throw new ScriptException("missing artist")
        }
        const url = `${SONG_URL_PREFIX}${track_uri_id}`
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, track_uri_id, plugin.config.id),
            name: track.track.name,
            author: new PlatformAuthorLink(
                new PlatformID(PLATFORM, id_from_uri(artist.uri), plugin.config.id),
                artist.profile.name,
                `${ARTIST_URL_PREFIX}${id_from_uri(artist.uri)}`,
                id_from_uri(artist.uri) === album_artist.id ? album_artist.visuals.avatarImage.sources[album_artist.visuals.avatarImage.sources.length - 1]?.url : undefined
            ),
            url,
            thumbnails,
            duration: track.track.duration.totalMilliseconds / 1000,
            viewCount: parseInt(track.track.playcount),
            isLive: false,
            shareUrl: url,
            datetime: unix_time
        })
    })
}
/**
 * 
 * @param album_uri_id 
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns 
 */
function album_tracks_args(album_uri_id: string, offset: number, limit: number): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:album:${album_uri_id}`,
        offset: offset,
        limit: limit
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "469874edcad37b7a379d4f22f0083a49ea3d6ae097916120d9bbe3e36ca79e9d"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryAlbumTracks")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
/**
 * 
 * @param album_uri_id 
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns 
 */
function album_metadata_args(album_uri_id: string, offset: number, limit: number): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:album:${album_uri_id}`,
        locale: "",
        offset: offset,
        limit: limit
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "469874edcad37b7a379d4f22f0083a49ea3d6ae097916120d9bbe3e36ca79e9d"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "getAlbum")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
//#endregion

//#region utilities
function id_from_uri(uri: string): string {
    const match_result = uri.match(/^spotify:(show|album|track|artist):([0-9a-zA-Z]*)$/)
    if (match_result === null) {
        throw new ScriptException("regex error")
    }
    const uri_id = match_result[2]
    if (uri_id === undefined) {
        throw new ScriptException("regex error")
    }
    return uri_id
}

/**
 * Converts seconds to the timestamp format used in WebVTT
 * @param seconds 
 * @returns 
 */
function milliseconds_to_WebVTT_timestamp(milliseconds: number) {
    return new Date(milliseconds).toISOString().substring(11, 23)
}

function assert_never(value: never) {
    log(value)
}

function log_passthrough<T>(value: T): T {
    log(value)
    return value
}
function assert_no_fall_through(value: never): void
function assert_no_fall_through(value: never, exception_message: string): ScriptException
function assert_no_fall_through(value: never, exception_message?: string): ScriptException | undefined {
    log(["Spotify log:", value])
    if (exception_message !== undefined) {
        return new ScriptException(exception_message)
    }
    return
}
//#endregion

//#region bad
function is_premium(): boolean {
    return false
}


// https://open.spotifycdn.com/cdn/build/web-player/vendor~web-player.391a2438.js
const Z = "0123456789abcdef"
const Q = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const ee: string[] = []
ee.length = 256
for (let ke = 0; ke < 256; ke++)
    // @ts-expect-error
    ee[ke] = Z[ke >> 4] + Z[15 & ke]
const te: number[] = []
te.length = 128
for (let ke = 0; ke < Q.length; ++ke)
    te[Q.charCodeAt(ke)] = ke

function get_gid(song_uri_id: string) {
    return 22 === song_uri_id.length ? function (e) {
        if (22 !== e.length)
            return null
        const t = 2.3283064365386963e-10
            , n = 4294967296
            , i = 238328
        let o, r, a, s, c
        // @ts-expect-error
        return o = 56800235584 * te[e.charCodeAt(0)] + 916132832 * te[e.charCodeAt(1)] + 14776336 * te[e.charCodeAt(2)] + 238328 * te[e.charCodeAt(3)] + 3844 * te[e.charCodeAt(4)] + 62 * te[e.charCodeAt(5)] + te[e.charCodeAt(6)],
            r = o * t | 0,
            o -= r * n,
            // @ts-expect-error
            c = 3844 * te[e.charCodeAt(7)] + 62 * te[e.charCodeAt(8)] + te[e.charCodeAt(9)],
            o = o * i + c,
            o -= (c = o * t | 0) * n,
            r = r * i + c,
            // @ts-expect-error
            c = 3844 * te[e.charCodeAt(10)] + 62 * te[e.charCodeAt(11)] + te[e.charCodeAt(12)],
            o = o * i + c,
            o -= (c = o * t | 0) * n,
            r = r * i + c,
            r -= (c = r * t | 0) * n,
            a = c,
            // @ts-expect-error
            c = 3844 * te[e.charCodeAt(13)] + 62 * te[e.charCodeAt(14)] + te[e.charCodeAt(15)],
            o = o * i + c,
            o -= (c = o * t | 0) * n,
            r = r * i + c,
            r -= (c = r * t | 0) * n,
            a = a * i + c,
            // @ts-expect-error
            c = 3844 * te[e.charCodeAt(16)] + 62 * te[e.charCodeAt(17)] + te[e.charCodeAt(18)],
            o = o * i + c,
            o -= (c = o * t | 0) * n,
            r = r * i + c,
            r -= (c = r * t | 0) * n,
            a = a * i + c,
            a -= (c = a * t | 0) * n,
            s = c,
            // @ts-expect-error
            c = 3844 * te[e.charCodeAt(19)] + 62 * te[e.charCodeAt(20)] + te[e.charCodeAt(21)],
            o = o * i + c,
            o -= (c = o * t | 0) * n,
            r = r * i + c,
            r -= (c = r * t | 0) * n,
            a = a * i + c,
            a -= (c = a * t | 0) * n,
            s = s * i + c,
            s -= (c = s * t | 0) * n,
            // @ts-expect-error
            c ? null : ee[s >>> 24] + ee[s >>> 16 & 255] + ee[s >>> 8 & 255] + ee[255 & s] + ee[a >>> 24] + ee[a >>> 16 & 255] + ee[a >>> 8 & 255] + ee[255 & a] + ee[r >>> 24] + ee[r >>> 16 & 255] + ee[r >>> 8 & 255] + ee[255 & r] + ee[o >>> 24] + ee[o >>> 16 & 255] + ee[o >>> 8 & 255] + ee[255 & o]
    }(song_uri_id) : song_uri_id
}
//#endregion

// export statements are removed during build step
// used for unit testing in SpotifyScript.test.ts
export {
    get_gid,
    assert_never,
    log_passthrough
}
