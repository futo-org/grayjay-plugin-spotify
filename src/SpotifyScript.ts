//#region constants
import {
    type ContentType,
    type EpisodeMetadataResponse,
    type FileManifestResponse,
    type GetLicenseResponse,
    type Settings,
    type SongMetadataResponse,
    // type SpotifySource,
    type State,
    type TranscriptResponse,
} from "./types.js"

const CONTENT_REGEX = /^https:\/\/open\.spotify\.com\/(track|episode)\/([a-zA-Z0-9]*)($|\/)/
const SONG_URL_PREFIX = "https://open.spotify.com/track/" as const
const IMAGE_URL_PREFIX = "https://i.scdn.co/image/" as const

const PLATFORM = "Spotify" as const
// const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0" as const

const HARDCODED_ZERO = 0 as const
const HARDCODED_EMPTY_STRING = "" as const
const EMPTY_AUTHOR = new PlatformAuthorLink(new PlatformID(PLATFORM, "", plugin.config.id), "", "")

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

// source.isPlaylistUrl = isPlaylistUrl
// source.searchPlaylists = searchPlaylists
// source.getPlaylist = getPlaylist

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
            const song_metadata_response: SongMetadataResponse = JSON.parse(local_http.GET(metadata_url, metadata_headers, false).body)
            const first_artist = song_metadata_response.artist[0]
            if (first_artist === undefined) {
                throw new ScriptException("missing artist")
            }
            const artist_url = "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"

            const format = is_premium() ? "MP4_256" : "MP4_128"

            const maybe_file_id = song_metadata_response.file.find(function (file) { return file.format === format })?.file_id
            if (maybe_file_id === undefined) {
                throw new ScriptException("missing expected format")
            }

            const { url, headers } = file_manifest_args(maybe_file_id)
            const file_manifest: FileManifestResponse = JSON.parse(local_http.GET(url, headers, false).body)

            const duration = song_metadata_response.duration / 1000

            const file_url = file_manifest.cdnurl[0]
            if (file_url === undefined) {
                throw new ScriptException("unreachable")
            }
            const audio_sources = [new AudioUrlWidevineSource({
                //audio/mp4; codecs="mp4a.40.2
                name: format,
                bitrate: HARDCODED_ZERO,
                container: "audio/mp4",
                codecs: "mp4a.40.2",
                duration,
                url: file_url,
                language: Language.UNKNOWN,
                bearerToken: local_state.bearer_token,
                licenseUri: local_state.license_uri
            })]

            return new PlatformVideoDetails({
                id: new PlatformID(PLATFORM, content_uri_id, plugin.config.id),
                name: song_metadata_response.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, first_artist.gid, plugin.config.id), first_artist.name, artist_url),
                url: song_url,
                thumbnails: new Thumbnails(song_metadata_response.album.cover_group.image.map(function (image) {
                    return new Thumbnail(`${IMAGE_URL_PREFIX}${image.file_id}`, image.height)
                })),
                duration,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: song_metadata_response.canonical_uri,
                // readonly uploadDate?: number
                description: HARDCODED_EMPTY_STRING,
                video: new UnMuxVideoSourceDescriptor([], audio_sources),
                rating: new RatingLikes(HARDCODED_ZERO)
                // readonly subtitles?: ISubtitleSource[]
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

            const format = "MP4_128"
            const maybe_file_id = episode_metadata_response.data.episodeUnionV2.audio.items.find(function (file) { return file.format === format })?.fileId
            if (maybe_file_id === undefined) {
                throw new ScriptException("missing expected format")
            }

            const { url: manifest_url, headers: manifest_headers } = file_manifest_args(maybe_file_id)
            const file_manifest: FileManifestResponse = JSON.parse(local_http.GET(manifest_url, manifest_headers, false).body)

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
                author: EMPTY_AUTHOR,
                url: episode_url,
                thumbnails: new Thumbnails(episode_metadata_response.data.episodeUnionV2.coverArt.sources.map(function (image) {
                    return new Thumbnail(image.url, image.height)
                })),
                duration,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: episode_metadata_response.data.episodeUnionV2.uri,
                uploadDate: new Date(episode_metadata_response.data.episodeUnionV2.releaseDate.isoString).getTime() / 1000,
                description: episode_metadata_response.data.episodeUnionV2.htmlDescription,
                video: new UnMuxVideoSourceDescriptor([], audio_sources),
                rating: new RatingLikes(HARDCODED_ZERO),
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

function transcript_args(episode_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const transcript_url_prefix = "https://spclient.wg.spotify.com/transcript-read-along/v2/episode/"
    const url = new URL(`${transcript_url_prefix}${episode_uri_id}`)
    url.searchParams.set("format", "json")
    return {
        url: url.toString(),
        headers: { Authorization: `Bearer ${local_state.bearer_token}` }
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
    const episode_metadata_url_prefix = "https://api-partner.spotify.com/pathfinder/v1/query"
    const variables = JSON.stringify({
        uri: `spotify:episode:${episode_uri_id}`
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9697538fe993af785c10725a40bb9265a20b998ccd2383bd6f586e01303824e9"
        }
    })
    const url = new URL(episode_metadata_url_prefix)
    url.searchParams.set("operationName", "getEpisodeOrChapter")
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
//#endregion

//#region utilities
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

// export statements are removed during build step
// used for unit testing in SpotifyScript.test.ts
export {
    get_gid,
    assert_never,
    log_passthrough
}
