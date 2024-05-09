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
    type ShowMetadataResponse,
    type Settings,
    type SongMetadataResponse,
    type State,
    type TrackMetadataResponse,
    type Tracks,
    type TranscriptResponse,
    type ProfileAttributesResponse,
    type ChannelType,
    type BrowsePageResponse,
    type GenrePlaylistSection,
    type ChannelTypeCapabilities,
    type FilterGroupIDs,
    type SectionItemAlbum,
    type SectionItemPlaylist,
    type BrowseSectionResponse,
    type Section,
    type BookChaptersResponse,
    type PodcastEpisodesResponse,
    type UserPlaylistsResponse,
    type DiscographyResponse,
    type HomeResponse,
    type HomePlaylistSection,
    type SectionItemEpisode,
    type WhatsNewResponse,
    type WhatsNewSection,
} from "./types.js"

const CONTENT_REGEX = /^https:\/\/open\.spotify\.com\/(track|episode)\/([a-zA-Z0-9]*)($|\/)/
const PLAYLIST_REGEX = /^https:\/\/open\.spotify\.com\/(album|playlist)\/([a-zA-Z0-9]*)($|\/)/
const CHANNEL_REGEX = /^https:\/\/open\.spotify\.com\/(show|artist|user|genre|section|content-feed)\/(section|)([a-zA-Z0-9]*)($|\/)/
const SONG_URL_PREFIX = "https://open.spotify.com/track/" as const
const EPISODE_URL_PREFIX = "https://open.spotify.com/episode/" as const
const SHOW_URL_PREFIX = "https://open.spotify.com/show/" as const
const ARTIST_URL_PREFIX = "https://open.spotify.com/artist/" as const
const USER_URL_PREFIX = "https://open.spotify.com/user/" as const
const ALBUM_URL_PREFIX = "https://open.spotify.com/album/" as const
const PAGE_URL_PREFIX = "https://open.spotify.com/genre/" as const
const SECTION_URL_PREFIX = "https://open.spotify.com/section/" as const
const PLAYLIST_URL_PREFIX = "https://open.spotify.com/playlist/" as const
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

Type.Feed.Playlists = "PLAYLISTS"
Type.Feed.Albums = "ALBUMS"

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
source.isChannelUrl = isChannelUrl
source.getChannel = getChannel

source.getChannelCapabilities = getChannelCapabilities
source.getChannelContents = getChannelContents
// source.getSearchChannelContentsCapabilities = getSearchChannelContentsCapabilities
// source.searchChannelContents = searchChannelContents

source.isContentDetailsUrl = isContentDetailsUrl
source.getContentDetails = getContentDetails

source.isPlaylistUrl = isPlaylistUrl
// source.searchPlaylists = searchPlaylists
source.getPlaylist = getPlaylist

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
        // the token stored in state might be old
        check_and_update_token()
    } else {
        const { token_response, user_data } = download_bearer_token()
        const bearer_token = token_response.accessToken

        // download license uri and get logged in user
        const get_license_url_url = "https://gue1-spclient.spotify.com/melody/v1/license_url?keysystem=com.widevine.alpha&sdk_name=harmony&sdk_version=4.41.0"
        const profile_attributes_url = "https://api-partner.spotify.com/pathfinder/v1/query?operationName=profileAttributes&variables=%7B%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2253bcb064f6cd18c23f752bc324a791194d20df612d8e1239c735144ab0399ced%22%7D%7D"
        const responses = local_http
            .batch()
            .GET(
                get_license_url_url,
                { Authorization: `Bearer ${bearer_token}` },
                false
            )
            .GET(
                profile_attributes_url,
                { Authorization: `Bearer ${bearer_token}` },
                false
            )
            .execute()
        if (responses[0] === undefined || responses[1] === undefined) {
            throw new ScriptException("unreachable")
        }

        const get_license_response: GetLicenseResponse = JSON.parse(
            responses[0].body
        )
        const license_uri = `https://gue1-spclient.spotify.com/${get_license_response.uri}`

        const profile_attributes_response: ProfileAttributesResponse = JSON.parse(
            responses[1].body
        )
        let state: State = {
            bearer_token,
            expiration_timestamp_ms: token_response.accessTokenExpirationTimestampMs,
            license_uri: license_uri,
            is_premium: user_data.isPremium
        }
        if (profile_attributes_response.data.me !== null) {
            state = {
                ...state,
                username: profile_attributes_response.data.me.profile.username
            }
        }
        if ("userCountry" in user_data) {
            state = { ...state, country: user_data.userCountry }
        }
        local_state = state
    }
}
function download_bearer_token() {
    if (bridge.isLoggedIn()) {
        const home_page = "https://open.spotify.com"
        const regex = /<script id="config" data-testid="config" type="application\/json">({.*?})<\/script><script id="session" data-testid="session" type="application\/json">({.*?})<\/script>/

        // use the authenticated client to get a logged in bearer token
        const html = local_http.GET(home_page, {}, true).body

        const match_result = html.match(regex)
        if (match_result === null || match_result[1] === undefined || match_result[2] === undefined) {
            throw new ScriptException("regex error")
        }

        const user_data: {
            readonly isPremium: boolean
            readonly userCountry: string
        } = JSON.parse(match_result[1])

        const token_response: {
            readonly accessToken: string,
            readonly accessTokenExpirationTimestampMs: number
        } = JSON.parse(match_result[2])
        return { token_response, user_data }
    }
    const get_access_token_url = "https://open.spotify.com/get_access_token?reason=transport&productType=web-player"

    // use the authenticated client to get a logged in bearer token
    const access_token_response = local_http.GET(get_access_token_url, {}, true).body

    const token_response: {
        readonly accessToken: string,
        readonly accessTokenExpirationTimestampMs: number
    } = JSON.parse(access_token_response)
    return { token_response, user_data: { isPremium: false } }
}
function check_and_update_token() {
    // renew the token with 30 seconds to spare
    if (Date.now() - 30 * 1000 < local_state.expiration_timestamp_ms) {
        return
    }
    log("Spotify log: refreshing bearer token")
    const { token_response, user_data } = download_bearer_token()
    let state: State = {
        bearer_token: token_response.accessToken,
        expiration_timestamp_ms: token_response.accessTokenExpirationTimestampMs,
        license_uri: local_state.license_uri,
        is_premium: user_data.isPremium
    }
    if (local_state.username !== undefined) {

        state = { ...state, username: local_state.username }
    }
    if (local_state.country !== undefined) {

        state = { ...state, country: local_state.country }
    }
    if ("userCountry" in user_data) {
        state = { ...state, country: user_data.userCountry }
    }
    local_state = state
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
    check_and_update_token()
    const { url, headers } = home_args(10)
    const { url: new_url, headers: new_heaers } = whats_new_args(0, 50)
    const responses = local_http
        .batch()
        .GET(url, headers, false)
        .GET(new_url, new_heaers, false)
        .execute()
    if (responses[0] === undefined || responses[1] === undefined) {
        throw new ScriptException("unreachable")
    }
    const home_response: HomeResponse = JSON.parse(responses[0].body)
    const sections: Section[] = home_response.data.home.sectionContainer.sections.items
    if (bridge.isLoggedIn()) {
        const whats_new_response: WhatsNewResponse = JSON.parse(responses[1].body)
        sections.push({
            data: {
                __typename: "WhatsNewSectionData",
                title: {
                    text: "What's New"
                },
            },
            section_url: "https://open.spotify.com/content-feed",
            sectionItems: whats_new_response.data.whatsNewFeedItems
        })
    }
    const playlists = format_page(home_response.data.home.sectionContainer.sections.items, 4)
    return new ContentPager(playlists, false)
}
function whats_new_args(offset: number, limit: number): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        offset,
        limit,
        onlyUnPlayedItems: false,
        includedContentTypes: []
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "4c3281ff1c1c0b67f56e4a77568d6b143da7cf1260266ed5d5147a5e49481493"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryWhatsNewFeed")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
/**
 * 
 * @param limit has incosistent behavior use 10 because that's what the spotify homepage uses
 * @returns 
 */
function home_args(limit: number): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        /** usually something like America/Chicago */
        timeZone: "America/Chicago", // TODO figure out a way to calculate this in Grayjay (maybe a setting) Intl.DateTimeFormat().resolvedOptions().timeZone,
        /** usually the logged in user cookie */
        sp_t: "",
        /** usually something like US */
        country: "US",
        facet: null,
        sectionItemsLimit: limit
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "a68635e823cd71d9f6810ec221d339348371ef0b878ec6b846fc36b234219c59"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "home")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
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
    check_and_update_token()
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
            if (local_state.is_premium) {
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
                            throw assert_exhaustive(lyrics_response.lyrics.language, "unreachable")
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

            const format = local_state.is_premium ? "MP4_256" : "MP4_128"

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
                            throw assert_exhaustive(format, "unreachable")
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

            const { url, headers } = episode_metadata_args(content_uri_id)

            const episode_metadata_response: EpisodeMetadataResponse = JSON.parse(
                local_http.GET(url, headers, false).body
            )

            if (!episode_metadata_response.data.episodeUnionV2.playability.playable) {
                throw new UnavailableException("login or purchase to play premium content")
            }

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

            const limited_show_metadata =
                episode_metadata_response.data.episodeUnionV2.__typename === "Chapter"
                    ? episode_metadata_response.data.episodeUnionV2.audiobookV2.data
                    : episode_metadata_response.data.episodeUnionV2.podcastV2.data

            const show_uri_id = id_from_uri(limited_show_metadata.uri)
            const highest_quality_cover_art = limited_show_metadata.coverArt.sources.reduce(function (accumulator, current) {
                return accumulator.height > current.height ? accumulator : current
            })

            const { url: manifest_url, headers: manifest_headers } = file_manifest_args(maybe_file_id)
            const { url: show_metadata_url, headers: show_metadata_headers } = show_metadata_args(show_uri_id)
            const batch = local_http
                .batch()
                .GET(show_metadata_url, show_metadata_headers, false)
                .GET(manifest_url, manifest_headers, false)
            if (episode_metadata_response.data.episodeUnionV2.transcripts !== undefined) {
                const { url, headers } = transcript_args(content_uri_id)
                batch.GET(url, headers, false)
            }
            const results = batch.execute()
            if (results[0] === undefined || results[1] === undefined) {
                throw new ScriptException("unreachable")
            }
            const full_show_metadata: ShowMetadataResponse = JSON.parse(results[0].body)
            const file_manifest: FileManifestResponse = JSON.parse(results[1].body)

            const subtitles = function (): ISubtitleSource[] {
                if (results[2] === undefined || results[2].code === 404) {
                    return []
                }
                const transcript_response: TranscriptResponse = JSON.parse(results[2].body)
                const subtitle_name = function () {
                    switch (transcript_response.language) {
                        case "en":
                            return "English"
                        default:
                            throw assert_exhaustive(transcript_response.language, "unreachable")
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
                return [{
                    url: episode_url,
                    name: subtitle_name,
                    getSubtitles() {
                        return vtt_text
                    },
                    format: "text/vtt",
                }]
            }()

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

            const datetime = function () {
                if (episode_metadata_response.data.episodeUnionV2.__typename === "Episode") {
                    return new Date(episode_metadata_response.data.episodeUnionV2.releaseDate.isoString).getTime() / 1000
                } else if (full_show_metadata.data.podcastUnionV2.__typename === "Audiobook") {
                    return new Date(full_show_metadata.data.podcastUnionV2.publishDate.isoString).getTime() / 1000
                }
                throw new ScriptException("unreachable")
            }()

            return new PlatformVideoDetails({
                id: new PlatformID(PLATFORM, content_uri_id, plugin.config.id),
                name: episode_metadata_response.data.episodeUnionV2.name,
                author: new PlatformAuthorLink(
                    new PlatformID(PLATFORM, show_uri_id, plugin.config.id),
                    limited_show_metadata.name,
                    `${SHOW_URL_PREFIX}${show_uri_id}`,
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
                datetime,
                description: episode_metadata_response.data.episodeUnionV2.htmlDescription,
                video: new UnMuxVideoSourceDescriptor([], audio_sources),
                rating: new RatingScaler(full_show_metadata.data.podcastUnionV2.rating.averageRating.average),
                subtitles
            })
        }
        default:
            throw assert_exhaustive(content_type, "unreachable")
    }
}

function show_metadata_args(show_uri_id: string): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:show:${show_uri_id}`
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
    check_and_update_token()
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
            throw assert_exhaustive(playlist_type, "unreachable")
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

//#region channel
// https://open.spotify.com/show/4Pgcpzc9b3qTxyUr9DkXEn
// https://open.spotify.com/show/5VzFvh1JlEhBMS6ZHZ8CNO
// https://open.spotify.com/artist/1HtB6hptdVyK6cBTm9SMTu
// https://open.spotify.com/user/zelladay
// https://open.spotify.com/genre/0JQ5DAt0tbjZptfcdMSKl3
// https://open.spotify.com/genre/section0JQ5DACFo5h0jxzOyHOsIe
function isChannelUrl(url: string): boolean {
    return CHANNEL_REGEX.test(url)
}
function getChannel(url: string): PlatformChannel {
    check_and_update_token()
    const { channel_type, channel_uri_id } = parse_channel_url(url)
    switch (channel_type) {
        case "section": {
            // use limit of 4 to load minimal data but try to guarantee that we can get a cover photo
            const limit = 4

            const { url, headers } = browse_section_args(channel_uri_id, 0, limit)
            const browse_section_response: BrowseSectionResponse = JSON.parse(local_http.GET(url, headers, false).body)
            const name = browse_section_response.data.browseSection.data.title.transformedLabel
            const channel_url = `${SECTION_URL_PREFIX}${channel_uri_id}`
            const section = browse_section_response.data.browseSection

            const section_items = section.sectionItems.items.flatMap(function (section_item) {
                const section_item_content = section_item.content.data
                if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                    return [section_item_content]
                }
                return []
            })
            const first_section_item = section_items?.[0]
            if (first_section_item === undefined) {
                throw new LoginRequiredException("login to view custom genres")
            }
            const first_playlist_image = first_section_item.__typename === "Album"
                ? first_section_item.coverArt.sources[0]?.url
                : first_section_item.images.items[0]?.sources[0]?.url

            if (first_playlist_image === undefined) {
                throw new ScriptException("missing playlist image")
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name,
                thumbnail: first_playlist_image,
                url: channel_url
            })
        }
        case "genre": {
            // use limit of 4 to load minimal data but try to guarantee that we can get a cover photo
            const limit = 4

            const { url, headers } = browse_page_args(channel_uri_id, { offset: 0, limit }, { offset: 0, limit })
            const browse_page_response: BrowsePageResponse = JSON.parse(local_http.GET(url, headers, false).body)
            if (browse_page_response.data.browse.__typename === "GenericError") {
                throw new ScriptException("error loading genre page")
            }
            const name = browse_page_response.data.browse.header.title.transformedLabel
            const sections = browse_page_response.data.browse.sections.items.flatMap(function (item): (GenrePlaylistSection | HomePlaylistSection | WhatsNewSection)[] {
                if (is_playlist_section(item)) {
                    return [item]
                }
                return []
            })
            const channel_url = `${PAGE_URL_PREFIX}${channel_uri_id}`


            const section_items = sections[0]?.sectionItems.items.flatMap(function (section_item) {
                const section_item_content = section_item.content.data
                if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                    return [section_item_content]
                }
                return []
            })
            const first_section_item = section_items?.[0]
            if (first_section_item === undefined) {
                throw new LoginRequiredException("login to view custom genres")
            }
            const first_section_first_playlist_image = first_section_item.__typename === "Album"
                ? first_section_item.coverArt.sources[0]?.url
                : first_section_item.images.items[0]?.sources[0]?.url

            if (first_section_first_playlist_image === undefined) {
                throw new ScriptException("missing playlist image")
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name,
                thumbnail: first_section_first_playlist_image,
                url: channel_url
            })
        }
        case "show": {
            const { url, headers } = show_metadata_args(channel_uri_id)
            const show_response: ShowMetadataResponse = JSON.parse(local_http.GET(url, headers, false).body)

            const sources = show_response.data.podcastUnionV2.coverArt.sources
            const thumbnail = sources[sources.length - 1]?.url
            if (thumbnail === undefined) {
                throw new ScriptException("missing cover art")
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name: show_response.data.podcastUnionV2.name,
                thumbnail,
                url: `${SHOW_URL_PREFIX}${channel_uri_id}`,
                description: show_response.data.podcastUnionV2.htmlDescription
            })

        }
        case "user": {
            const url = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${channel_uri_id}?playlist_limit=0&artist_limit=0&episode_limit=0`
            const user_response: {
                readonly name: string
                readonly image_url: string
                readonly followers_count: number
            } = JSON.parse(local_http.GET(
                url,
                { Authorization: `Bearer ${local_state.bearer_token}` },
                false
            ).body)
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name: user_response.name,
                thumbnail: user_response.image_url,
                url: `${USER_URL_PREFIX}${channel_uri_id}`,
                subscribers: user_response.followers_count
            })
        }
        case "artist":
            const { url, headers } = artist_metadata_args(channel_uri_id)
            const artist_metadata_response: ArtistMetadataResponse = JSON.parse(local_http.GET(url, headers, false).body)
            const thumbnail = artist_metadata_response.data.artistUnion.visuals.avatarImage.sources[0]?.url
            const banner = artist_metadata_response.data.artistUnion.visuals.headerImage.sources[0]?.url
            if (thumbnail === undefined) {
                throw new ScriptException("missing artist thumbnail")
            }
            const channel = {
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name: artist_metadata_response.data.artistUnion.profile.name,
                thumbnail,
                url: `${ARTIST_URL_PREFIX}${channel_uri_id}`,
                subscribers: artist_metadata_response.data.artistUnion.stats.monthlyListeners,
                description: artist_metadata_response.data.artistUnion.profile.biography.text
            }
            if (banner === undefined) {
                return new PlatformChannel(channel)
            }
            return new PlatformChannel({
                ...channel,
                banner
            })
        case "content-feed":
            throw new ScriptException("not implemented")
        default:
            throw assert_exhaustive(channel_type, "unreachable")
    }
}
function is_playlist_section(item: Section): item is GenrePlaylistSection | HomePlaylistSection | WhatsNewSection {
    return item.data.__typename === "BrowseGenericSectionData"
        || item.data.__typename === "HomeGenericSectionData"
        || item.data.__typename === "WhatsNewSectionData"
}
function browse_page_args(
    page_uri_id: string,
    pagePagination: {
        offset: number,
        limit: number
    },
    sectionPagination: {
        offset: number,
        limit: number
    }): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:page:${page_uri_id}`,
        pagePagination,
        sectionPagination
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "177a4ae12a90e35d335f060216ce5df7864a228c6ca262bd5ed90b37c2419dd9"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "browsePage")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
function parse_channel_url(url: string) {
    const match_result = url.match(CHANNEL_REGEX)
    if (match_result === null) {
        throw new ScriptException("regex error")
    }
    const maybe_channel_type = match_result[1]
    if (maybe_channel_type === undefined) {
        throw new ScriptException("regex error")
    }
    const is_section = match_result[2] === "section"
    let channel_type: ChannelType = maybe_channel_type as ChannelType
    if (is_section) {
        channel_type = "section"
    }
    const channel_uri_id = match_result[3]
    if (channel_uri_id === undefined) {
        throw new ScriptException("regex error")
    }
    return { channel_type, channel_uri_id }
}
//#endregion

//#region channel content
function getChannelCapabilities() {
    return new ResultCapabilities<FilterGroupIDs, ChannelTypeCapabilities>(
        [
            Type.Feed.Playlists,
            Type.Feed.Albums,
            Type.Feed.Videos
        ],
        [
            Type.Order.Chronological
        ],
        []
    )
}
function getChannelContents(url: string, type: ChannelTypeCapabilities | null, order: Order | null, filters: FilterQuery<FilterGroupIDs> | null): ContentPager {
    if (filters !== null) {
        throw new ScriptException("unreachable")
    }
    if (order !== "CHRONOLOGICAL") {
        throw new ScriptException("unreachable")
    }
    if (type !== Type.Feed.Videos) {
        throw new ScriptException("unreachable")
    }
    check_and_update_token()
    const { channel_type, channel_uri_id } = parse_channel_url(url)
    switch (channel_type) {
        case "section": {
            const initial_limit = 20
            const { url, headers } = browse_section_args(channel_uri_id, 0, initial_limit)
            const browse_section_response: BrowseSectionResponse = JSON.parse(local_http.GET(url, headers, false).body)

            const name = browse_section_response.data.browseSection.data.title.transformedLabel
            const section = browse_section_response.data.browseSection

            const section_uri_id = channel_uri_id
            const section_items = section.sectionItems.items.flatMap(function (section_item) {
                const section_item_content = section_item.content.data
                if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                    return [section_item_content]
                }
                return []
            })
            if (section_items.length === 0) {
                return new ContentPager([], false)
            }
            const first_section_item = section_items[0]
            if (first_section_item === undefined) {
                throw new ScriptException("no section items")
            }

            const author = new PlatformAuthorLink(
                new PlatformID(PLATFORM, section_uri_id, plugin.config.id),
                name,
                `${SECTION_URL_PREFIX}${section_uri_id}`,
                first_section_item.__typename === "Album"
                    ? first_section_item.coverArt.sources[0]?.url
                    : first_section_item.images.items[0]?.sources[0]?.url
            )
            return new SectionPager(channel_uri_id, section_items, 0, initial_limit, author, section.sectionItems.totalCount > initial_limit)
        }
        case "genre": {
            const limit = 4
            const { url, headers } = browse_page_args(channel_uri_id, { offset: 0, limit: 50 }, { offset: 0, limit: limit })
            const browse_page_response: BrowsePageResponse = JSON.parse(local_http.GET(url, headers, false).body)

            if (browse_page_response.data.browse.__typename === "GenericError") {
                throw new ScriptException("error loading genre page")
            }
            const playlists = format_page(browse_page_response.data.browse.sections.items, limit)

            return new ContentPager(playlists, false)
        }
        case "show":
            const { url: metadata_url, headers: metadata_headers } = show_metadata_args(channel_uri_id)
            const chapters_limit = 50
            const episodes_limit = 6
            const { url: chapters_url, headers: chapters_headers } = book_chapters_args(channel_uri_id, 0, chapters_limit)
            const { url: episodes_url, headers: episodes_headers } = podcast_episodes_args(channel_uri_id, 0, episodes_limit)
            const responses = local_http
                .batch()
                .GET(metadata_url, metadata_headers, false)
                .GET(chapters_url, chapters_headers, false)
                .GET(episodes_url, episodes_headers, false)
                .execute()
            if (responses[0] === undefined || responses[1] === undefined || responses[2] === undefined) {
                throw new ScriptException("unreachable")
            }
            const show_metadata_response: ShowMetadataResponse = JSON.parse(responses[0].body)
            const author = new PlatformAuthorLink(
                new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                show_metadata_response.data.podcastUnionV2.name,
                `${SHOW_URL_PREFIX}${channel_uri_id}`,
                show_metadata_response.data.podcastUnionV2.coverArt.sources[0]?.url
            )
            switch (show_metadata_response.data.podcastUnionV2.__typename) {
                case "Audiobook": {
                    const chapters_response: BookChaptersResponse = JSON.parse(responses[1].body)
                    const publish_date_time = new Date(show_metadata_response.data.podcastUnionV2.publishDate.isoString).getTime() / 1000

                    return new ChapterPager(channel_uri_id, chapters_response, 0, chapters_limit, author, publish_date_time)
                }
                case "Podcast": {
                    const episodes_response: PodcastEpisodesResponse = JSON.parse(responses[2].body)
                    return new EpisodePager(channel_uri_id, episodes_response, 0, episodes_limit, author)
                }
                default:
                    throw assert_exhaustive(show_metadata_response.data.podcastUnionV2, "unreachable")
            }
        case "artist":
            return new ArtistDiscographyPager(channel_uri_id, 0, 50)
        case "user":
            return new UserPlaylistPager(channel_uri_id, 0, 50)
        case "content-feed":
            throw new ScriptException("not implemented")
        default:
            throw assert_exhaustive(channel_type, "unreachable")
    }
}
/**
 * 
 * @param sections 
 * @param display_limit maximum number of items to display per section
 * @returns 
 */
function format_page(sections: Section[], display_limit: number): (PlatformPlaylist | PlatformVideo)[] {
    const filtered_sections = sections.flatMap(function (item): (GenrePlaylistSection | HomePlaylistSection | WhatsNewSection)[] {
        if (is_playlist_section(item)) {
            return [item]
        }
        return []
    })
    const content = filtered_sections.flatMap(function (section) {
        const section_title = section.data.title
        const section_name = "text" in section_title ? section_title.text : section_title.transformedLabel

        const section_items = section.sectionItems.items.flatMap(function (section_item) {
            const section_item_content = section_item.content.data
            if (section_item_content.__typename === "Playlist"
                || section_item_content.__typename === "Album"
                || section_item_content.__typename === "Episode"
            ) {
                return [section_item_content]
            }
            return []
        })
        if (section_items.length === 0) {
            return []
        }
        const first_section_item = section_items[0]
        if (first_section_item === undefined) {
            throw new ScriptException("no sections")
        }


        const author = function () {
            if ("section_url" in section) {
                return new PlatformAuthorLink(
                    new PlatformID(PLATFORM, section.section_url, plugin.config.id),
                    section_name,
                    section.section_url,
                    first_section_item.__typename === "Playlist"
                        ? first_section_item.images.items[0]?.sources[0]?.url
                        : first_section_item.coverArt.sources[0]?.url
                )
            }
            return new PlatformAuthorLink(
                new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id),
                section_name,
                `${SECTION_URL_PREFIX}${id_from_uri(section.uri)}`,
                first_section_item.__typename === "Playlist"
                    ? first_section_item.images.items[0]?.sources[0]?.url
                    : first_section_item.coverArt.sources[0]?.url
            )
        }()
        return section_items.map(function (playlist) {
            return format_section_item(playlist, author)
        }).slice(0, display_limit)
    })
    return content
}
class ArtistDiscographyPager extends PlaylistPager {
    private offset: number
    private readonly artist: PlatformAuthorLink
    private readonly total_albums: number
    constructor(
        private readonly artist_uri_id: string,
        offset: number,
        private readonly limit: number

    ) {
        const { url: metadata_url, headers: metadata_headers } = artist_metadata_args(artist_uri_id)
        const { url: discography_url, headers: discography_headers } = discography_args(artist_uri_id, offset, limit)
        const responses = local_http
            .batch()
            .GET(metadata_url, metadata_headers, false)
            .GET(discography_url, discography_headers, false)
            .execute()
        if (responses[0] === undefined || responses[1] === undefined) {
            throw new ScriptException("unreachable")
        }
        const metadata_response: ArtistMetadataResponse = JSON.parse(responses[0].body)
        const discography_response: DiscographyResponse = JSON.parse(responses[1].body)

        const avatar_url = metadata_response.data.artistUnion.visuals.avatarImage.sources[0]?.url
        if (avatar_url === undefined) {
            throw new ScriptException("unreachable")
        }
        const author = new PlatformAuthorLink(
            new PlatformID(PLATFORM, artist_uri_id, plugin.config.id),
            metadata_response.data.artistUnion.profile.name,
            `${ARTIST_URL_PREFIX}${artist_uri_id}`,
            avatar_url,
            metadata_response.data.artistUnion.stats.monthlyListeners
        )
        const total_albums = discography_response.data.artistUnion.discography.all.totalCount

        super(format_discography(discography_response, author), total_albums > offset + limit)

        this.artist = author
        this.offset = offset + limit
        this.total_albums = total_albums
    }
    override nextPage(this: ArtistDiscographyPager): ArtistDiscographyPager {
        const { url, headers } = discography_args(this.artist_uri_id, this.offset, this.limit)
        const discography_response: DiscographyResponse = JSON.parse(local_http.GET(url, headers, false).body)
        this.results = format_discography(discography_response, this.artist)
        this.hasMore = this.total_albums > this.offset + this.limit
        this.offset = this.offset + this.limit
        return this
    }
    override hasMorePagers(this: ArtistDiscographyPager): boolean {
        return this.hasMore
    }
}
function format_discography(discography_response: DiscographyResponse, artist: PlatformAuthorLink) {
    return discography_response.data.artistUnion.discography.all.items.map(function (album) {
        const first_release = album.releases.items[0]
        if (first_release === undefined) {
            throw new ScriptException("unreachable")
        }
        const thumbnail = first_release.coverArt.sources[0]?.url
        if (thumbnail === undefined) {
            throw new ScriptException("unreachable")
        }
        return new PlatformPlaylist({
            id: new PlatformID(PLATFORM, first_release.id, plugin.config.id),
            name: first_release.name,
            author: artist,
            datetime: new Date(first_release.date.isoString).getTime() / 1000,
            url: `${ALBUM_URL_PREFIX}${first_release.id}`,
            videoCount: first_release.tracks.totalCount,
            thumbnail
        })
    })
}
function discography_args(
    artist_uri_id: string,
    offset: number,
    limit: number
): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:artist:${artist_uri_id}`,
        offset,
        limit

    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9380995a9d4663cbcb5113fef3c6aabf70ae6d407ba61793fd01e2a1dd6929b0"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryArtistDiscographyAll")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
function format_section_item(section: SectionItemAlbum | SectionItemPlaylist | SectionItemEpisode, section_as_author: PlatformAuthorLink): PlatformVideo | PlatformPlaylist {
    switch (section.__typename) {
        case "Album":
            {
                const album_artist = section.artists.items[0]
                if (album_artist === undefined) {
                    throw new ScriptException("missing album artist")
                }
                const cover_art_url = section.coverArt.sources[0]?.url
                if (cover_art_url === undefined) {
                    throw new ScriptException("missing album cover art")
                }
                return new PlatformPlaylist({
                    id: new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id),
                    name: section.name,
                    author: new PlatformAuthorLink(
                        new PlatformID(PLATFORM, id_from_uri(album_artist.uri), plugin.config.id),
                        album_artist.profile.name,
                        `${ARTIST_URL_PREFIX}${id_from_uri(album_artist.uri)}`
                    ),
                    // TODO load datetime another way datetime: ,
                    url: `${ALBUM_URL_PREFIX}${id_from_uri(section.uri)}`,
                    // TODO load video count some other way videoCount?: number
                    thumbnail: cover_art_url
                })
            }
        case "Playlist": {
            const created_iso = section.attributes.find(function (attribute) {
                return attribute.key === "created"
            })?.value
            const image_url = section.images.items[0]?.sources[0]?.url
            if (image_url === undefined) {
                throw new ScriptException("missing playlist thumbnail")
            }
            if (section.ownerV2.data.name !== "Spotify") {
                throw new ScriptException("unhandled playlist owner")
            }
            const platform_playlist = {
                id: new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id),
                url: `${PLAYLIST_URL_PREFIX}${id_from_uri(section.uri)}`,
                name: section.name,
                author: section_as_author,
                // TODO load some other way videoCount:
                thumbnail: image_url
            }
            if (created_iso !== undefined) {
                return new PlatformPlaylist({
                    ...platform_playlist,
                    datetime: new Date(created_iso).getTime() / 1000
                })
            }
            return new PlatformPlaylist(platform_playlist)
        }
        case "Episode": {
            return new PlatformVideo({
                id: new PlatformID(PLATFORM, section.id, plugin.config.id),
                name: section.name,
                author: new PlatformAuthorLink(
                    new PlatformID(PLATFORM, id_from_uri(section.podcastV2.data.uri), plugin.config.id),
                    section.podcastV2.data.name,
                    `${SHOW_URL_PREFIX}${id_from_uri(section.podcastV2.data.uri)}`,
                    section.podcastV2.data.coverArt.sources[0]?.url
                ),
                url: `${EPISODE_URL_PREFIX}${section.id}`,
                thumbnails: new Thumbnails(section.coverArt.sources.map(function (source) {
                    return new Thumbnail(source.url, source.height)
                })),
                duration: section.duration.totalMilliseconds / 1000,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: `${EPISODE_URL_PREFIX}${section.id}`,
                /** unix time */
                datetime: new Date(section.releaseDate.isoString).getTime() / 1000
            })
        }
        default:
            throw assert_exhaustive(section, "unreachable")
    }
}
class SectionPager extends ContentPager {
    private readonly limit: number
    private offset: number
    constructor(
        private readonly section_uri_id: string,
        section_items: (SectionItemAlbum | SectionItemPlaylist)[],
        offset: number,
        limit: number,
        private readonly section_as_author: PlatformAuthorLink,
        has_more: boolean
    ) {
        const playlists = section_items.map(function (section_item) {
            return format_section_item(section_item, section_as_author)
        })
        super(playlists, has_more)
        this.offset = offset + limit
        this.limit = limit
    }
    override nextPage(this: SectionPager): SectionPager {
        const { url, headers } = browse_section_args(this.section_uri_id, this.offset, this.limit)
        const browse_section_response: BrowseSectionResponse = JSON.parse(local_http.GET(url, headers, false).body)
        const section_items = browse_section_response.data.browseSection.sectionItems.items.flatMap(function (section_item) {
            const section_item_content = section_item.content.data
            if (section_item_content.__typename === "Album" || section_item_content.__typename === "Playlist") {
                return [section_item_content]
            }
            return []
        })
        const author = this.section_as_author
        if (section_items.length === 0) {
            this.results = []
        } else {
            this.results = section_items.map(function (this: SectionPager, section_item) {
                return format_section_item(section_item, author)
            })
        }

        const next_offset = browse_section_response.data.browseSection.sectionItems.pagingInfo.nextOffset
        if (next_offset !== null) {
            this.offset = next_offset
        }
        this.hasMore = next_offset !== null
        return this
    }
    override hasMorePagers(this: SectionPager): boolean {
        return this.hasMore
    }
}
function browse_section_args(
    page_uri_id: string,
    offset: number,
    limit: number
): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:section:${page_uri_id}`,
        pagination: {
            offset,
            limit
        }
    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "8cb45a0fea4341b810e6f16ed2832c7ef9d3099aaf0034ee2a0ce49afbe42748"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "browseSection")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
function book_chapters_args(
    audiobook_uri_id: string,
    offset: number,
    limit: number
): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:show:${audiobook_uri_id}`,
        offset,
        limit

    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9879e364e7cee8e656be5f003ac7956b45c5cc7dea1fd3c8039e6b5b2e1f40b4"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryBookChapters")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
function podcast_episodes_args(
    podcast_uri_id: string,
    offset: number,
    limit: number
): { readonly url: string, readonly headers: { Authorization: string } } {
    const variables = JSON.stringify({
        uri: `spotify:show:${podcast_uri_id}`,
        offset,
        limit

    })
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "108deda91e2701403d95dc39bdade6741c2331be85737b804a00de22cc0acabf"
        }
    })
    const url = new URL(QUERY_URL)
    url.searchParams.set("operationName", "queryPodcastEpisodes")
    url.searchParams.set("variables", variables)
    url.searchParams.set("extensions", extensions)
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
class ChapterPager extends VideoPager {
    private offset: number
    constructor(
        private readonly audiobook_uri_id: string,
        chapters_response: BookChaptersResponse,
        offset: number,
        private readonly limit: number,
        private readonly author: PlatformAuthorLink,
        private readonly publish_date_time: number
    ) {
        const chapters = format_chapters(chapters_response, author, publish_date_time)
        const next_offset = chapters_response.data.podcastUnionV2.chaptersV2.pagingInfo.nextOffset

        super(chapters, next_offset !== null)

        this.offset = next_offset === null ? offset : next_offset
    }
    override nextPage(this: ChapterPager): ChapterPager {
        const { url, headers } = book_chapters_args(this.audiobook_uri_id, this.offset, this.limit)
        const chapters_response: BookChaptersResponse = JSON.parse(local_http.GET(url, headers, false).body)
        const chapters = format_chapters(chapters_response, this.author, this.publish_date_time)
        const next_offset = chapters_response.data.podcastUnionV2.chaptersV2.pagingInfo.nextOffset

        this.hasMore = next_offset !== null
        this.results = chapters
        this.offset = next_offset === null ? this.offset : next_offset

        return this
    }
    override hasMorePagers(this: ChapterPager): boolean {
        return this.hasMore
    }
}
function format_chapters(chapters_response: BookChaptersResponse, author: PlatformAuthorLink, publish_date_time: number): PlatformVideo[] {
    return chapters_response.data.podcastUnionV2.chaptersV2.items.map(function (chapter_container) {
        const chapter_data = chapter_container.entity.data
        const thumbnails = new Thumbnails(chapter_data.coverArt.sources.map(function (source) {
            return new Thumbnail(source.url, source.height)
        }))
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, id_from_uri(chapter_data.uri), plugin.config.id),
            name: chapter_data.name,
            author,
            datetime: publish_date_time,
            url: `${EPISODE_URL_PREFIX}${id_from_uri(chapter_data.uri)}`,
            thumbnails,
            duration: chapter_data.duration.totalMilliseconds / 1000,
            viewCount: HARDCODED_ZERO,
            isLive: false,
            shareUrl: chapter_data.uri
        })
    })
}
class EpisodePager extends VideoPager {
    private offset: number
    constructor(
        private readonly podcast_uri_id: string,
        episodes_response: PodcastEpisodesResponse,
        offset: number,
        private readonly limit: number,
        private readonly author: PlatformAuthorLink
    ) {
        const chapters = format_episodes(episodes_response, author)
        const next_offset = episodes_response.data.podcastUnionV2.episodesV2.pagingInfo.nextOffset

        super(chapters, next_offset !== null)

        this.offset = next_offset === null ? offset : next_offset
    }
    override nextPage(this: EpisodePager): EpisodePager {
        const { url, headers } = podcast_episodes_args(this.podcast_uri_id, this.offset, this.limit)
        const chapters_response: PodcastEpisodesResponse = JSON.parse(local_http.GET(url, headers, false).body)
        const chapters = format_episodes(chapters_response, this.author)
        const next_offset = chapters_response.data.podcastUnionV2.episodesV2.pagingInfo.nextOffset

        this.hasMore = next_offset !== null
        this.results = chapters
        this.offset = next_offset === null ? this.offset : next_offset

        return this
    }
    override hasMorePagers(this: EpisodePager): boolean {
        return this.hasMore
    }
}
function format_episodes(episodes_response: PodcastEpisodesResponse, author: PlatformAuthorLink): PlatformVideo[] {
    return episodes_response.data.podcastUnionV2.episodesV2.items.map(function (chapter_container) {
        const episode_data = chapter_container.entity.data
        const thumbnails = new Thumbnails(episode_data.coverArt.sources.map(function (source) {
            return new Thumbnail(source.url, source.height)
        }))
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, id_from_uri(episode_data.uri), plugin.config.id),
            name: episode_data.name,
            author,
            datetime: new Date(episode_data.releaseDate.isoString).getTime() / 1000,
            url: `${EPISODE_URL_PREFIX}${id_from_uri(episode_data.uri)}`,
            thumbnails,
            duration: episode_data.duration.totalMilliseconds / 1000,
            viewCount: HARDCODED_ZERO,
            isLive: false,
            shareUrl: episode_data.uri
        })
    })
}
class UserPlaylistPager extends PlaylistPager {
    private offset: number
    private readonly total_playlists: number
    constructor(
        private readonly username: string,
        offset: number,
        private readonly limit: number,
    ) {
        const { url, headers } = user_playlists_args(username, offset, limit)
        const playlists_response: UserPlaylistsResponse = JSON.parse(local_http.GET(url, headers, false).body)
        const playlists = format_user_playlists(playlists_response)
        const total_playlists = playlists_response.total_public_playlists_count

        super(playlists, offset + limit < total_playlists)

        this.offset = offset + limit
        this.total_playlists = total_playlists
    }
    override nextPage(this: UserPlaylistPager): UserPlaylistPager {
        const { url, headers } = user_playlists_args(this.username, this.offset, this.limit)
        const playlists_response: UserPlaylistsResponse = JSON.parse(local_http.GET(url, headers, false).body)
        const playlists = format_user_playlists(playlists_response)

        this.hasMore = this.offset + this.limit < this.total_playlists
        this.results = playlists
        this.offset = this.offset + this.limit

        return this
    }
    override hasMorePagers(this: UserPlaylistPager): boolean {
        return this.hasMore
    }
}
function user_playlists_args(
    username: string,
    offset: number,
    limit: number
): { readonly url: string, readonly headers: { Authorization: string } } {
    const url = new URL(`https://spclient.wg.spotify.com/user-profile-view/v3/profile/${username}/playlists`)
    url.searchParams.set("offset", offset.toString())
    url.searchParams.set("limit", limit.toString())
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } }
}
function format_user_playlists(playlists_response: UserPlaylistsResponse) {
    return playlists_response.public_playlists.map(function (playlist) {
        const image_uri = playlist.image_url
        return new PlatformPlaylist({
            id: new PlatformID(PLATFORM, id_from_uri(playlist.uri), plugin.config.id),
            name: playlist.name,
            author: new PlatformAuthorLink(
                new PlatformID(PLATFORM, id_from_uri(playlist.owner_uri), plugin.config.id),
                playlist.owner_name,
                `${USER_URL_PREFIX}${id_from_uri(playlist.owner_uri)}`,
                // TODO load the owner's image somehow
            ),
            // TODO load the playlist creation or modificiation date somehow datetime?: number
            url: `${PLAYLIST_URL_PREFIX}${id_from_uri(playlist.uri)}`,
            // TODO load the video count somehow videoCount?: number
            thumbnail: url_from_image_uri(image_uri)
        })
    })
}
//#endregion

//#region utilities
function url_from_image_uri(image_uri: string) {
    const match_result = image_uri.match(/^spotify:(image|mosaic):([0-9a-zA-Z:]*)$/)
    if (match_result === null) {
        throw new ScriptException("regex error")
    }
    const image_type: "image" | "mosaic" = match_result[1] as "image" | "mosaic"
    if (image_type === undefined) {
        throw new ScriptException("regex error")
    }
    const uri_id = match_result[2]
    if (uri_id === undefined) {
        throw new ScriptException("regex error")
    }
    switch (image_type) {
        case "image":
            return `https://i.scdn.co/image/${uri_id}`
        case "mosaic":
            return `https://mosaic.scdn.co/300/${uri_id.split(":").join("")}`
        default:
            throw assert_exhaustive(image_type)
    }
}
function id_from_uri(uri: string): string {
    const match_result = uri.match(/^spotify:(show|album|track|artist|playlist|section|episode|user):([0-9a-zA-Z]*)$/)
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
function assert_exhaustive(value: never): void
function assert_exhaustive(value: never, exception_message: string): ScriptException
function assert_exhaustive(value: never, exception_message?: string): ScriptException | undefined {
    log(["Spotify log:", value])
    if (exception_message !== undefined) {
        return new ScriptException(exception_message)
    }
    return
}
//#endregion

//#region bad

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
// export {
    get_gid,
    assert_never,
    log_passthrough
}
