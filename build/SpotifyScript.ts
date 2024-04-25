import {
    FileManifestResponse,
    GetLicenseResponse,
    SeektableResponse,
    Settings,
    SongMetadataResponse,
    // SpotifySource,
    State
} from "./types.js"

const SONG_REGEX = /^https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]*)($|\/)/
const SONG_URL_PREFIX = "https://open.spotify.com/track/" as const
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
        const song_uri_id = "6XXxKsu3RJeN3ZvbMYrgQW"
        const song_url = `${SONG_URL_PREFIX}${song_uri_id}`
        const song_html_regex = /<script id="session" data-testid="session" type="application\/json">({.*?})<\/script><script id="features" type="application\/json">/
        const match_result = local_http.GET(song_url, {}, false).body.match(song_html_regex)
        if (match_result === null) {
            throw new ScriptException("regex error")
        }
        const maybe_json = match_result[1]
        if (maybe_json === undefined) {
            throw new ScriptException("regex error")
        }
        const token_response: { accessToken: string } = JSON.parse(maybe_json)
        local_state = { bearer_token: token_response.accessToken }
    }
}

function disable() {
    log("BiliBili log: disabling")
}

function saveState() {
    return JSON.stringify(local_state)
}

function getHome() {
    const song_uri_id = "6XXxKsu3RJeN3ZvbMYrgQW"
    const song_url = `${SONG_URL_PREFIX}${song_uri_id}`

    const song_metadata_response: SongMetadataResponse = get_song_metadata(song_uri_id)
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

// https://open.spotify.com/track/6XXxKsu3RJeN3ZvbMYrgQW
function isContentDetailsUrl(url: string) {
    return SONG_REGEX.test(url)
}

function getContentDetails(url: string) {
    const match_result = url.match(SONG_REGEX)
    if (match_result === null) {
        throw new ScriptException("regex error")
    }
    const maybe_song_uri_id = match_result[1]
    if (maybe_song_uri_id === undefined) {
        throw new ScriptException("regex error")
    }
    const song_url = `${SONG_URL_PREFIX}${maybe_song_uri_id}`

    const song_metadata_response: SongMetadataResponse = get_song_metadata(maybe_song_uri_id)
    const first_artist = song_metadata_response.artist[0]
    if (first_artist === undefined) {
        throw new ScriptException("missing artist")
    }

    const format = "MP4_128"

    const maybe_file_id = song_metadata_response.file.find(function (file) { return file.format === format })?.file_id
    if (maybe_file_id === undefined) {
        throw new ScriptException("missing expected format")
    }

    const file_manifest_url_prefix = "https://gue1-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/10/"
    const file_manifest_params = "?product=9&alt=json"
    const file_manifest: FileManifestResponse = JSON.parse(
        local_http.GET(
            `${file_manifest_url_prefix}${maybe_file_id}${file_manifest_params}`,
            { Authorization: `Bearer ${local_state.bearer_token}` },
            false
        ).body
    )

    log(file_manifest)

    const duration = song_metadata_response.duration / 1000

    const audio_sources = file_manifest.cdnurl.map(function (url) {
        return new AudioUrlSource({
            //audio/mp4; codecs="mp4a.40.2
            name: format,
            bitrate: HARDCODED_ZERO,
            container: "audio/mp4",
            codecs: "mp4a.40.2",
            duration,
            url,
            language: Language.UNKNOWN,
        })
    })

    //https://seektables.scdn.co/seektable/4c652e57fd36f84d77af2b9d1d1332327a8fd774.json
    const seektable_url_prefix = "https://seektables.scdn.co/seektable/"

    const seektable_response: SeektableResponse = JSON.parse(
        local_http.GET(
            `${seektable_url_prefix}${maybe_file_id}.json`,
            {},
            false
        ).body
    )

    log(seektable_response)

    const get_license_url_url = "https://gue1-spclient.spotify.com/melody/v1/license_url?keysystem=com.widevine.alpha&sdk_name=harmony&sdk_version=4.41.0"

    const get_license_response: GetLicenseResponse = JSON.parse(
        local_http.GET(
            get_license_url_url,
            { Authorization: `Bearer ${local_state.bearer_token}` },
            false
        ).body
    )

    log(get_license_response)

    const license_url = `https://gue1-spclient.spotify.com/${get_license_response.uri}`

    log(license_url)

    return new PlatformVideoDetails({
        id: new PlatformID(PLATFORM, maybe_song_uri_id, plugin.config.id),
        name: song_metadata_response.name,
        author: new PlatformAuthorLink(new PlatformID(PLATFORM, first_artist.gid, plugin.config.id), first_artist.name, "https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m"),
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
        // readonly live?: IVideoSource
        rating: new RatingLikes(HARDCODED_ZERO)
        // readonly subtitles?: ISubtitleSource[]
    })
}

function get_song_metadata(song_uri_id: string): SongMetadataResponse {
    const song_metadata_url = "https://spclient.wg.spotify.com/metadata/4/track/"
    const song_metadata_response: SongMetadataResponse = JSON.parse(
        local_http.GET(
            `${song_metadata_url}${get_gid(song_uri_id)}`,
            {
                Authorization: `Bearer ${local_state.bearer_token}`,
                Accept: "application/json"
            },
            false
        ).body
    )
    return song_metadata_response
}

// function assert_never(value: never) {
//     log(value)
// }

// function log_passthrough<T>(value: T): T {
//     log(value)
//     return value
// }

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

// export {
    get_gid
}
