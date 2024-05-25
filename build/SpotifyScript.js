const CONTENT_REGEX = /^https:\/\/open\.spotify\.com\/(track|episode)\/([a-zA-Z0-9]*)($|\/)/;
const PLAYLIST_REGEX = /^https:\/\/open\.spotify\.com\/(album|playlist|collection)\/([a-zA-Z0-9]*|your-episodes|tracks)($|\/)/;
const CHANNEL_REGEX = /^https:\/\/open\.spotify\.com\/(show|artist|user|genre|section|content-feed)\/(section|)([a-zA-Z0-9]*|recently-played)($|\/)/;
const SONG_URL_PREFIX = "https://open.spotify.com/track/";
const EPISODE_URL_PREFIX = "https://open.spotify.com/episode/";
const SHOW_URL_PREFIX = "https://open.spotify.com/show/";
const ARTIST_URL_PREFIX = "https://open.spotify.com/artist/";
const USER_URL_PREFIX = "https://open.spotify.com/user/";
const ALBUM_URL_PREFIX = "https://open.spotify.com/album/";
const PAGE_URL_PREFIX = "https://open.spotify.com/genre/";
const SECTION_URL_PREFIX = "https://open.spotify.com/section/";
const PLAYLIST_URL_PREFIX = "https://open.spotify.com/playlist/";
const COLLECTION_UR_PREFIX = "https://open.spotify.com/collection/";
const QUERY_URL = "https://api-partner.spotify.com/pathfinder/v1/query";
const IMAGE_URL_PREFIX = "https://i.scdn.co/image/";
const PLATFORM = "Spotify";
// const USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0" as const
const HARDCODED_ZERO = 0;
const HARDCODED_EMPTY_STRING = "";
const EMPTY_AUTHOR = new PlatformAuthorLink(new PlatformID(PLATFORM, "", plugin.config.id), "", "");
const local_http = http;
// const local_utility = utility
// set missing constants
Type.Order.Chronological = "Latest releases";
Type.Order.Views = "Most played";
Type.Order.Favorites = "Most favorited";
Type.Feed.Playlists = "PLAYLISTS";
Type.Feed.Albums = "ALBUMS";
/** State */
let local_state;
//#endregion
//#region source methods
source.enable = enable;
source.disable = disable;
source.saveState = saveState;
source.getHome = getHome;
source.getSearchCapabilities = getSearchCapabilities;
source.search = search;
source.searchChannels = searchChannels;
source.isChannelUrl = isChannelUrl;
source.getChannel = getChannel;
source.getChannelCapabilities = getChannelCapabilities;
source.getChannelContents = getChannelContents;
source.isContentDetailsUrl = isContentDetailsUrl;
source.getContentDetails = getContentDetails;
source.isPlaylistUrl = isPlaylistUrl;
source.searchPlaylists = searchPlaylists;
source.getPlaylist = getPlaylist;
source.getUserSubscriptions = getUserSubscriptions;
source.getUserPlaylists = getUserPlaylists;
source.getPlaybackTracker = getPlaybackTracker;
if (IS_TESTING) {
    const assert_source = {
        enable,
        disable,
        saveState,
        getHome,
        search,
        getSearchCapabilities,
        isContentDetailsUrl,
        getContentDetails,
        isChannelUrl,
        getChannel,
        getChannelContents,
        getChannelCapabilities,
        searchChannels,
        isPlaylistUrl,
        getPlaylist,
        searchPlaylists,
        getUserPlaylists,
        getUserSubscriptions,
        getPlaybackTracker
    };
    if (source.enable === undefined) {
        assert_never(source.enable);
    }
    if (source.disable === undefined) {
        assert_never(source.disable);
    }
    if (source.saveState === undefined) {
        assert_never(source.saveState);
    }
    if (source.getHome === undefined) {
        assert_never(source.getHome);
    }
    if (source.search === undefined) {
        assert_never(source.search);
    }
    if (source.getSearchCapabilities === undefined) {
        assert_never(source.getSearchCapabilities);
    }
    if (source.isContentDetailsUrl === undefined) {
        assert_never(source.isContentDetailsUrl);
    }
    if (source.getContentDetails === undefined) {
        assert_never(source.getContentDetails);
    }
    if (source.isChannelUrl === undefined) {
        assert_never(source.isChannelUrl);
    }
    if (source.getChannel === undefined) {
        assert_never(source.getChannel);
    }
    if (source.getChannelContents === undefined) {
        assert_never(source.getChannelContents);
    }
    if (source.getChannelCapabilities === undefined) {
        assert_never(source.getChannelCapabilities);
    }
    if (source.searchChannels === undefined) {
        assert_never(source.searchChannels);
    }
    if (source.isPlaylistUrl === undefined) {
        assert_never(source.isPlaylistUrl);
    }
    if (source.getPlaylist === undefined) {
        assert_never(source.getPlaylist);
    }
    if (source.searchPlaylists === undefined) {
        assert_never(source.searchPlaylists);
    }
    if (source.getUserPlaylists === undefined) {
        assert_never(source.getUserPlaylists);
    }
    if (source.getUserSubscriptions === undefined) {
        assert_never(source.getUserSubscriptions);
    }
    if (source.getPlaybackTracker === undefined) {
        assert_never(source.getPlaybackTracker);
    }
    if (IS_TESTING) {
        log(assert_source);
    }
}
//#endregion
//#region enable
function enable(conf, settings, savedState) {
    if (IS_TESTING) {
        log("IS_TESTING true");
        log("logging configuration");
        log(conf);
        log("logging settings");
        log(settings);
        log("logging savedState");
        log(savedState);
    }
    if (savedState !== null) {
        const state = JSON.parse(savedState);
        local_state = state;
        // the token stored in state might be old
        check_and_update_token();
    }
    else {
        const { token_response, user_data } = download_bearer_token();
        const bearer_token = token_response.accessToken;
        // download license uri and get logged in user
        const get_license_url_url = "https://gue1-spclient.spotify.com/melody/v1/license_url?keysystem=com.widevine.alpha&sdk_name=harmony&sdk_version=4.41.0";
        const profile_attributes_url = "https://api-partner.spotify.com/pathfinder/v1/query?operationName=profileAttributes&variables=%7B%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%2253bcb064f6cd18c23f752bc324a791194d20df612d8e1239c735144ab0399ced%22%7D%7D";
        const responses = local_http
            .batch()
            .GET(get_license_url_url, { Authorization: `Bearer ${bearer_token}` }, false)
            .GET(profile_attributes_url, { Authorization: `Bearer ${bearer_token}` }, false)
            .execute();
        if (responses[0] === undefined || responses[1] === undefined) {
            throw new ScriptException("unreachable");
        }
        const get_license_response = JSON.parse(responses[0].body);
        const license_uri = `https://gue1-spclient.spotify.com/${get_license_response.uri}`;
        const profile_attributes_response = JSON.parse(responses[1].body);
        let state = {
            bearer_token,
            expiration_timestamp_ms: token_response.accessTokenExpirationTimestampMs,
            license_uri: license_uri,
            is_premium: user_data.isPremium
        };
        if (profile_attributes_response.data.me !== null) {
            state = {
                ...state,
                username: profile_attributes_response.data.me.profile.username
            };
        }
        if ("userCountry" in user_data) {
            state = { ...state, country: user_data.userCountry };
        }
        local_state = state;
    }
}
function download_bearer_token() {
    if (bridge.isLoggedIn()) {
        const home_page = "https://open.spotify.com";
        const regex = /<script id="config" data-testid="config" type="application\/json">({.*?})<\/script><script id="session" data-testid="session" type="application\/json">({.*?})<\/script>/;
        // use the authenticated client to get a logged in bearer token
        const html = local_http.GET(home_page, {}, true).body;
        const match_result = html.match(regex);
        if (match_result === null || match_result[1] === undefined || match_result[2] === undefined) {
            throw new ScriptException("regex error");
        }
        const user_data = JSON.parse(match_result[1]);
        const token_response = JSON.parse(match_result[2]);
        return { token_response, user_data };
    }
    const get_access_token_url = "https://open.spotify.com/get_access_token?reason=transport&productType=web-player";
    // use the authenticated client to get a logged in bearer token
    const access_token_response = local_http.GET(get_access_token_url, {}, true).body;
    const token_response = JSON.parse(access_token_response);
    return { token_response, user_data: { isPremium: false } };
}
function check_and_update_token() {
    // renew the token with 30 seconds to spare
    if (Date.now() - 30 * 1000 < local_state.expiration_timestamp_ms) {
        return;
    }
    log("Spotify log: refreshing bearer token");
    const { token_response, user_data } = download_bearer_token();
    let state = {
        bearer_token: token_response.accessToken,
        expiration_timestamp_ms: token_response.accessTokenExpirationTimestampMs,
        license_uri: local_state.license_uri,
        is_premium: user_data.isPremium
    };
    if (local_state.username !== undefined) {
        state = { ...state, username: local_state.username };
    }
    if (local_state.country !== undefined) {
        state = { ...state, country: local_state.country };
    }
    if ("userCountry" in user_data) {
        state = { ...state, country: user_data.userCountry };
    }
    local_state = state;
}
//#endregion
function disable() {
    log("Spotify log: disabling");
}
function saveState() {
    return JSON.stringify(local_state);
}
//#region home
function getHome() {
    check_and_update_token();
    const { url, headers } = home_args(10);
    const { url: new_url, headers: new_headers } = whats_new_args(0, 50);
    const { url: recent_url, headers: recent_headers } = recently_played_ids_args(0, 50);
    const responses = local_http
        .batch()
        .GET(url, headers, false)
        .GET(new_url, new_headers, false)
        .GET(recent_url, recent_headers, false)
        .execute();
    if (responses[0] === undefined || responses[1] === undefined || responses[2] === undefined) {
        throw new ScriptException("unreachable");
    }
    const home_response = JSON.parse(responses[0].body);
    const sections = home_response.data.home.sectionContainer.sections.items;
    if (bridge.isLoggedIn()) {
        const whats_new_response = JSON.parse(responses[1].body);
        sections.push({
            data: {
                __typename: "WhatsNewSectionData",
                title: {
                    text: "What's New"
                },
            },
            section_url: "https://open.spotify.com/content-feed",
            sectionItems: whats_new_response.data.whatsNewFeedItems
        });
        const recently_played_ids = JSON.parse(responses[2].body);
        const { url, headers } = recently_played_details_args(recently_played_ids.playContexts.map(function (uri_obj) {
            return uri_obj.uri;
        }));
        const recently_played_response = JSON.parse(local_http.GET(url, headers, false).body);
        sections.unshift({
            data: {
                __typename: "CustomRecentlyPlayedSectionData",
                title: {
                    text: "Recently played"
                },
            },
            section_url: "https://open.spotify.com/genre/recently-played",
            sectionItems: {
                items: recently_played_response.data.lookup.flatMap(function (section_item) {
                    if (section_item.__typename === "UnknownTypeWrapper") {
                        if (section_item._uri !== "spotify:user:kaioflorenzo:collection") {
                            throw new ScriptException("unexpected uri");
                        }
                        return {
                            content: {
                                data: {
                                    image: {
                                        sources: [{
                                                "height": 640,
                                                "url": "https://misc.scdn.co/liked-songs/liked-songs-640.png",
                                                "width": 640
                                            }]
                                    },
                                    name: "Liked Songs",
                                    __typename: "PseudoPlaylist",
                                    uri: "spotify:collection:tracks"
                                },
                                __typename: "LibraryPseudoPlaylistResponseWrapper"
                            }
                        };
                    }
                    return {
                        content: {
                            data: section_item.data,
                            __typename: section_item.__typename
                        }
                    };
                })
            }
        });
    }
    const playlists = format_page(sections, 4, "Home");
    return new ContentPager(playlists, false);
}
function whats_new_args(offset, limit) {
    const variables = JSON.stringify({
        offset,
        limit,
        onlyUnPlayedItems: false,
        includedContentTypes: []
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "4c3281ff1c1c0b67f56e4a77568d6b143da7cf1260266ed5d5147a5e49481493"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryWhatsNewFeed");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
/**
 *
 * @param limit has incosistent behavior use 10 because that's what the spotify homepage uses
 * @returns
 */
function home_args(limit) {
    const variables = JSON.stringify({
        /** usually something like America/Chicago */
        timeZone: "America/Chicago", // TODO figure out a way to calculate this in Grayjay (maybe a setting) Intl.DateTimeFormat().resolvedOptions().timeZone,
        /** usually the logged in user cookie */
        sp_t: "",
        /** usually something like US */
        country: "US",
        facet: null,
        sectionItemsLimit: limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "a68635e823cd71d9f6810ec221d339348371ef0b878ec6b846fc36b234219c59"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "home");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
//#endregion
//#region search
function getSearchCapabilities() {
    return new ResultCapabilities([
        Type.Feed.Videos
    ], [], []);
}
function search(query, type, order, filters) {
    if (filters !== null && Object.keys(filters).length !== 0) {
        throw new ScriptException("unreachable");
    }
    if (order !== null) {
        throw new ScriptException("unreachable");
    }
    if (type !== null) {
        throw new ScriptException("unreachable");
    }
    check_and_update_token();
    return new SearchPager(query, 0, 100);
}
class SearchPager extends VideoPager {
    query;
    limit;
    offset;
    constructor(query, offset, limit) {
        const { url, headers } = search_args(query, offset, limit);
        const search_response = JSON.parse(local_http.GET(url, headers, false).body);
        const has_more = are_more_song_and_episode_results(search_response, offset, limit);
        super(format_song_and_episode_results(search_response), has_more);
        this.query = query;
        this.limit = limit;
        this.offset = offset + limit;
    }
    nextPage() {
        const { url, headers } = search_args(this.query, this.offset, this.limit);
        const search_response = JSON.parse(local_http.GET(url, headers, false).body);
        this.results = format_song_and_episode_results(search_response);
        this.hasMore = are_more_song_and_episode_results(search_response, this.offset, this.limit);
        this.offset = this.offset + this.limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_song_and_episode_results(search_response) {
    return [
        ...search_response.data.searchV2.tracksV2.items.map(function (track) {
            const artist = track.item.data.artists.items[0];
            if (artist === undefined) {
                throw new ScriptException("missing artist");
            }
            return new PlatformVideo({
                id: new PlatformID(PLATFORM, track.item.data.id, plugin.config.id),
                name: track.item.data.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(artist.uri), plugin.config.id), artist.profile.name, `${ARTIST_URL_PREFIX}${id_from_uri(artist.uri)}`),
                url: `${SONG_URL_PREFIX}${track.item.data.id}`,
                thumbnails: new Thumbnails(track.item.data.albumOfTrack.coverArt.sources.map(function (image) {
                    return new Thumbnail(image.url, image.height);
                })),
                duration: track.item.data.duration.totalMilliseconds / 1000,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: `${SONG_URL_PREFIX}${track.item.data.id}`,
                datetime: HARDCODED_ZERO
            });
        }),
        ...search_response.data.searchV2.episodes.items.map(function (episode) {
            return new PlatformVideo({
                id: new PlatformID(PLATFORM, id_from_uri(episode.data.uri), plugin.config.id),
                name: episode.data.name,
                author: episode.data.podcastV2.data.__typename === "Podcast" ? new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(episode.data.podcastV2.data.uri), plugin.config.id), episode.data.podcastV2.data.name, `${ARTIST_URL_PREFIX}${id_from_uri(episode.data.podcastV2.data.uri)}`, episode.data.podcastV2.data.coverArt?.sources[0]?.url) : EMPTY_AUTHOR,
                url: `${EPISODE_URL_PREFIX}${id_from_uri(episode.data.uri)}`,
                thumbnails: new Thumbnails(episode.data.coverArt.sources.map(function (image) {
                    return new Thumbnail(image.url, image.height);
                })),
                duration: episode.data.duration.totalMilliseconds / 1000,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: `${EPISODE_URL_PREFIX}${id_from_uri(episode.data.uri)}`,
                datetime: episode.data.releaseDate === null ? HARDCODED_ZERO : new Date(episode.data.releaseDate.isoString).getTime() / 1000
            });
        })
    ];
}
function are_more_song_and_episode_results(search_response, current_offset, limit) {
    return search_response.data.searchV2.tracksV2.totalCount > current_offset + limit
        || search_response.data.searchV2.episodes.totalCount > current_offset + limit;
}
//#endregion
//#region content
// https://open.spotify.com/track/6XXxKsu3RJeN3ZvbMYrgQW
// https://open.spotify.com/episode/3Z88ZE0i3L7AIrymrBwtqg
function isContentDetailsUrl(url) {
    return CONTENT_REGEX.test(url);
}
function getContentDetails(url) {
    if (!bridge.isLoggedIn()) {
        throw new LoginRequiredException("login to listen to songs");
    }
    check_and_update_token();
    const { content_uri_id, content_type } = parse_content_url(url);
    switch (content_type) {
        case "track": {
            const song_url = `${SONG_URL_PREFIX}${content_uri_id}`;
            const { url: metadata_url, headers: metadata_headers } = song_metadata_args(content_uri_id);
            const { url: track_metadata_url, headers: _track_metadata_headers } = track_metadata_args(content_uri_id);
            const batch = local_http
                .batch()
                .GET(metadata_url, metadata_headers, false)
                .GET(track_metadata_url, _track_metadata_headers, false);
            if (local_state.is_premium) {
                const { url, headers } = lyrics_args(content_uri_id);
                batch.GET(url, headers, false);
            }
            const results = batch
                .execute();
            if (results[0] === undefined || results[1] === undefined) {
                throw new ScriptException("unreachable");
            }
            const song_metadata_response = JSON.parse(results[0].body);
            const track_metadata_response = JSON.parse(results[1].body);
            const first_artist = track_metadata_response.data.trackUnion.firstArtist.items[0];
            if (first_artist === undefined) {
                throw new ScriptException("missing artist");
            }
            const artist_url = `https://open.spotify.com/artist/${first_artist.id}`;
            const highest_quality_artist_cover_art = first_artist.visuals.avatarImage.sources.reduce(function (accumulator, current) {
                return accumulator.height > current.height ? accumulator : current;
            });
            let subtitles = [];
            if (results[2] !== undefined && results[2].code !== 404) {
                const lyrics_response = JSON.parse(results[2].body);
                const subtitle_name = function () {
                    switch (lyrics_response.lyrics.language) {
                        case "en":
                            return "English";
                        default:
                            throw assert_exhaustive(lyrics_response.lyrics.language, "unreachable");
                    }
                }();
                const convert = milliseconds_to_WebVTT_timestamp;
                let vtt_text = `WEBVTT ${subtitle_name}\n`;
                vtt_text += "\n";
                lyrics_response.lyrics.lines.forEach(function (line, index) {
                    const next = lyrics_response.lyrics.lines[index + 1];
                    let end = next?.startTimeMs;
                    if (end === undefined) {
                        end = track_metadata_response.data.trackUnion.duration.totalMilliseconds.toString();
                    }
                    vtt_text += `${convert(parseInt(line.startTimeMs))} --> ${convert(parseInt(end))}\n`;
                    vtt_text += `${line.words}\n`;
                    vtt_text += "\n";
                });
                subtitles = [{
                        url: song_url,
                        name: subtitle_name,
                        getSubtitles() {
                            return vtt_text;
                        },
                        format: "text/vtt",
                    }];
            }
            const format = local_state.is_premium ? "MP4_256" : "MP4_128";
            const files = song_metadata_response.file === undefined ? song_metadata_response.alternative?.[0]?.file : song_metadata_response.file;
            if (files === undefined) {
                throw new ScriptException("missing alternative file list");
            }
            const maybe_file_id = files.find(function (file) { return file.format === format; })?.file_id;
            if (maybe_file_id === undefined) {
                throw new ScriptException("missing expected format");
            }
            const { url, headers } = file_manifest_args(maybe_file_id);
            const { url: artist_metadata_url, headers: artist_metadata_headers } = artist_metadata_args(first_artist.id);
            const second_results = local_http
                .batch()
                .GET(url, headers, false)
                .GET(artist_metadata_url, artist_metadata_headers, false)
                .execute();
            if (second_results[0] === undefined || second_results[1] === undefined) {
                throw new ScriptException("unreachable");
            }
            const file_manifest = JSON.parse(second_results[0].body);
            const artist_metadata_response = JSON.parse(second_results[1].body);
            const duration = track_metadata_response.data.trackUnion.duration.totalMilliseconds / 1000;
            const file_url = file_manifest.cdnurl[0];
            if (file_url === undefined) {
                throw new ScriptException("unreachable");
            }
            const codecs = "mp4a.40.2";
            const audio_sources = [new AudioUrlWidevineSource({
                    //audio/mp4; codecs="mp4a.40.2
                    name: codecs,
                    bitrate: function (format) {
                        switch (format) {
                            case "MP4_128":
                                return 128000;
                            case "MP4_256":
                                return 256000;
                            default:
                                throw assert_exhaustive(format, "unreachable");
                        }
                    }(format),
                    container: "audio/mp4",
                    codecs,
                    duration,
                    url: file_url,
                    language: Language.UNKNOWN,
                    bearerToken: local_state.bearer_token,
                    licenseUri: local_state.license_uri
                })];
            return new PlatformVideoDetails({
                id: new PlatformID(PLATFORM, content_uri_id, plugin.config.id),
                name: song_metadata_response.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, first_artist.id, plugin.config.id), first_artist.profile.name, artist_url, highest_quality_artist_cover_art.url, artist_metadata_response.data.artistUnion.stats.monthlyListeners),
                url: song_url,
                thumbnails: new Thumbnails(song_metadata_response.album.cover_group.image.map(function (image) {
                    return new Thumbnail(`${IMAGE_URL_PREFIX}${image.file_id}`, image.height);
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
            });
        }
        case "episode": {
            const episode_url = `https://open.spotify.com/episode/${content_uri_id}`;
            const { url, headers } = episode_metadata_args(content_uri_id);
            const episode_metadata_response = JSON.parse(local_http.GET(url, headers, false).body);
            if (!episode_metadata_response.data.episodeUnionV2.playability.playable) {
                throw new UnavailableException("login or purchase to play premium content");
            }
            if (episode_metadata_response.data.episodeUnionV2.mediaTypes.length === 2) {
                function assert_video(_mediaTypes) { }
                assert_video(episode_metadata_response.data.episodeUnionV2.mediaTypes);
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
            const format = "MP4_128";
            const maybe_file_id = episode_metadata_response.data.episodeUnionV2.audio.items.find(function (file) { return file.format === format; })?.fileId;
            if (maybe_file_id === undefined) {
                throw new ScriptException("missing expected format");
            }
            const limited_show_metadata = episode_metadata_response.data.episodeUnionV2.__typename === "Chapter"
                ? episode_metadata_response.data.episodeUnionV2.audiobookV2.data
                : episode_metadata_response.data.episodeUnionV2.podcastV2.data;
            const show_uri_id = id_from_uri(limited_show_metadata.uri);
            const highest_quality_cover_art = limited_show_metadata.coverArt.sources.reduce(function (accumulator, current) {
                return accumulator.height > current.height ? accumulator : current;
            });
            const { url: manifest_url, headers: manifest_headers } = file_manifest_args(maybe_file_id);
            const { url: show_metadata_url, headers: show_metadata_headers } = show_metadata_args(show_uri_id);
            const batch = local_http
                .batch()
                .GET(show_metadata_url, show_metadata_headers, false)
                .GET(manifest_url, manifest_headers, false);
            if (episode_metadata_response.data.episodeUnionV2.transcripts !== undefined) {
                const { url, headers } = transcript_args(content_uri_id);
                batch.GET(url, headers, false);
            }
            const results = batch.execute();
            if (results[0] === undefined || results[1] === undefined) {
                throw new ScriptException("unreachable");
            }
            const full_show_metadata = JSON.parse(results[0].body);
            const file_manifest = JSON.parse(results[1].body);
            const subtitles = function () {
                if (results[2] === undefined || results[2].code === 404) {
                    return [];
                }
                const transcript_response = JSON.parse(results[2].body);
                const subtitle_name = function () {
                    switch (transcript_response.language) {
                        case "en":
                            return "English";
                        default:
                            throw assert_exhaustive(transcript_response.language, "unreachable");
                    }
                }();
                let vtt_text = `WEBVTT ${subtitle_name}\n`;
                vtt_text += "\n";
                transcript_response.section.forEach(function (section, index) {
                    if ("title" in section) {
                        return;
                    }
                    const next = transcript_response.section[index + 1];
                    let end = next?.startMs;
                    if (end === undefined) {
                        end = episode_metadata_response.data.episodeUnionV2.duration.totalMilliseconds;
                    }
                    vtt_text += `${milliseconds_to_WebVTT_timestamp(section.startMs)} --> ${milliseconds_to_WebVTT_timestamp(end)}\n`;
                    vtt_text += `${"text" in section ? section.text.sentence.text : section.fallback.sentence.text}\n`;
                    vtt_text += "\n";
                });
                return [{
                        url: episode_url,
                        name: subtitle_name,
                        getSubtitles() {
                            return vtt_text;
                        },
                        format: "text/vtt",
                    }];
            }();
            const duration = episode_metadata_response.data.episodeUnionV2.duration.totalMilliseconds / 1000;
            const file_url = file_manifest.cdnurl[0];
            if (file_url === undefined) {
                throw new ScriptException("unreachable");
            }
            const codecs = "mp4a.40.2";
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
                })];
            const datetime = function () {
                if (episode_metadata_response.data.episodeUnionV2.__typename === "Episode") {
                    return new Date(episode_metadata_response.data.episodeUnionV2.releaseDate.isoString).getTime() / 1000;
                }
                else if (full_show_metadata.data.podcastUnionV2.__typename === "Audiobook") {
                    return new Date(full_show_metadata.data.podcastUnionV2.publishDate.isoString).getTime() / 1000;
                }
                throw new ScriptException("unreachable");
            }();
            return new PlatformVideoDetails({
                id: new PlatformID(PLATFORM, content_uri_id, plugin.config.id),
                name: episode_metadata_response.data.episodeUnionV2.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, show_uri_id, plugin.config.id), limited_show_metadata.name, `${SHOW_URL_PREFIX}${show_uri_id}`, highest_quality_cover_art.url),
                url: episode_url,
                thumbnails: new Thumbnails(episode_metadata_response.data.episodeUnionV2.coverArt.sources.map(function (image) {
                    return new Thumbnail(image.url, image.height);
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
            });
        }
        default:
            throw assert_exhaustive(content_type, "unreachable");
    }
}
function parse_content_url(url) {
    const match_result = url.match(CONTENT_REGEX);
    if (match_result === null) {
        throw new ScriptException("regex error");
    }
    const maybe_content_type = match_result[1];
    if (maybe_content_type === undefined) {
        throw new ScriptException("regex error");
    }
    const content_type = maybe_content_type;
    const content_uri_id = match_result[2];
    if (content_uri_id === undefined) {
        throw new ScriptException("regex error");
    }
    return { content_uri_id, content_type };
}
function show_metadata_args(show_uri_id) {
    const variables = JSON.stringify({
        uri: `spotify:show:${show_uri_id}`
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "5fb034a236a3e8301e9eca0e23def3341ed66c891ea2d4fea374c091dc4b4a6a"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryShowMetadataV2");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function transcript_args(episode_uri_id) {
    const transcript_url_prefix = "https://spclient.wg.spotify.com/transcript-read-along/v2/episode/";
    const url = new URL(`${transcript_url_prefix}${episode_uri_id}`);
    url.searchParams.set("format", "json");
    return {
        url: url.toString(),
        headers: { Authorization: `Bearer ${local_state.bearer_token}` }
    };
}
function lyrics_args(song_uri_id) {
    const url = new URL(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${song_uri_id}`);
    return {
        url: url.toString(),
        headers: {
            Accept: "application/json",
            "app-platform": "WebPlayer",
            Authorization: `Bearer ${local_state.bearer_token}`
        }
    };
}
function file_manifest_args(file_id) {
    const file_manifest_url_prefix = "https://gue1-spclient.spotify.com/storage-resolve/v2/files/audio/interactive/10/";
    const file_manifest_params = "?product=9&alt=json";
    return {
        url: `${file_manifest_url_prefix}${file_id}${file_manifest_params}`,
        headers: { Authorization: `Bearer ${local_state.bearer_token}` }
    };
}
function episode_metadata_args(episode_uri_id) {
    const variables = JSON.stringify({
        uri: `spotify:episode:${episode_uri_id}`
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9697538fe993af785c10725a40bb9265a20b998ccd2383bd6f586e01303824e9"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "getEpisodeOrChapter");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function track_metadata_args(song_uri_id) {
    const variables = JSON.stringify({
        uri: `spotify:track:${song_uri_id}`
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "ae85b52abb74d20a4c331d4143d4772c95f34757bfa8c625474b912b9055b5c0"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "getTrack");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function song_metadata_args(song_uri_id) {
    const song_metadata_url = "https://spclient.wg.spotify.com/metadata/4/track/";
    return {
        url: `${song_metadata_url}${get_gid(song_uri_id)}`,
        headers: {
            Authorization: `Bearer ${local_state.bearer_token}`,
            Accept: "application/json"
        }
    };
}
function artist_metadata_args(artist_uri_id) {
    const variables = JSON.stringify({
        uri: `spotify:artist:${artist_uri_id}`,
        locale: "",
        includePrerelease: true
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "da986392124383827dc03cbb3d66c1de81225244b6e20f8d78f9f802cc43df6e"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryArtistOverview");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
//#endregion
//#region playlists
// https://open.spotify.com/album/6BzxX6zkDsYKFJ04ziU5xQ
// https://open.spotify.com/playlist/37i9dQZF1E38112qhvV3BT
// https://open.spotify.com/collection/your-episodes
function isPlaylistUrl(url) {
    return PLAYLIST_REGEX.test(url);
}
function searchPlaylists(query) {
    check_and_update_token();
    return new SpotifyPlaylistsPager(query, 0, 10);
}
class SpotifyPlaylistsPager extends PlaylistPager {
    query;
    limit;
    offset;
    constructor(query, offset, limit) {
        const { url, headers } = search_args(query, offset, limit);
        const search_response = JSON.parse(local_http.GET(url, headers, false).body);
        const has_more = are_more_playlist_results(search_response, offset, limit);
        super(format_playlist_results(search_response), has_more);
        this.query = query;
        this.limit = limit;
        this.offset = offset + limit;
    }
    nextPage() {
        const { url, headers } = search_args(this.query, this.offset, this.limit);
        const search_response = JSON.parse(local_http.GET(url, headers, false).body);
        this.results = format_playlist_results(search_response);
        this.hasMore = are_more_playlist_results(search_response, this.offset, this.limit);
        this.offset = this.offset + this.limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_playlist_results(search_response) {
    return [
        ...search_response.data.searchV2.albumsV2.items.map(function (album) {
            const album_artist = album.data.artists.items[0];
            if (album_artist === undefined) {
                throw new ScriptException("missing album artist");
            }
            return new PlatformPlaylist({
                id: new PlatformID(PLATFORM, id_from_uri(album.data.uri), plugin.config.id),
                name: album.data.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(album_artist.uri), plugin.config.id), album_artist.profile.name, `${ARTIST_URL_PREFIX}${id_from_uri(album_artist.uri)}`),
                datetime: new Date(album.data.date.year, 0).getTime() / 1000,
                url: `${ALBUM_URL_PREFIX}${id_from_uri(album.data.uri)}`,
                // TODO load this some other way videoCount?: number
                thumbnail: album.data.coverArt.sources[0]?.url ?? HARDCODED_EMPTY_STRING
            });
        }),
        ...search_response.data.searchV2.playlists.items.map(function (playlist) {
            const created_iso = playlist.data.attributes.find(function (attribute) {
                return attribute.key === "created";
            })?.value;
            const platform_playlist = {
                id: new PlatformID(PLATFORM, id_from_uri(playlist.data.uri), plugin.config.id),
                name: playlist.data.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, playlist.data.ownerV2.data.username, plugin.config.id), playlist.data.ownerV2.data.name, `${USER_URL_PREFIX}${playlist.data.ownerV2.data.username}`),
                url: `${PLAYLIST_URL_PREFIX}${id_from_uri(playlist.data.uri)}`,
                // TODO load this some other way videoCount?: number
                thumbnail: playlist.data.images.items[0]?.sources[0]?.url ?? HARDCODED_EMPTY_STRING
            };
            if (created_iso === undefined) {
                return new PlatformPlaylist(platform_playlist);
            }
            return new PlatformPlaylist({
                ...platform_playlist,
                datetime: new Date(created_iso).getTime() / 1000,
            });
        })
    ];
}
function are_more_playlist_results(search_response, current_offset, limit) {
    return search_response.data.searchV2.albumsV2.totalCount > current_offset + limit
        || search_response.data.searchV2.playlists.totalCount > current_offset + limit;
}
function getPlaylist(url) {
    check_and_update_token();
    const match_result = url.match(PLAYLIST_REGEX);
    if (match_result === null) {
        throw new ScriptException("regex error");
    }
    const maybe_playlist_type = match_result[1];
    if (maybe_playlist_type === undefined) {
        throw new ScriptException("regex error");
    }
    const playlist_type = maybe_playlist_type;
    const playlist_uri_id = match_result[2];
    if (playlist_uri_id === undefined) {
        throw new ScriptException("regex error");
    }
    switch (playlist_type) {
        case "album": {
            // if the author is the same as the album then include the artist pick otherwise nothing
            // TODO we could load in extra info for all the other artists but it might be hard to do that in a request efficient way
            const pagination_limit = 50;
            const offset = 0;
            const { url, headers } = album_metadata_args(playlist_uri_id, offset, pagination_limit);
            const album_metadata_response = JSON.parse(local_http.GET(url, headers, false).body);
            const album_artist = album_metadata_response.data.albumUnion.artists.items[0];
            if (album_artist === undefined) {
                throw new ScriptException("missing album artist");
            }
            const unix_time = new Date(album_metadata_response.data.albumUnion.date.isoString).getTime() / 1000;
            return new PlatformPlaylistDetails({
                id: new PlatformID(PLATFORM, playlist_uri_id, plugin.config.id),
                name: album_metadata_response.data.albumUnion.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, album_artist.id, plugin.config.id), album_artist.profile.name, `${ARTIST_URL_PREFIX}${album_artist.id}`, album_artist.visuals.avatarImage.sources[album_artist.visuals.avatarImage.sources.length - 1]?.url),
                datetime: unix_time,
                url: `${ALBUM_URL_PREFIX}${playlist_uri_id}`,
                videoCount: album_metadata_response.data.albumUnion.tracks.totalCount,
                contents: new AlbumPager(playlist_uri_id, offset, pagination_limit, album_metadata_response, album_artist, unix_time)
            });
        }
        case "playlist": {
            if (!bridge.isLoggedIn()) {
                throw new LoginRequiredException("login to open playlists");
            }
            const pagination_limit = 25;
            const offset = 0;
            const { url, headers } = fetch_playlist_args(playlist_uri_id, offset, pagination_limit);
            const playlist_response = JSON.parse(local_http.GET(url, headers, false).body);
            const owner = playlist_response.data.playlistV2.ownerV2.data;
            return new PlatformPlaylistDetails({
                id: new PlatformID(PLATFORM, playlist_uri_id, plugin.config.id),
                name: playlist_response.data.playlistV2.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, owner.username, plugin.config.id), owner.name, `${ARTIST_URL_PREFIX}${owner.username}`, owner.avatar?.sources[owner.avatar.sources.length - 1]?.url),
                url: `${ALBUM_URL_PREFIX}${playlist_uri_id}`,
                videoCount: playlist_response.data.playlistV2.content.totalCount,
                contents: new SpotifyPlaylistPager(playlist_uri_id, offset, pagination_limit, playlist_response)
            });
        }
        case "collection": {
            if (!bridge.isLoggedIn()) {
                throw new LoginRequiredException("login to open collections");
            }
            const collection_type = playlist_uri_id;
            switch (collection_type) {
                case "your-episodes": {
                    const limit = 50;
                    const { url, headers } = liked_episodes_args(0, limit);
                    const response = JSON.parse(local_http.GET(url, headers, false).body);
                    const username = local_state.username;
                    if (username === undefined) {
                        throw new ScriptException("unreachable");
                    }
                    return new PlatformPlaylistDetails({
                        id: new PlatformID(PLATFORM, collection_type, plugin.config.id),
                        name: "Your Episodes",
                        author: new PlatformAuthorLink(new PlatformID(PLATFORM, username, plugin.config.id), username, // TODO replace this with the signed in user's display name
                        `${USER_URL_PREFIX}${username}`),
                        url: "https://open.spotify.com/collection/your-episodes",
                        videoCount: response.data.me.library.episodes.totalCount,
                        contents: new LikedEpisodesPager(0, limit, response)
                    });
                }
                case "tracks": {
                    const limit = 50;
                    const { url, headers } = liked_songs_args(0, limit);
                    const response = JSON.parse(local_http.GET(url, headers, false).body);
                    const username = local_state.username;
                    if (username === undefined) {
                        throw new ScriptException("unreachable");
                    }
                    return new PlatformPlaylistDetails({
                        id: new PlatformID(PLATFORM, collection_type, plugin.config.id),
                        name: "Liked Songs",
                        author: new PlatformAuthorLink(new PlatformID(PLATFORM, username, plugin.config.id), username, // TODO replace this with the signed in user's display name
                        `${USER_URL_PREFIX}${username}`),
                        url: "https://open.spotify.com/collection/tracks",
                        videoCount: response.data.me.library.tracks.totalCount,
                        contents: new LikedTracksPager(0, limit, response)
                    });
                }
                default:
                    throw assert_exhaustive(collection_type, "unreachable");
            }
        }
        default: {
            throw assert_exhaustive(playlist_type, "unreachable");
        }
    }
}
class LikedEpisodesPager extends VideoPager {
    pagination_limit;
    offset;
    total_tracks;
    constructor(offset, pagination_limit, collection_response) {
        const total_tracks = collection_response.data.me.library.episodes.totalCount;
        const episodes = format_collection_episodes(collection_response);
        super(episodes, total_tracks > offset + pagination_limit);
        this.pagination_limit = pagination_limit;
        this.offset = offset + pagination_limit;
        this.total_tracks = total_tracks;
    }
    nextPage() {
        const { url, headers } = liked_episodes_args(this.offset, this.pagination_limit);
        const response = JSON.parse(local_http.GET(url, headers, false).body);
        const episodes = format_collection_episodes(response);
        this.results = episodes;
        this.hasMore = this.total_tracks > this.offset + this.pagination_limit;
        this.offset += this.pagination_limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_collection_episodes(response) {
    return response.data.me.library.episodes.items.map(function (episode) {
        if (episode.episode.data.podcastV2.data.__typename === "NotFound" || episode.episode.data.releaseDate === null) {
            throw new ScriptException("unreachable");
        }
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, id_from_uri(episode.episode._uri), plugin.config.id),
            name: episode.episode.data.name,
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(episode.episode.data.podcastV2.data.uri), plugin.config.id), episode.episode.data.podcastV2.data.name, `${SHOW_URL_PREFIX}${id_from_uri(episode.episode.data.podcastV2.data.uri)}`, episode.episode.data.podcastV2.data.coverArt?.sources[0]?.url),
            datetime: new Date(episode.episode.data.releaseDate.isoString).getTime() / 1000,
            url: `${EPISODE_URL_PREFIX}${id_from_uri(episode.episode._uri)}`,
            thumbnails: new Thumbnails(episode.episode.data.coverArt.sources.map(function (image) {
                return new Thumbnail(image.url, image.height);
            })),
            duration: episode.episode.data.duration.totalMilliseconds / 1000,
            viewCount: HARDCODED_ZERO,
            isLive: false,
            shareUrl: `${EPISODE_URL_PREFIX}${id_from_uri(episode.episode._uri)}`
        });
    });
}
class LikedTracksPager extends VideoPager {
    pagination_limit;
    offset;
    total_tracks;
    constructor(offset, pagination_limit, collection_response) {
        const total_tracks = collection_response.data.me.library.tracks.totalCount;
        const episodes = format_collection_tracks(collection_response);
        super(episodes, total_tracks > offset + pagination_limit);
        this.pagination_limit = pagination_limit;
        this.offset = offset + pagination_limit;
        this.total_tracks = total_tracks;
    }
    nextPage() {
        const { url, headers } = liked_songs_args(this.offset, this.pagination_limit);
        const response = JSON.parse(local_http.GET(url, headers, false).body);
        const episodes = format_collection_tracks(response);
        this.results = episodes;
        this.hasMore = this.total_tracks > this.offset + this.pagination_limit;
        this.offset += this.pagination_limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_collection_tracks(response) {
    return response.data.me.library.tracks.items.map(function (track) {
        const artist = track.track.data.artists.items[0];
        if (artist === undefined) {
            throw new ScriptException("missing song artist");
        }
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, id_from_uri(track.track._uri), plugin.config.id),
            name: track.track.data.name,
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(artist.uri), plugin.config.id), artist.profile.name, `${ARTIST_URL_PREFIX}${id_from_uri(artist.uri)}`),
            datetime: HARDCODED_ZERO,
            url: `${SONG_URL_PREFIX}${id_from_uri(track.track._uri)}`,
            thumbnails: new Thumbnails(track.track.data.albumOfTrack.coverArt.sources.map(function (image) {
                return new Thumbnail(image.url, image.height);
            })),
            duration: track.track.data.duration.totalMilliseconds / 1000,
            viewCount: HARDCODED_ZERO,
            isLive: false,
            shareUrl: `${SONG_URL_PREFIX}${id_from_uri(track.track._uri)}`
        });
    });
}
class SpotifyPlaylistPager extends VideoPager {
    playlist_uri_id;
    pagination_limit;
    offset;
    total_tracks;
    constructor(playlist_uri_id, offset, pagination_limit, playlist_response) {
        const total_tracks = playlist_response.data.playlistV2.content.totalCount;
        const songs = format_playlist_tracks(playlist_response.data.playlistV2.content);
        super(songs, total_tracks > offset + pagination_limit);
        this.playlist_uri_id = playlist_uri_id;
        this.pagination_limit = pagination_limit;
        this.offset = offset + pagination_limit;
        this.total_tracks = total_tracks;
    }
    nextPage() {
        const { url, headers } = fetch_playlist_contents_args(this.playlist_uri_id, this.offset, this.pagination_limit);
        const playlist_content_response = JSON.parse(local_http.GET(url, headers, false).body);
        const songs = format_playlist_tracks(playlist_content_response.data.playlistV2.content);
        this.results = songs;
        this.hasMore = this.total_tracks > this.offset + this.pagination_limit;
        this.offset += this.pagination_limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_playlist_tracks(content) {
    return content.items.map(function (playlist_track_metadata) {
        const song = playlist_track_metadata.itemV2.data;
        const track_uri_id = id_from_uri(song.uri);
        const artist = song.artists.items[0];
        if (artist === undefined) {
            throw new ScriptException("missing artist");
        }
        const url = `${SONG_URL_PREFIX}${track_uri_id}`;
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, track_uri_id, plugin.config.id),
            name: song.name,
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(artist.uri), plugin.config.id), artist.profile.name, `${ARTIST_URL_PREFIX}${id_from_uri(artist.uri)}`
            // TODO figure out a way to get the artist thumbnail
            ),
            url,
            thumbnails: new Thumbnails(song.albumOfTrack.coverArt.sources.map(function (source) {
                return new Thumbnail(source.url, source.height);
            })),
            duration: song.trackDuration.totalMilliseconds / 1000,
            viewCount: parseInt(song.playcount),
            isLive: false,
            shareUrl: url,
            datetime: new Date(playlist_track_metadata.addedAt.isoString).getTime() / 1000
        });
    });
}
/**
 *
 * @param playlist_uri_id
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns
 */
function fetch_playlist_contents_args(playlist_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:playlist:${playlist_uri_id}`,
        offset: offset,
        limit: limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "91d4c2bc3e0cd1bc672281c4f1f59f43ff55ba726ca04a45810d99bd091f3f0e"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "fetchPlaylistContents");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
/**
 *
 * @param playlist_uri_id
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns
 */
function fetch_playlist_args(playlist_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:playlist:${playlist_uri_id}`,
        offset: offset,
        limit: limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "91d4c2bc3e0cd1bc672281c4f1f59f43ff55ba726ca04a45810d99bd091f3f0e"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "fetchPlaylist");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
class AlbumPager extends VideoPager {
    album_uri_id;
    pagination_limit;
    offset;
    thumbnails;
    album_artist;
    unix_time;
    total_tracks;
    constructor(album_uri_id, offset, pagination_limit, album_metadata_response, album_artist, unix_time) {
        const total_tracks = album_metadata_response.data.albumUnion.tracks.totalCount;
        const thumbnails = new Thumbnails(album_metadata_response.data.albumUnion.coverArt.sources.map(function (source) {
            return new Thumbnail(source.url, source.height);
        }));
        const songs = format_album_tracks(album_metadata_response.data.albumUnion.tracks, thumbnails, album_artist, unix_time);
        super(songs, total_tracks > offset + pagination_limit);
        this.album_uri_id = album_uri_id;
        this.pagination_limit = pagination_limit;
        this.offset = offset + pagination_limit;
        this.thumbnails = thumbnails;
        this.album_artist = album_artist;
        this.unix_time = unix_time;
        this.total_tracks = total_tracks;
    }
    nextPage() {
        const { url, headers } = album_tracks_args(this.album_uri_id, this.offset, this.pagination_limit);
        const album_tracks_response = JSON.parse(local_http.GET(url, headers, false).body);
        const songs = format_album_tracks(album_tracks_response.data.albumUnion.tracks, this.thumbnails, this.album_artist, this.unix_time);
        this.results = songs;
        this.hasMore = this.total_tracks > this.offset + this.pagination_limit;
        this.offset += this.pagination_limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_album_tracks(tracks, thumbnails, album_artist, unix_time) {
    return tracks.items.map(function (track) {
        const track_uri_id = id_from_uri(track.track.uri);
        const artist = track.track.artists.items[0];
        if (artist === undefined) {
            throw new ScriptException("missing artist");
        }
        const url = `${SONG_URL_PREFIX}${track_uri_id}`;
        return new PlatformVideo({
            id: new PlatformID(PLATFORM, track_uri_id, plugin.config.id),
            name: track.track.name,
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(artist.uri), plugin.config.id), artist.profile.name, `${ARTIST_URL_PREFIX}${id_from_uri(artist.uri)}`, id_from_uri(artist.uri) === album_artist.id ? album_artist.visuals.avatarImage.sources[album_artist.visuals.avatarImage.sources.length - 1]?.url : undefined),
            url,
            thumbnails,
            duration: track.track.duration.totalMilliseconds / 1000,
            viewCount: parseInt(track.track.playcount),
            isLive: false,
            shareUrl: url,
            datetime: unix_time
        });
    });
}
/**
 *
 * @param album_uri_id
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns
 */
function album_tracks_args(album_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:album:${album_uri_id}`,
        offset: offset,
        limit: limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "469874edcad37b7a379d4f22f0083a49ea3d6ae097916120d9bbe3e36ca79e9d"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryAlbumTracks");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
/**
 *
 * @param album_uri_id
 * @param offset the track to start loading from in the album (0 is the first track)
 * @param limit the maximum number of tracks to load information about
 * @returns
 */
function album_metadata_args(album_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:album:${album_uri_id}`,
        locale: "",
        offset: offset,
        limit: limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "469874edcad37b7a379d4f22f0083a49ea3d6ae097916120d9bbe3e36ca79e9d"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "getAlbum");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
//#endregion
//#region channel
// https://open.spotify.com/show/4Pgcpzc9b3qTxyUr9DkXEn
// https://open.spotify.com/show/5VzFvh1JlEhBMS6ZHZ8CNO
// https://open.spotify.com/artist/1HtB6hptdVyK6cBTm9SMTu
// https://open.spotify.com/user/zelladay
// https://open.spotify.com/genre/0JQ5DAt0tbjZptfcdMSKl3
// https://open.spotify.com/genre/section0JQ5DACFo5h0jxzOyHOsIe
function isChannelUrl(url) {
    return CHANNEL_REGEX.test(url);
}
function searchChannels(query) {
    check_and_update_token();
    return new SpotifyChannelPager(query, 0, 10);
}
class SpotifyChannelPager extends ChannelPager {
    query;
    limit;
    offset;
    constructor(query, offset, limit) {
        const { url, headers } = search_args(query, offset, limit);
        const search_response = JSON.parse(local_http.GET(url, headers, false).body);
        const has_more = are_more_channel_results(search_response, offset, limit);
        super(format_channel_results(search_response), has_more);
        this.query = query;
        this.limit = limit;
        this.offset = offset + limit;
    }
    nextPage() {
        const { url, headers } = search_args(this.query, this.offset, this.limit);
        const search_response = JSON.parse(local_http.GET(url, headers, false).body);
        this.results = format_channel_results(search_response);
        this.hasMore = are_more_channel_results(search_response, this.offset, this.limit);
        this.offset = this.offset + this.limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function are_more_channel_results(search_response, current_offset, limit) {
    return search_response.data.searchV2.artists.totalCount > current_offset + limit
        || search_response.data.searchV2.podcasts.totalCount > current_offset + limit
        || search_response.data.searchV2.audiobooks.totalCount > current_offset + limit
        || search_response.data.searchV2.users.totalCount > current_offset + limit
        || search_response.data.searchV2.genres.totalCount > current_offset + limit;
}
function format_channel_results(search_response) {
    return [
        ...search_response.data.searchV2.artists.items.map(function (artist) {
            const thumbnail = artist.data.visuals.avatarImage?.sources[0]?.url ?? HARDCODED_EMPTY_STRING;
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, id_from_uri(artist.data.uri), plugin.config.id),
                name: artist.data.profile.name,
                thumbnail,
                url: `${ARTIST_URL_PREFIX}${id_from_uri(artist.data.uri)}`
            });
        }),
        ...search_response.data.searchV2.podcasts.items.map(function (podcasts) {
            const thumbnail = podcasts.data.coverArt.sources[0]?.url;
            if (thumbnail === undefined) {
                throw new ScriptException("missing podcast cover image");
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, id_from_uri(podcasts.data.uri), plugin.config.id),
                name: podcasts.data.name,
                thumbnail,
                url: `${SHOW_URL_PREFIX}${id_from_uri(podcasts.data.uri)}`
            });
        }),
        ...search_response.data.searchV2.audiobooks.items.map(function (audiobook) {
            const thumbnail = audiobook.data.coverArt.sources[0]?.url;
            if (thumbnail === undefined) {
                throw new ScriptException("missing audiobook cover image");
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, id_from_uri(audiobook.data.uri), plugin.config.id),
                name: audiobook.data.name,
                thumbnail,
                url: `${SHOW_URL_PREFIX}${id_from_uri(audiobook.data.uri)}`
            });
        }),
        ...search_response.data.searchV2.users.items.map(function (user) {
            const thumbnail = user.data.avatar?.sources[0]?.url ?? HARDCODED_EMPTY_STRING;
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, user.data.username, plugin.config.id),
                name: user.data.displayName,
                thumbnail,
                url: `${USER_URL_PREFIX}${user.data.username}`
            });
        }),
        ...search_response.data.searchV2.genres.items.map(function (genre) {
            const thumbnail = genre.data.image.sources[0]?.url;
            if (thumbnail === undefined) {
                throw new ScriptException("missing genre cover image");
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, id_from_uri(genre.data.uri), plugin.config.id),
                name: genre.data.name,
                thumbnail,
                url: `${PAGE_URL_PREFIX}${id_from_uri(genre.data.uri)}`
            });
        }),
    ];
}
/**
 *
 * @param query
 * @param offset
 * @param limit really only works set to 10
 * @returns
 */
function search_args(query, offset, limit) {
    const variables = JSON.stringify({
        searchTerm: query,
        offset,
        // really only works set to 10
        limit,
        numberOfTopResults: 5,
        includeAudiobooks: true,
        includeArtistHasConcertsField: false,
        includePreReleases: true,
        includeLocalConcertsField: false
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "7a60179c5d6b6c385e849438efb1398392ef159d82f2ad7158be5e80bf7817a9"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "searchDesktop");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function getChannel(url) {
    check_and_update_token();
    const { channel_type, channel_uri_id } = parse_channel_url(url);
    switch (channel_type) {
        case "section": {
            // use limit of 4 to load minimal data but try to guarantee that we can get a cover photo
            const limit = 4;
            const { url, headers } = browse_section_args(channel_uri_id, 0, limit);
            const browse_section_response = JSON.parse(local_http.GET(url, headers, false).body);
            const name = browse_section_response.data.browseSection.data.title.transformedLabel;
            const channel_url = `${SECTION_URL_PREFIX}${channel_uri_id}`;
            const section = browse_section_response.data.browseSection;
            const section_items = section.sectionItems.items.flatMap(function (section_item) {
                const section_item_content = section_item.content.data;
                if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                    return [section_item_content];
                }
                return [];
            });
            const first_section_item = section_items?.[0];
            if (first_section_item === undefined) {
                throw new LoginRequiredException("login to view custom genres");
            }
            const first_playlist_image = first_section_item.__typename === "Album"
                ? first_section_item.coverArt.sources[0]?.url
                : first_section_item.images.items[0]?.sources[0]?.url;
            if (first_playlist_image === undefined) {
                throw new ScriptException("missing playlist image");
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name,
                thumbnail: first_playlist_image,
                url: channel_url
            });
        }
        case "genre": {
            if (channel_uri_id === "recently-played") {
                if (!bridge.isLoggedIn()) {
                    throw new LoginRequiredException("login to open recently-played");
                }
                // Spotify just load the first 50
                const { url: uri_url, headers: uri_headers } = recently_played_ids_args(0, 50);
                const recently_played_ids = JSON.parse(local_http.GET(uri_url, uri_headers, false).body);
                const { url, headers } = recently_played_details_args(recently_played_ids.playContexts.map(function (uri_obj) {
                    return uri_obj.uri;
                }));
                const recently_played_response = JSON.parse(local_http.GET(url, headers, false).body);
                const section_items = recently_played_response.data.lookup.flatMap(function (section_item) {
                    if (section_item.__typename === "UnknownTypeWrapper") {
                        return [{
                                image: {
                                    sources: [{
                                            "height": 640,
                                            "url": "https://misc.scdn.co/liked-songs/liked-songs-640.png",
                                        }]
                                },
                                name: "Liked Songs",
                                __typename: "PseudoPlaylist",
                                uri: "spotify:collection:tracks"
                            }];
                    }
                    const section_item_content = section_item.data;
                    if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                        return [section_item_content];
                    }
                    return [];
                });
                const first_section_item = section_items?.[0];
                if (first_section_item === undefined) {
                    throw new ScriptException("unreachable");
                }
                const first_section_first_playlist_image = function (section_item) {
                    switch (section_item.__typename) {
                        case "Album":
                            return section_item.coverArt.sources[0]?.url;
                        case "Playlist":
                            return section_item.images.items[0]?.sources[0]?.url;
                        case "PseudoPlaylist":
                            return section_item.image.sources[0]?.url;
                        default:
                            throw assert_exhaustive(section_item);
                    }
                }(first_section_item);
                if (first_section_first_playlist_image === undefined) {
                    throw new ScriptException("missing playlist image");
                }
                return new PlatformChannel({
                    id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                    name: "Recently played",
                    thumbnail: first_section_first_playlist_image,
                    url: "https://open.spotify.com/genre/recently-played"
                });
            }
            // use limit of 4 to load minimal data but try to guarantee that we can get a cover photo
            const limit = 4;
            const { url, headers } = browse_page_args(channel_uri_id, { offset: 0, limit }, { offset: 0, limit });
            const browse_page_response = JSON.parse(local_http.GET(url, headers, false).body);
            if (browse_page_response.data.browse.__typename === "GenericError") {
                throw new ScriptException("error loading genre page");
            }
            const name = browse_page_response.data.browse.header.title.transformedLabel;
            const sections = browse_page_response.data.browse.sections.items.flatMap(function (item) {
                if (is_playlist_section(item)) {
                    return [item];
                }
                return [];
            });
            const channel_url = `${PAGE_URL_PREFIX}${channel_uri_id}`;
            const section_items = sections[0]?.sectionItems.items.flatMap(function (section_item) {
                if (section_item.content.__typename === "UnknownType") {
                    return [];
                }
                const section_item_content = section_item.content.data;
                if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                    return [section_item_content];
                }
                return [];
            });
            const first_section_item = section_items?.[0];
            if (first_section_item === undefined) {
                throw new LoginRequiredException("login to view custom genres");
            }
            const first_section_first_playlist_image = first_section_item.__typename === "Album"
                ? first_section_item.coverArt.sources[0]?.url
                : first_section_item.images.items[0]?.sources[0]?.url;
            if (first_section_first_playlist_image === undefined) {
                throw new ScriptException("missing playlist image");
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name,
                thumbnail: first_section_first_playlist_image,
                url: channel_url
            });
        }
        case "show": {
            const { url, headers } = show_metadata_args(channel_uri_id);
            const show_response = JSON.parse(local_http.GET(url, headers, false).body);
            const sources = show_response.data.podcastUnionV2.coverArt.sources;
            const thumbnail = sources[sources.length - 1]?.url;
            if (thumbnail === undefined) {
                throw new ScriptException("missing cover art");
            }
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name: show_response.data.podcastUnionV2.name,
                thumbnail,
                url: `${SHOW_URL_PREFIX}${channel_uri_id}`,
                description: show_response.data.podcastUnionV2.htmlDescription
            });
        }
        case "user": {
            const url = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${channel_uri_id}?playlist_limit=0&artist_limit=0&episode_limit=0`;
            const user_response = JSON.parse(local_http.GET(url, { Authorization: `Bearer ${local_state.bearer_token}` }, false).body);
            return new PlatformChannel({
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name: user_response.name,
                thumbnail: user_response.image_url,
                url: `${USER_URL_PREFIX}${channel_uri_id}`,
                subscribers: user_response.followers_count
            });
        }
        case "artist":
            const { url, headers } = artist_metadata_args(channel_uri_id);
            const artist_metadata_response = JSON.parse(local_http.GET(url, headers, false).body);
            const thumbnail = artist_metadata_response.data.artistUnion.visuals.avatarImage?.sources[0]?.url ?? HARDCODED_EMPTY_STRING;
            const banner = artist_metadata_response.data.artistUnion.visuals.headerImage?.sources[0]?.url;
            const channel = {
                id: new PlatformID(PLATFORM, channel_uri_id, plugin.config.id),
                name: artist_metadata_response.data.artistUnion.profile.name,
                thumbnail,
                url: `${ARTIST_URL_PREFIX}${channel_uri_id}`,
                subscribers: artist_metadata_response.data.artistUnion.stats.monthlyListeners,
                description: artist_metadata_response.data.artistUnion.profile.biography.text
            };
            if (banner === undefined) {
                return new PlatformChannel(channel);
            }
            return new PlatformChannel({
                ...channel,
                banner
            });
        case "content-feed":
            throw new ScriptException("not implemented");
        default:
            throw assert_exhaustive(channel_type, "unreachable");
    }
}
function is_playlist_section(item) {
    return item.data.__typename === "BrowseGenericSectionData"
        || item.data.__typename === "HomeGenericSectionData"
        || item.data.__typename === "WhatsNewSectionData"
        || item.data.__typename === "CustomRecentlyPlayedSectionData";
}
function browse_page_args(page_uri_id, pagePagination, sectionPagination) {
    const variables = JSON.stringify({
        uri: `spotify:page:${page_uri_id}`,
        pagePagination,
        sectionPagination
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "177a4ae12a90e35d335f060216ce5df7864a228c6ca262bd5ed90b37c2419dd9"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "browsePage");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function recently_played_ids_args(offset, limit) {
    const url = `https://spclient.wg.spotify.com/recently-played/v3/user/${local_state.username}/recently-played?format=json&offset=${offset}&limit=${limit}&filter=default,collection-new-episodes`;
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function recently_played_details_args(uris) {
    const variables = JSON.stringify({
        uris
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "8e4eb5eafa2837eca337dc11321ac285a01f9a056a7ac83f77a66f9998b06a73"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "fetchEntitiesForRecentlyPlayed");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function parse_channel_url(url) {
    const match_result = url.match(CHANNEL_REGEX);
    if (match_result === null) {
        throw new ScriptException("regex error");
    }
    const maybe_channel_type = match_result[1];
    if (maybe_channel_type === undefined) {
        throw new ScriptException("regex error");
    }
    const is_section = match_result[2] === "section";
    let channel_type = maybe_channel_type;
    if (is_section) {
        channel_type = "section";
    }
    const channel_uri_id = match_result[3];
    if (channel_uri_id === undefined) {
        throw new ScriptException("regex error");
    }
    return { channel_type, channel_uri_id: channel_uri_id === "recently-played" ? "recently-played" : channel_uri_id };
}
//#endregion
//#region channel content
function getChannelCapabilities() {
    return new ResultCapabilities([
        Type.Feed.Playlists,
        Type.Feed.Albums,
        Type.Feed.Videos
    ], [
        Type.Order.Chronological
    ], []);
}
function getChannelContents(url, type, order, filters) {
    if (filters !== null) {
        throw new ScriptException("unreachable");
    }
    if (order !== "CHRONOLOGICAL") {
        throw new ScriptException("unreachable");
    }
    if (type !== Type.Feed.Videos) {
        throw new ScriptException("unreachable");
    }
    check_and_update_token();
    const { channel_type, channel_uri_id } = parse_channel_url(url);
    switch (channel_type) {
        case "section": {
            const initial_limit = 20;
            const { url, headers } = browse_section_args(channel_uri_id, 0, initial_limit);
            const browse_section_response = JSON.parse(local_http.GET(url, headers, false).body);
            const name = browse_section_response.data.browseSection.data.title.transformedLabel;
            const section = browse_section_response.data.browseSection;
            const section_uri_id = channel_uri_id;
            const section_items = section.sectionItems.items.flatMap(function (section_item) {
                const section_item_content = section_item.content.data;
                if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                    return [section_item_content];
                }
                return [];
            });
            if (section_items.length === 0) {
                return new ContentPager([], false);
            }
            const first_section_item = section_items[0];
            if (first_section_item === undefined) {
                throw new ScriptException("no section items");
            }
            const author = new PlatformAuthorLink(new PlatformID(PLATFORM, section_uri_id, plugin.config.id), name, `${SECTION_URL_PREFIX}${section_uri_id}`, first_section_item.__typename === "Album"
                ? first_section_item.coverArt.sources[0]?.url
                : first_section_item.images.items[0]?.sources[0]?.url);
            return new SectionPager(channel_uri_id, section_items, 0, initial_limit, author, section.sectionItems.totalCount > initial_limit);
        }
        case "genre": {
            if (channel_uri_id === "recently-played") {
                if (!bridge.isLoggedIn()) {
                    throw new LoginRequiredException("login to open recently-played");
                }
                // Spotify just load the first 50
                const { url: uri_url, headers: uri_headers } = recently_played_ids_args(0, 50);
                const recently_played_ids = JSON.parse(local_http.GET(uri_url, uri_headers, false).body);
                const { url, headers } = recently_played_details_args(recently_played_ids.playContexts.map(function (uri_obj) {
                    return uri_obj.uri;
                }));
                const recently_played_response = JSON.parse(local_http.GET(url, headers, false).body);
                const section_items = recently_played_response.data.lookup.flatMap(function (section_item) {
                    if (section_item.__typename === "UnknownTypeWrapper") {
                        return [{
                                image: {
                                    sources: [{
                                            "height": 640,
                                            "url": "https://misc.scdn.co/liked-songs/liked-songs-640.png",
                                        }]
                                },
                                name: "Liked Songs",
                                __typename: "PseudoPlaylist",
                                uri: "spotify:collection:tracks"
                            }];
                    }
                    const section_item_content = section_item.data;
                    if (section_item_content.__typename === "Playlist" || section_item_content.__typename === "Album") {
                        return [section_item_content];
                    }
                    return [];
                });
                const first_section_item = section_items?.[0];
                if (first_section_item === undefined) {
                    throw new ScriptException("unreachable");
                }
                const first_section_first_playlist_image = function (section_item) {
                    switch (section_item.__typename) {
                        case "Album":
                            return section_item.coverArt.sources[0]?.url;
                        case "Playlist":
                            return section_item.images.items[0]?.sources[0]?.url;
                        case "PseudoPlaylist":
                            return section_item.image.sources[0]?.url;
                        default:
                            throw assert_exhaustive(section_item);
                    }
                }(first_section_item);
                if (first_section_first_playlist_image === undefined) {
                    throw new ScriptException("missing playlist image");
                }
                const author = new PlatformAuthorLink(new PlatformID(PLATFORM, "recently-played", plugin.config.id), "Recently played", `${PAGE_URL_PREFIX}recently-played`, first_section_first_playlist_image);
                const playlists = section_items.map(function (section_item) {
                    return format_section_item(section_item, author);
                });
                return new ContentPager(playlists, false);
            }
            const limit = 4;
            const { url, headers } = browse_page_args(channel_uri_id, { offset: 0, limit: 50 }, { offset: 0, limit: limit });
            const browse_page_response = JSON.parse(local_http.GET(url, headers, false).body);
            if (browse_page_response.data.browse.__typename === "GenericError") {
                throw new ScriptException("error loading genre page");
            }
            const playlists = format_page(browse_page_response.data.browse.sections.items, limit, browse_page_response.data.browse.header.title.transformedLabel);
            return new ContentPager(playlists, false);
        }
        case "show":
            const { url: metadata_url, headers: metadata_headers } = show_metadata_args(channel_uri_id);
            const chapters_limit = 50;
            const episodes_limit = 6;
            const { url: chapters_url, headers: chapters_headers } = book_chapters_args(channel_uri_id, 0, chapters_limit);
            const { url: episodes_url, headers: episodes_headers } = podcast_episodes_args(channel_uri_id, 0, episodes_limit);
            const responses = local_http
                .batch()
                .GET(metadata_url, metadata_headers, false)
                .GET(chapters_url, chapters_headers, false)
                .GET(episodes_url, episodes_headers, false)
                .execute();
            if (responses[0] === undefined || responses[1] === undefined || responses[2] === undefined) {
                throw new ScriptException("unreachable");
            }
            const show_metadata_response = JSON.parse(responses[0].body);
            const author = new PlatformAuthorLink(new PlatformID(PLATFORM, channel_uri_id, plugin.config.id), show_metadata_response.data.podcastUnionV2.name, `${SHOW_URL_PREFIX}${channel_uri_id}`, show_metadata_response.data.podcastUnionV2.coverArt.sources[0]?.url);
            switch (show_metadata_response.data.podcastUnionV2.__typename) {
                case "Audiobook": {
                    const chapters_response = JSON.parse(responses[1].body);
                    const publish_date_time = new Date(show_metadata_response.data.podcastUnionV2.publishDate.isoString).getTime() / 1000;
                    return new ChapterPager(channel_uri_id, chapters_response, 0, chapters_limit, author, publish_date_time);
                }
                case "Podcast": {
                    const episodes_response = JSON.parse(responses[2].body);
                    return new EpisodePager(channel_uri_id, episodes_response, 0, episodes_limit, author);
                }
                default:
                    throw assert_exhaustive(show_metadata_response.data.podcastUnionV2, "unreachable");
            }
        case "artist":
            return new ArtistDiscographyPager(channel_uri_id, 0, 50);
        case "user":
            return new UserPlaylistPager(channel_uri_id, 0, 50);
        case "content-feed":
            throw new ScriptException("not implemented");
        default:
            throw assert_exhaustive(channel_type, "unreachable");
    }
}
/**
 *
 * @param sections
 * @param display_limit maximum number of items to display per section
 * @returns
 */
function format_page(sections, display_limit, page_title) {
    const filtered_sections = sections.flatMap(function (item) {
        if (is_playlist_section(item)) {
            return [item];
        }
        return [];
    });
    const content = filtered_sections.flatMap(function (section) {
        const section_title = section.data.title;
        const section_name = section_title === null ? page_title : "text" in section_title ? section_title.text : section_title.transformedLabel;
        const section_items = section.sectionItems.items.flatMap(function (section_item) {
            if (section_item.content.__typename === "UnknownType") {
                return [];
            }
            const section_item_content = section_item.content.data;
            if (section_item_content.__typename === "Playlist"
                || section_item_content.__typename === "Album"
                || section_item_content.__typename === "Episode"
                || section_item_content.__typename === "PseudoPlaylist") {
                return [section_item_content];
            }
            return [];
        });
        if (section_items.length === 0) {
            return [];
        }
        const first_section_item = section_items[0];
        if (first_section_item === undefined) {
            throw new ScriptException("no sections");
        }
        const author = function () {
            if ("section_url" in section) {
                return new PlatformAuthorLink(new PlatformID(PLATFORM, section.section_url, plugin.config.id), section_name, section.section_url);
            }
            return new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id), section_name, `${SECTION_URL_PREFIX}${id_from_uri(section.uri)}`);
        }();
        return section_items.map(function (playlist) {
            return format_section_item(playlist, author);
        }).slice(0, display_limit);
    });
    return content;
}
class ArtistDiscographyPager extends PlaylistPager {
    artist_uri_id;
    limit;
    offset;
    artist;
    total_albums;
    constructor(artist_uri_id, offset, limit) {
        const { url: metadata_url, headers: metadata_headers } = artist_metadata_args(artist_uri_id);
        const { url: discography_url, headers: discography_headers } = discography_args(artist_uri_id, offset, limit);
        const responses = local_http
            .batch()
            .GET(metadata_url, metadata_headers, false)
            .GET(discography_url, discography_headers, false)
            .execute();
        if (responses[0] === undefined || responses[1] === undefined) {
            throw new ScriptException("unreachable");
        }
        const metadata_response = JSON.parse(responses[0].body);
        const discography_response = JSON.parse(responses[1].body);
        const avatar_url = metadata_response.data.artistUnion.visuals.avatarImage?.sources[0]?.url ?? HARDCODED_EMPTY_STRING;
        const author = new PlatformAuthorLink(new PlatformID(PLATFORM, artist_uri_id, plugin.config.id), metadata_response.data.artistUnion.profile.name, `${ARTIST_URL_PREFIX}${artist_uri_id}`, avatar_url, metadata_response.data.artistUnion.stats.monthlyListeners);
        const total_albums = discography_response.data.artistUnion.discography.all.totalCount;
        super(format_discography(discography_response, author), total_albums > offset + limit);
        this.artist_uri_id = artist_uri_id;
        this.limit = limit;
        this.artist = author;
        this.offset = offset + limit;
        this.total_albums = total_albums;
    }
    nextPage() {
        const { url, headers } = discography_args(this.artist_uri_id, this.offset, this.limit);
        const discography_response = JSON.parse(local_http.GET(url, headers, false).body);
        this.results = format_discography(discography_response, this.artist);
        this.hasMore = this.total_albums > this.offset + this.limit;
        this.offset = this.offset + this.limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_discography(discography_response, artist) {
    return discography_response.data.artistUnion.discography.all.items.map(function (album) {
        const first_release = album.releases.items[0];
        if (first_release === undefined) {
            throw new ScriptException("unreachable");
        }
        const thumbnail = first_release.coverArt.sources[0]?.url;
        if (thumbnail === undefined) {
            throw new ScriptException("unreachable");
        }
        return new PlatformPlaylist({
            id: new PlatformID(PLATFORM, first_release.id, plugin.config.id),
            name: first_release.name,
            author: artist,
            datetime: new Date(first_release.date.isoString).getTime() / 1000,
            url: `${ALBUM_URL_PREFIX}${first_release.id}`,
            videoCount: first_release.tracks.totalCount,
            thumbnail
        });
    });
}
function discography_args(artist_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:artist:${artist_uri_id}`,
        offset,
        limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9380995a9d4663cbcb5113fef3c6aabf70ae6d407ba61793fd01e2a1dd6929b0"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryArtistDiscographyAll");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function format_section_item(section, section_as_author) {
    switch (section.__typename) {
        case "Album":
            {
                const album_artist = section.artists.items[0];
                if (album_artist === undefined) {
                    throw new ScriptException("missing album artist");
                }
                const cover_art_url = section.coverArt.sources[0]?.url;
                if (cover_art_url === undefined) {
                    throw new ScriptException("missing album cover art");
                }
                return new PlatformPlaylist({
                    id: new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id),
                    name: section.name,
                    author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(album_artist.uri), plugin.config.id), album_artist.profile.name, `${ARTIST_URL_PREFIX}${id_from_uri(album_artist.uri)}`),
                    // TODO load datetime another way datetime: ,
                    url: `${ALBUM_URL_PREFIX}${id_from_uri(section.uri)}`,
                    // TODO load video count some other way videoCount?: number
                    thumbnail: cover_art_url
                });
            }
        case "Playlist": {
            const created_iso = section.attributes.find(function (attribute) {
                return attribute.key === "created";
            })?.value;
            const image_url = section.images.items[0]?.sources[0]?.url;
            if (image_url === undefined) {
                throw new ScriptException("missing playlist thumbnail");
            }
            let author = section_as_author;
            // TODO we might want to look up the username of the playlist if it is missing instead of using the section/page/genre as the channel
            if (section.ownerV2.data.username) {
                if (!section.ownerV2.data.username) {
                    throw new ScriptException(`missing username for owner ${section.ownerV2}`);
                }
                author = new PlatformAuthorLink(new PlatformID(PLATFORM, section.ownerV2.data.username, plugin.config.id), section.ownerV2.data.name, `${USER_URL_PREFIX}${section.ownerV2.data.username}`, section.ownerV2.data.avatar?.sources[0]?.url);
            }
            const platform_playlist = {
                id: new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id),
                url: `${PLAYLIST_URL_PREFIX}${id_from_uri(section.uri)}`,
                name: section.name,
                author,
                // TODO load some other way videoCount:
                thumbnail: image_url
            };
            if (created_iso !== undefined) {
                return new PlatformPlaylist({
                    ...platform_playlist,
                    datetime: new Date(created_iso).getTime() / 1000
                });
            }
            return new PlatformPlaylist(platform_playlist);
        }
        case "Episode": {
            if (section.podcastV2.data.__typename === "NotFound" || section.releaseDate === null) {
                throw new ScriptException("unreachable");
            }
            return new PlatformVideo({
                id: new PlatformID(PLATFORM, section.id, plugin.config.id),
                name: section.name,
                author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(section.podcastV2.data.uri), plugin.config.id), section.podcastV2.data.name, `${SHOW_URL_PREFIX}${id_from_uri(section.podcastV2.data.uri)}`, section.podcastV2.data.coverArt?.sources[0]?.url),
                url: `${EPISODE_URL_PREFIX}${section.id}`,
                thumbnails: new Thumbnails(section.coverArt.sources.map(function (source) {
                    return new Thumbnail(source.url, source.height);
                })),
                duration: section.duration.totalMilliseconds / 1000,
                viewCount: HARDCODED_ZERO,
                isLive: false,
                shareUrl: `${EPISODE_URL_PREFIX}${section.id}`,
                /** unix time */
                datetime: new Date(section.releaseDate.isoString).getTime() / 1000
            });
        }
        case "PseudoPlaylist": {
            const image_url = section.image.sources[0]?.url;
            if (image_url === undefined) {
                throw new ScriptException("missing playlist thumbnail");
            }
            const author = section_as_author;
            const platform_playlist = {
                id: new PlatformID(PLATFORM, id_from_uri(section.uri), plugin.config.id),
                url: `${COLLECTION_UR_PREFIX}${id_from_uri(section.uri)}`,
                name: section.name,
                author,
                // TODO load some other way videoCount:
                thumbnail: image_url
            };
            return new PlatformPlaylist(platform_playlist);
        }
        default:
            throw assert_exhaustive(section, "unreachable");
    }
}
class SectionPager extends ContentPager {
    section_uri_id;
    section_as_author;
    limit;
    offset;
    constructor(section_uri_id, section_items, offset, limit, section_as_author, has_more) {
        const playlists = section_items.map(function (section_item) {
            return format_section_item(section_item, section_as_author);
        });
        super(playlists, has_more);
        this.section_uri_id = section_uri_id;
        this.section_as_author = section_as_author;
        this.offset = offset + limit;
        this.limit = limit;
    }
    nextPage() {
        const { url, headers } = browse_section_args(this.section_uri_id, this.offset, this.limit);
        const browse_section_response = JSON.parse(local_http.GET(url, headers, false).body);
        const section_items = browse_section_response.data.browseSection.sectionItems.items.flatMap(function (section_item) {
            const section_item_content = section_item.content.data;
            if (section_item_content.__typename === "Album" || section_item_content.__typename === "Playlist") {
                return [section_item_content];
            }
            return [];
        });
        const author = this.section_as_author;
        if (section_items.length === 0) {
            this.results = [];
        }
        else {
            this.results = section_items.map(function (section_item) {
                return format_section_item(section_item, author);
            });
        }
        const next_offset = browse_section_response.data.browseSection.sectionItems.pagingInfo.nextOffset;
        if (next_offset !== null) {
            this.offset = next_offset;
        }
        this.hasMore = next_offset !== null;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function browse_section_args(page_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:section:${page_uri_id}`,
        pagination: {
            offset,
            limit
        }
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "8cb45a0fea4341b810e6f16ed2832c7ef9d3099aaf0034ee2a0ce49afbe42748"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "browseSection");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function book_chapters_args(audiobook_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:show:${audiobook_uri_id}`,
        offset,
        limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "9879e364e7cee8e656be5f003ac7956b45c5cc7dea1fd3c8039e6b5b2e1f40b4"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryBookChapters");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function podcast_episodes_args(podcast_uri_id, offset, limit) {
    const variables = JSON.stringify({
        uri: `spotify:show:${podcast_uri_id}`,
        offset,
        limit
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "108deda91e2701403d95dc39bdade6741c2331be85737b804a00de22cc0acabf"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "queryPodcastEpisodes");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
class ChapterPager extends VideoPager {
    audiobook_uri_id;
    limit;
    author;
    publish_date_time;
    offset;
    constructor(audiobook_uri_id, chapters_response, offset, limit, author, publish_date_time) {
        const chapters = format_chapters(chapters_response, author, publish_date_time);
        const next_offset = chapters_response.data.podcastUnionV2.chaptersV2.pagingInfo.nextOffset;
        super(chapters, next_offset !== null);
        this.audiobook_uri_id = audiobook_uri_id;
        this.limit = limit;
        this.author = author;
        this.publish_date_time = publish_date_time;
        this.offset = next_offset === null ? offset : next_offset;
    }
    nextPage() {
        const { url, headers } = book_chapters_args(this.audiobook_uri_id, this.offset, this.limit);
        const chapters_response = JSON.parse(local_http.GET(url, headers, false).body);
        const chapters = format_chapters(chapters_response, this.author, this.publish_date_time);
        const next_offset = chapters_response.data.podcastUnionV2.chaptersV2.pagingInfo.nextOffset;
        this.hasMore = next_offset !== null;
        this.results = chapters;
        this.offset = next_offset === null ? this.offset : next_offset;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_chapters(chapters_response, author, publish_date_time) {
    return chapters_response.data.podcastUnionV2.chaptersV2.items.map(function (chapter_container) {
        const chapter_data = chapter_container.entity.data;
        const thumbnails = new Thumbnails(chapter_data.coverArt.sources.map(function (source) {
            return new Thumbnail(source.url, source.height);
        }));
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
        });
    });
}
class EpisodePager extends VideoPager {
    podcast_uri_id;
    limit;
    author;
    offset;
    constructor(podcast_uri_id, episodes_response, offset, limit, author) {
        const chapters = format_episodes(episodes_response, author);
        const next_offset = episodes_response.data.podcastUnionV2.episodesV2.pagingInfo.nextOffset;
        super(chapters, next_offset !== null);
        this.podcast_uri_id = podcast_uri_id;
        this.limit = limit;
        this.author = author;
        this.offset = next_offset === null ? offset : next_offset;
    }
    nextPage() {
        const { url, headers } = podcast_episodes_args(this.podcast_uri_id, this.offset, this.limit);
        const chapters_response = JSON.parse(local_http.GET(url, headers, false).body);
        const chapters = format_episodes(chapters_response, this.author);
        const next_offset = chapters_response.data.podcastUnionV2.episodesV2.pagingInfo.nextOffset;
        this.hasMore = next_offset !== null;
        this.results = chapters;
        this.offset = next_offset === null ? this.offset : next_offset;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function format_episodes(episodes_response, author) {
    return episodes_response.data.podcastUnionV2.episodesV2.items.map(function (chapter_container) {
        const episode_data = chapter_container.entity.data;
        const thumbnails = new Thumbnails(episode_data.coverArt.sources.map(function (source) {
            return new Thumbnail(source.url, source.height);
        }));
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
        });
    });
}
class UserPlaylistPager extends PlaylistPager {
    username;
    limit;
    offset;
    total_playlists;
    constructor(username, offset, limit) {
        const { url, headers } = user_playlists_args(username, offset, limit);
        const playlists_response = JSON.parse(local_http.GET(url, headers, false).body);
        const playlists = format_user_playlists(playlists_response);
        const total_playlists = playlists_response.total_public_playlists_count;
        super(playlists, offset + limit < total_playlists);
        this.username = username;
        this.limit = limit;
        this.offset = offset + limit;
        this.total_playlists = total_playlists;
    }
    nextPage() {
        const { url, headers } = user_playlists_args(this.username, this.offset, this.limit);
        const playlists_response = JSON.parse(local_http.GET(url, headers, false).body);
        const playlists = format_user_playlists(playlists_response);
        this.hasMore = this.offset + this.limit < this.total_playlists;
        this.results = playlists;
        this.offset = this.offset + this.limit;
        return this;
    }
    hasMorePagers() {
        return this.hasMore;
    }
}
function user_playlists_args(username, offset, limit) {
    const url = new URL(`https://spclient.wg.spotify.com/user-profile-view/v3/profile/${username}/playlists`);
    url.searchParams.set("offset", offset.toString());
    url.searchParams.set("limit", limit.toString());
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function format_user_playlists(playlists_response) {
    return playlists_response.public_playlists.map(function (playlist) {
        const image_uri = playlist.image_url;
        return new PlatformPlaylist({
            id: new PlatformID(PLATFORM, id_from_uri(playlist.uri), plugin.config.id),
            name: playlist.name,
            author: new PlatformAuthorLink(new PlatformID(PLATFORM, id_from_uri(playlist.owner_uri), plugin.config.id), playlist.owner_name, `${USER_URL_PREFIX}${id_from_uri(playlist.owner_uri)}`),
            // TODO load the playlist creation or modificiation date somehow datetime?: number
            url: `${PLAYLIST_URL_PREFIX}${id_from_uri(playlist.uri)}`,
            // TODO load the video count somehow videoCount?: number
            thumbnail: url_from_image_uri(image_uri)
        });
    });
}
//#endregion
//#region other
function getUserPlaylists() {
    let playlists = [];
    let more = true;
    let offset = 0;
    const limit = 50;
    while (more) {
        const { url, headers } = library_args(offset, limit);
        const library_response = JSON.parse(local_http.GET(url, headers, false).body);
        playlists = [
            ...playlists,
            ...library_response.data.me.libraryV3.items.flatMap(function (library_item) {
                const item = library_item.item.data;
                switch (item.__typename) {
                    case "Album":
                        return `${ALBUM_URL_PREFIX}${id_from_uri(item.uri)}`;
                    case "Playlist":
                        return `${PLAYLIST_URL_PREFIX}${id_from_uri(item.uri)}`;
                    case "PseudoPlaylist":
                        return `${COLLECTION_UR_PREFIX}${id_from_uri(item.uri)}`;
                    case "Audiobook":
                        return [];
                    case "Podcast":
                        return [];
                    case "Artist":
                        return [];
                    default:
                        throw assert_exhaustive(item, "unreachable");
                }
            })
        ];
        if (library_response.data.me.libraryV3.totalCount <= offset + limit) {
            more = false;
        }
        offset += limit;
    }
    return playlists;
}
function library_args(offset, limit) {
    const variables = JSON.stringify({
        filters: [],
        order: null,
        textFilter: "",
        features: ["LIKED_SONGS", "YOUR_EPISODES", "PRERELEASES"],
        limit,
        offset,
        flatten: false,
        expandedFolders: [],
        folderUri: null,
        includeFoldersWhenFlattening: true,
        withCuration: false
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "cb996f38c4e0f98c53e46546e0b58f1ed34ab6c31cd00d17698af6ce2ac0f3af"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "libraryV3");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function liked_songs_args(offset, limit) {
    const variables = JSON.stringify({
        limit,
        offset
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "f6cdd87d7fc8598e4e7500fbacd4f661b0c4aea382fe28540aeb4cb7ea4d76c8"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "fetchLibraryTracks");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function liked_episodes_args(offset, limit) {
    const variables = JSON.stringify({
        limit,
        offset
    });
    const extensions = JSON.stringify({
        persistedQuery: {
            version: 1,
            sha256Hash: "f6cdd87d7fc8598e4e7500fbacd4f661b0c4aea382fe28540aeb4cb7ea4d76c8"
        }
    });
    const url = new URL(QUERY_URL);
    url.searchParams.set("operationName", "fetchLibraryEpisodes");
    url.searchParams.set("variables", variables);
    url.searchParams.set("extensions", extensions);
    return { url: url.toString(), headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function following_args() {
    const url = `https://spclient.wg.spotify.com/user-profile-view/v3/profile/${local_state.username}/following`;
    return { url, headers: { Authorization: `Bearer ${local_state.bearer_token}` } };
}
function getUserSubscriptions() {
    const { url, headers } = following_args();
    const following_response = JSON.parse(local_http.GET(url, headers, false).body);
    let following = following_response.profiles.map(function (profile) {
        const { uri_id, uri_type } = parse_uri(profile.uri);
        if (uri_type === "artist") {
            return `${ARTIST_URL_PREFIX}${uri_id}`;
        }
        else if (uri_type === "user") {
            return `${USER_URL_PREFIX}${uri_id}`;
        }
        throw new ScriptException("unreachable");
    });
    let more = true;
    let offset = 0;
    const limit = 50;
    while (more) {
        const { url, headers } = library_args(offset, limit);
        const library_response = JSON.parse(local_http.GET(url, headers, false).body);
        following = [
            ...following,
            ...library_response.data.me.libraryV3.items.flatMap(function (library_item) {
                const item = library_item.item.data;
                switch (item.__typename) {
                    case "Album":
                        return [];
                    case "Playlist":
                        return [];
                    case "PseudoPlaylist":
                        return [];
                    case "Audiobook":
                        return `${SHOW_URL_PREFIX}${id_from_uri(item.uri)}`;
                    case "Podcast":
                        return `${SHOW_URL_PREFIX}${id_from_uri(item.uri)}`;
                    case "Artist":
                        return `${ARTIST_URL_PREFIX}${id_from_uri(item.uri)}`;
                    default:
                        throw assert_exhaustive(item, "unreachable");
                }
            })
        ];
        if (library_response.data.me.libraryV3.totalCount <= offset + limit) {
            more = false;
        }
        offset += limit;
    }
    return following;
}
function getPlaybackTracker(url) {
    const { content_uri_id, content_type } = parse_content_url(url);
    check_and_update_token();
    return new SpotifyPlaybackTracker(content_uri_id, content_type);
}
class SpotifyPlaybackTracker extends PlaybackTracker {
    recording_play = false;
    play_recorded = false;
    total_seconds_played = 0;
    device_id;
    context_url;
    context_uri;
    skip_to_data;
    duration;
    interval_seconds;
    constructor(uri_id, content_type) {
        const interval_seconds = 2;
        super(interval_seconds * 1000);
        this.interval_seconds = interval_seconds;
        // generate device id
        const ht = "undefined" != typeof crypto && "function" == typeof crypto.getRandomValues;
        const gt = (e) => ht ? function (e) {
            return crypto.getRandomValues(new Uint8Array(e));
        }(e) : function (e) {
            const t = [];
            for (; t.length < e;)
                t.push(Math.floor(256 * Math.random()));
            return t;
        }(e);
        const ft = (e) => {
            const t = Math.ceil(e / 2);
            return function (e) {
                let t = "";
                for (let n = 0; n < e.length; n++) {
                    const i = e[n];
                    if (i === undefined) {
                        throw new ScriptException("issue generating device id");
                    }
                    i < 16 && (t += "0"),
                        t += i.toString(16);
                }
                return t;
            }(gt(t));
        };
        const vt = () => ft(40);
        this.device_id = vt();
        // load track info
        switch (content_type) {
            case "episode": {
                const { url, headers } = episode_metadata_args(uri_id);
                const response = JSON.parse(local_http.GET(url, headers, false).body);
                switch (response.data.episodeUnionV2.__typename) {
                    case "Chapter":
                        this.context_uri = response.data.episodeUnionV2.audiobookV2.data.uri;
                        break;
                    case "Episode":
                        this.context_uri = response.data.episodeUnionV2.podcastV2.data.uri;
                        break;
                    default:
                        throw assert_exhaustive(response.data.episodeUnionV2, "unreachable");
                }
                this.context_url = `context://${this.context_uri}`;
                this.skip_to_data = {
                    content_type: "episode",
                    track_uri: response.data.episodeUnionV2.uri
                };
                this.duration = response.data.episodeUnionV2.duration.totalMilliseconds;
                break;
            }
            case "track":
                const { url, headers } = track_metadata_args(uri_id);
                const response = JSON.parse(local_http.GET(url, headers, false).body);
                const track_album_index = response.data.trackUnion.trackNumber - 1;
                const { url: tracks_url, headers: tracks_headers } = album_tracks_args(id_from_uri(response.data.trackUnion.albumOfTrack.uri), track_album_index, 1);
                const tracks_response = JSON.parse(local_http.GET(tracks_url, tracks_headers, false).body);
                this.context_uri = response.data.trackUnion.albumOfTrack.uri;
                this.context_url = `context://${this.context_uri}`;
                this.duration = response.data.trackUnion.duration.totalMilliseconds;
                const uid = tracks_response.data.albumUnion.tracks.items[0]?.uid;
                if (uid === undefined) {
                    throw new ScriptException("can't find song uid");
                }
                this.skip_to_data = {
                    content_type: "track",
                    uid,
                    track_uri: response.data.trackUnion.uri,
                    track_album_index
                };
                break;
            default:
                throw assert_exhaustive(content_type, "unreachable");
        }
    }
    onInit(_seconds) {
    }
    onProgress(_seconds, is_playing) {
        if (is_playing) {
            // this ends up lagging behind. 
            this.total_seconds_played += this.interval_seconds;
        }
        if (is_playing && !this.recording_play && this.total_seconds_played > 30) {
            this.recording_play = true;
            log("creating WebSocket connection");
            // setup WebSocket connection
            const url = `wss://gue1-dealer.spotify.com/?access_token=${local_state.bearer_token}`;
            const socket = http.socket(url, {}, false);
            socket.connect({
                open: () => {
                },
                closed: (code, reason) => {
                    console.log(code.toString());
                    console.log(reason);
                },
                closing: (code, reason) => {
                    console.log(code.toString());
                    console.log(reason);
                },
                message: (msg) => {
                    // ignore queued messages
                    if (this.play_recorded) {
                        log("ignoring queued message");
                        return;
                    }
                    const message = JSON.parse(msg);
                    // this is the initial connection message
                    if ("method" in message) {
                        const connection_id = message.headers["Spotify-Connection-Id"];
                        const track_playback_url = "https://gue1-spclient.spotify.com/track-playback/v1/devices";
                        local_http.POST(track_playback_url, JSON.stringify({
                            device: {
                                brand: "spotify",
                                capabilities: {
                                    change_volume: true,
                                    enable_play_token: true,
                                    supports_file_media_type: true,
                                    play_token_lost_behavior: "pause",
                                    disable_connect: false,
                                    audio_podcasts: true,
                                    video_playback: true,
                                    manifest_formats: ["file_ids_mp3", "file_urls_mp3", "manifest_urls_audio_ad", "manifest_ids_video", "file_urls_external", "file_ids_mp4", "file_ids_mp4_dual", "manifest_urls_audio_ad"]
                                },
                                device_id: this.device_id,
                                device_type: "computer",
                                metadata: {},
                                model: "web_player",
                                name: "Web Player (Grayjay)",
                                platform_identifier: "web_player linux undefined;chrome 125.0.0.0;desktop",
                                is_group: false
                            },
                            outro_endcontent_snooping: false,
                            connection_id: connection_id,
                            client_version: "harmony:4.42.0-2780565f",
                            volume: 65535
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false);
                        const connect_state_url = `https://gue1-spclient.spotify.com/connect-state/v1/devices/hobs_${this.device_id.slice(0, 35)}`;
                        local_http.requestWithBody("PUT", connect_state_url, JSON.stringify({
                            "member_type": "CONNECT_STATE",
                            "device": {
                                "device_info": {
                                    "capabilities": {
                                        "can_be_player": false,
                                        "hidden": true,
                                        "needs_full_player_state": true
                                    }
                                }
                            }
                        }), {
                            Authorization: `Bearer ${local_state.bearer_token}`,
                            "X-Spotify-Connection-Id": connection_id
                        }, false);
                        const transfer_url = `https://gue1-spclient.spotify.com/connect-state/v1/player/command/from/${this.device_id}/to/${this.device_id}`;
                        local_http.POST(transfer_url, JSON.stringify({
                            "command": {
                                "context": {
                                    uri: this.context_uri,
                                    url: this.context_url,
                                    "metadata": {}
                                },
                                "play_origin": {
                                    "feature_identifier": "album",
                                    //feature_identifier: "show",
                                    //feature_identifier: "audiobook",
                                    "feature_version": "web-player_2024-05-24_1716563359844_29d0a3b",
                                    "referrer_identifier": "your_library"
                                },
                                "options": {
                                    "license": "on-demand",
                                    "skip_to": this.skip_to_data.content_type === "track" ? {
                                        track_index: this.skip_to_data.track_album_index,
                                        track_uid: this.skip_to_data.uid,
                                        track_uri: this.skip_to_data.track_uri
                                    } : {
                                        track_uri: this.skip_to_data.track_uri
                                    },
                                    "player_options_override": {}
                                },
                                "logging_params": {
                                    "page_instance_ids": [
                                        "54d854fb-fcb4-4e1f-a600-4fd9cbfaac2e"
                                    ],
                                    "interaction_ids": [
                                        "d3697919-e8be-425d-98bc-1ea70e28963a"
                                    ],
                                    "command_id": "46b1903536f6eda76783840368982c5e"
                                },
                                "endpoint": "play"
                            }
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false);
                        return;
                    }
                    if (message.uri === "hm://track-playback/v1/command") {
                        if (message.payloads[0]?.state_machine.states.length === 0) {
                            log("ignored WS message that was informing of the active device");
                            log(msg);
                            return;
                        }
                        const state_machine = message.payloads[0]?.state_machine;
                        const playback_id = (() => {
                            const data = this.skip_to_data;
                            switch (data.content_type) {
                                case "episode": {
                                    return state_machine?.states.find((state) => {
                                        return state_machine.tracks[state.track]?.metadata.uri === data.track_uri;
                                    })?.state_id;
                                }
                                case "track": {
                                    return message.payloads[0]?.state_machine.states.find((state) => {
                                        return state.track_uid === data.uid;
                                    })?.state_id;
                                }
                                default:
                                    throw assert_exhaustive(data);
                            }
                        })();
                        if (playback_id === undefined) {
                            log("error missing playback_id");
                            log(msg);
                            return;
                        }
                        let state_machine_id = state_machine?.state_machine_id;
                        if (state_machine_id === undefined) {
                            log("error missing state_machine_id");
                            log(msg);
                            return;
                        }
                        let seq_num = 3;
                        const initial_state_machine_id = state_machine_id;
                        const state_update_url = `https://gue1-spclient.spotify.com/track-playback/v1/devices/${this.device_id}/state`;
                        // simulate song play
                        const before_track_load = JSON.parse(local_http.requestWithBody("PUT", state_update_url, JSON.stringify({
                            seq_num: seq_num,
                            state_ref: { state_machine_id: state_machine_id, state_id: playback_id, paused: false },
                            sub_state: { playback_speed: 1, position: 0, duration: this.duration, media_type: "AUDIO", bitrate: 128000, audio_quality: "HIGH", format: 10 },
                            debug_source: "before_track_load"
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false).body);
                        state_machine_id = before_track_load.state_machine.state_machine_id;
                        seq_num += 1;
                        local_http.requestWithBody("PUT", state_update_url, JSON.stringify({
                            seq_num: seq_num,
                            state_ref: { state_machine_id: initial_state_machine_id, state_id: playback_id, paused: false },
                            sub_state: { playback_speed: 0, position: 0, duration: this.duration, media_type: "AUDIO", bitrate: 128000, audio_quality: "HIGH", format: 10 },
                            debug_source: "speed_changed"
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false);
                        seq_num += 1;
                        const speed_change = JSON.parse(local_http.requestWithBody("PUT", state_update_url, JSON.stringify({
                            seq_num: seq_num,
                            state_ref: { state_machine_id: state_machine_id, state_id: playback_id, paused: false },
                            sub_state: { playback_speed: 1, position: 0, duration: this.duration, media_type: "AUDIO", bitrate: 128000, audio_quality: "HIGH", format: 10 },
                            previous_position: 0,
                            debug_source: "speed_changed"
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false).body);
                        state_machine_id = speed_change.state_machine.state_machine_id;
                        seq_num += 1;
                        const started_playing = JSON.parse(local_http.requestWithBody("PUT", state_update_url, JSON.stringify({
                            seq_num: seq_num,
                            state_ref: { state_machine_id: state_machine_id, state_id: playback_id, paused: false },
                            sub_state: { playback_speed: 1, position: 1360, duration: this.duration, media_type: "AUDIO", bitrate: 128000, audio_quality: "HIGH", format: 10 },
                            previous_position: 1360,
                            debug_source: "started_playing"
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false).body);
                        state_machine_id = started_playing.state_machine.state_machine_id;
                        seq_num += 1;
                        const played_threshold_reached = JSON.parse(local_http.requestWithBody("PUT", state_update_url, JSON.stringify({
                            seq_num: seq_num,
                            state_ref: { state_machine_id: state_machine_id, state_id: playback_id, paused: false },
                            sub_state: { playback_speed: 1, position: 30786, duration: this.duration, media_type: "AUDIO", bitrate: 128000, audio_quality: "HIGH", format: 10 },
                            previous_position: 30786,
                            debug_source: "played_threshold_reached"
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false).body);
                        state_machine_id = played_threshold_reached.state_machine.state_machine_id;
                        seq_num += 1;
                        // delete the device
                        const url = `https://gue1-spclient.spotify.com/connect-state/v1/devices/hobs_${this.device_id.slice(0, 35)}`;
                        local_http.request("DELETE", url, { Authorization: `Bearer ${local_state.bearer_token}` }, false);
                        const deregister = `https://gue1-spclient.spotify.com/track-playback/v1/devices/${this.device_id}`;
                        local_http.requestWithBody("DELETE", deregister, JSON.stringify({
                            seq_num: seq_num,
                            state_ref: { state_machine_id: state_machine_id, state_id: playback_id, paused: false },
                            sub_state: { playback_speed: 1, position: 40786, duration: this.duration, media_type: "AUDIO", bitrate: 128000, audio_quality: "HIGH", format: 10 },
                            previous_position: 40786,
                            debug_source: "deregister"
                        }), { Authorization: `Bearer ${local_state.bearer_token}` }, false);
                        socket.close();
                        this.play_recorded = true;
                        log("closing WebSocket connection");
                        return;
                    }
                    log("ignored WS message");
                    log(msg);
                    return;
                },
                failure: (exception) => {
                    log("failure");
                    console.log(exception);
                }
            });
        }
    }
}
//#endregion
//#region utilities
function url_from_image_uri(image_uri) {
    const match_result = image_uri.match(/^spotify:(image|mosaic):([0-9a-zA-Z:]*)$/);
    if (match_result === null) {
        if (/^https:\/\//.test(image_uri)) {
            return image_uri;
        }
        throw new ScriptException("regex error");
    }
    const image_type = match_result[1];
    if (image_type === undefined) {
        throw new ScriptException("regex error");
    }
    const uri_id = match_result[2];
    if (uri_id === undefined) {
        throw new ScriptException("regex error");
    }
    switch (image_type) {
        case "image":
            return `https://i.scdn.co/image/${uri_id}`;
        case "mosaic":
            return `https://mosaic.scdn.co/300/${uri_id.split(":").join("")}`;
        default:
            throw assert_exhaustive(image_type);
    }
}
function id_from_uri(uri) {
    return parse_uri(uri).uri_id;
}
function parse_uri(uri) {
    const match_result = uri.match(/^spotify:(show|album|track|artist|playlist|section|episode|user|genre|collection):([0-9a-zA-Z]*|tracks|your-episodes)$/);
    if (match_result === null) {
        log(uri);
        throw new ScriptException("regex error");
    }
    const maybe_type = match_result[1];
    if (maybe_type === undefined) {
        throw new ScriptException("regex error");
    }
    const uri_type = maybe_type;
    const uri_id = match_result[2];
    if (uri_id === undefined) {
        throw new ScriptException("regex error");
    }
    return { uri_id, uri_type };
}
/**
 * Converts seconds to the timestamp format used in WebVTT
 * @param seconds
 * @returns
 */
function milliseconds_to_WebVTT_timestamp(milliseconds) {
    return new Date(milliseconds).toISOString().substring(11, 23);
}
function assert_never(value) {
    log(value);
}
function log_passthrough(value) {
    log(value);
    return value;
}
function assert_exhaustive(value, exception_message) {
    log(["Spotify log:", value]);
    if (exception_message !== undefined) {
        return new ScriptException(exception_message);
    }
    return;
}
//#endregion
//#region bad
// https://open.spotifycdn.com/cdn/build/web-player/vendor~web-player.391a2438.js
const Z = "0123456789abcdef";
const Q = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ee = [];
ee.length = 256;
for (let ke = 0; ke < 256; ke++)
    // @ts-expect-error
    ee[ke] = Z[ke >> 4] + Z[15 & ke];
const te = [];
te.length = 128;
for (let ke = 0; ke < Q.length; ++ke)
    te[Q.charCodeAt(ke)] = ke;
function get_gid(song_uri_id) {
    return 22 === song_uri_id.length ? function (e) {
        if (22 !== e.length)
            return null;
        const t = 2.3283064365386963e-10, n = 4294967296, i = 238328;
        let o, r, a, s, c;
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
            c ? null : ee[s >>> 24] + ee[s >>> 16 & 255] + ee[s >>> 8 & 255] + ee[255 & s] + ee[a >>> 24] + ee[a >>> 16 & 255] + ee[a >>> 8 & 255] + ee[255 & a] + ee[r >>> 24] + ee[r >>> 16 & 255] + ee[r >>> 8 & 255] + ee[255 & r] + ee[o >>> 24] + ee[o >>> 16 & 255] + ee[o >>> 8 & 255] + ee[255 & o];
    }(song_uri_id) : song_uri_id;
}
//#endregion
// export statements are removed during build step
// used for unit testing in SpotifyScript.test.ts
// export { get_gid, assert_never, log_passthrough, getPlaybackTracker };
//# sourceMappingURL=http://localhost:8080/SpotifyScript.js.map