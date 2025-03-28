//#region custom types
export type Settings = {
    spotifyActivity: boolean
}

export type SpotifySource = Required<Omit<Source<
    { readonly [key: string]: string },
    string,
    ChannelTypeCapabilities,
    SearchTypes,
    FeedType,
    Settings
>,
    "searchSuggestions"
    | "getComments"
    | "getSubComments"
    | "getSearchChannelContentsCapabilities"
    | "getLiveChatWindow"
    | "searchChannelContents"
    | "getContentRecommendations"
>>

export type State = {
    readonly feature_version: string
    readonly bearer_token: string
    readonly expiration_timestamp_ms: number
    readonly license_uri: string
    readonly is_premium: boolean
    readonly username?: string
    readonly totp_init: number[]
    readonly server_time: number
}
export type ChannelTypeCapabilities = typeof Type.Feed.Playlists | typeof Type.Feed.Albums | typeof Type.Feed.Videos
export type SearchTypes = typeof Type.Feed.Videos

export type Section = GenrePlaylistSection
    | HomePlaylistSection
    | {
        readonly data: {
            readonly __typename: "BrowseRelatedSectionData"
        }
    }
    | WhatsNewSection
    | RecentlyPlayedSection
export type RecentlyPlayedSection = {
    readonly data: {
        readonly __typename: "CustomRecentlyPlayedSectionData"
        readonly title: {
            readonly text: "Recently played"
        }
    }
    readonly section_url: "https://open.spotify.com/genre/recently-played"
    readonly sectionItems: {
        readonly items: {
            readonly content: {
                readonly data: SectionItemAlbum | SectionItemPlaylist | SectionItemPodcast | SectionItemArtist | SectionItemPseudoPlaylist
                readonly __typename: "PlaylistResponseWrapper" | "AlbumResponseWrapper" | "LibraryPseudoPlaylistResponseWrapper"
            } | {
                readonly __typename: "UnknownType"
            }
        }[]
    }
}
export type WhatsNewSection = {
    readonly data: {
        readonly __typename: "WhatsNewSectionData"
        readonly title: {
            readonly text: "What's New"
        }
    }
    readonly section_url: "https://open.spotify.com/content-feed"
    readonly sectionItems: {
        readonly items: {
            readonly content: {
                readonly data: SectionItemAlbum
                readonly __typename: "PlaylistResponseWrapper" | "AlbumResponseWrapper"
            } | {
                readonly __typename: "UnknownType"
            }
        }[]
        readonly totalCount: number
    }
}
//#endregion

//#region JSON types
export type ContentType = "track" | "episode"
export type PlaylistType = "album" | "playlist" | "collection"
export type CollectionType = "your-episodes" | "tracks"
export type ChannelType = "show" | "user" | "artist" | "genre" | "section" | "content-feed"
export type UriType = "show" | "album" | "track" | "artist" | "playlist" | "section" | "episode" | "user" | "genre" | "collection"

export type FollowingResponse = {
    readonly profiles?: {
        readonly uri: string
    }[]
}
export type LikedTracksResponse = {
    readonly data: {
        readonly me: {
            readonly library: {
                readonly tracks: {
                    readonly totalCount: number
                    readonly items: {
                        readonly track: {
                            readonly data: SectionItemTrack
                            readonly _uri: string
                        }
                    }[]
                }
            }
        }
    }
}
export type LikedEpisodesResponse = {
    readonly data: {
        readonly me: {
            readonly library: {
                readonly episodes: {
                    readonly totalCount: number
                    readonly items: {
                        readonly episode: {
                            readonly data: SectionItemEpisode
                            readonly _uri: string
                        }
                    }[]
                }
            }
        }
    }
}
export type LibraryResponse = {
    readonly data: {
        readonly me: {
            readonly libraryV3: {
                readonly totalCount: number
                readonly items: {
                    readonly item: {
                        readonly data: SectionItemFolder
                        | SectionItemPodcast
                        | SectionItemPlaylist
                        | SectionItemAlbum
                        | SectionItemArtist
                        | SectionItemAudiobook
                        | SectionItemPseudoPlaylist
                        | SectionItemNotFound
                        | SectionItemRestrictedContent
                        | SectionItemPreRelease
                    }
                }[]
            }
        }
    }
}
export type SectionItemFolder = {
    readonly __typename: "Folder"
    readonly playlistCount: number
    readonly folderCount: number
    readonly name: string
    readonly uri: string
}
export type SectionItemPseudoPlaylist = {
    readonly image: {
        readonly sources: ImageSources
    }
    readonly name: string
    readonly __typename: "PseudoPlaylist"
    readonly uri: string

}
export type SectionItemTrack = {
    readonly __typename: "Track"
    readonly name: string
    readonly id: string
    readonly duration: {
        readonly totalMilliseconds: number
    }
    readonly artists: {
        readonly items: {
            readonly uri: string
            readonly profile: {
                readonly name: string
            }
        }[]
    }
    readonly albumOfTrack: {
        readonly coverArt: {
            readonly sources: ImageSources
        }
    }
}
export type SearchResponse = {
    readonly data: {
        readonly searchV2: {
            readonly albumsV2: {
                readonly items: {
                    readonly data: SectionItemAlbum | SectionItemPreRelease

                }[]
                readonly totalCount: number
            }
            readonly artists: {
                readonly items: {
                    readonly data: SectionItemArtist

                }[]
                readonly totalCount: number
            }
            readonly audiobooks: {
                readonly items: {
                    readonly data: SectionItemAudiobook

                }[]
                readonly totalCount: number
            }
            readonly episodes: {
                readonly items: {
                    readonly data: SectionItemEpisode

                }[]
                readonly totalCount: number
            }
            readonly genres: {
                readonly items: {
                    readonly data: SectionItemGenre

                }[]
                readonly totalCount: number
            }
            readonly playlists: {
                readonly items: {
                    readonly data: SectionItemPlaylist | SectionItemNotFound

                }[]
                readonly totalCount: number
            }
            readonly podcasts: {
                readonly items: {
                    readonly data: SectionItemPodcast

                }[]
                readonly totalCount: number
            }
            readonly tracksV2: {
                readonly items: {
                    readonly item: {
                        readonly data: SectionItemTrack
                    }
                }[]
                readonly totalCount: number
            }
            readonly users: {
                readonly items: {
                    readonly data: SectionItemUser

                }[]
                readonly totalCount: number
            }
        }
    }
}
export type SectionItemUser = {
    readonly __typename: "User"
    readonly displayName: string
    readonly avatar: null | {
        readonly sources: ImageSources
    }
    readonly username: string
}
export type SectionItemPodcast = {
    readonly __typename: "Podcast"
    readonly uri: string
    readonly name: string
    readonly coverArt: {
        sources: ImageSources
    }
}
export type SectionItemAudiobook = {
    readonly __typename: "Audiobook"
    readonly uri: string
    readonly name: string
    readonly coverArt: {
        sources: ImageSources
    }
}
export type SectionItemGenre = {
    readonly __typename: "Genre"
    readonly uri: string
    readonly name: string
    readonly image: {
        sources: ImageSources
    }
}
export type SectionItemEpisode = {
    readonly __typename: "Episode"
    readonly coverArt: {
        readonly sources: ImageSources
    }
    readonly duration: {
        readonly totalMilliseconds: number
    }
    readonly id: string
    readonly uri: string
    readonly name: string
    readonly podcastV2: {
        readonly data: {
            readonly name: string
            /** in this format "spotify:show:5VzFvh1JlEhBMS6ZHZ8CNO" */
            readonly uri: string
            readonly coverArt: null | {
                readonly sources: ImageSources
            }
            readonly __typename: "Podcast"
        } | {
            readonly __typename: "NotFound"
        }
    }
    readonly releaseDate: null | {
        readonly isoString: string
    }
}
export type SectionItemPlaylist = {
    readonly attributes: {
        key: "created" | "madeFor.username"
        value: string
    }[]
    readonly description: string
    readonly name: string
    readonly ownerV2: {
        readonly data: {
            readonly name: string
            readonly username: string
            readonly avatar?: {
                readonly sources: ImageSources
            }
        }
    }
    readonly images: {
        readonly items: {
            readonly sources: {
                readonly height: number | null
                readonly url: string
            }[]
        }[]
    }
    readonly uri: string
    readonly __typename: "Playlist"

}
export type SectionItemNotFound = {
    readonly __typename: "NotFound"
}
export type SectionItemRestrictedContent = {
    readonly __typename: "RestrictedContent"
}
export type SectionItemPreRelease = {
    readonly __typename: "PreRelease"
}
export type SectionItemAlbum = {
    readonly name: string
    readonly coverArt: {
        readonly sources: ImageSources
    }
    readonly artists: {
        readonly items: {
            readonly profile: {
                readonly name: string
            }
            readonly uri: string
        }[]
    }
    readonly date: {
        readonly year: number
    }
    readonly uri: string
    readonly __typename: "Album"
}
export type SectionItemArtist = {
    readonly __typename: "Artist"
    readonly profile: {
        readonly name: string
    }
    readonly visuals: {
        readonly avatarImage: null | {
            readonly sources: ImageSources
        }
    }
    readonly uri: string
}
export type GenrePlaylistSection = {
    readonly data: {
        readonly __typename: "BrowseGenericSectionData"
        readonly title: null | {
            readonly transformedLabel: string
        }
    }
    readonly uri: string
    readonly sectionItems: {
        readonly items: {
            readonly content: {
                readonly data: SectionItemAlbum | SectionItemPlaylist | SectionItemArtist | SectionItemNotFound | SectionItemEpisode
                readonly __typename: "PlaylistResponseWrapper" | "AlbumResponseWrapper"
            } | {
                readonly __typename: "UnknownType"
            }
        }[]
        readonly totalCount: number
    }
}

export type HomePlaylistSection = {
    readonly data: {
        readonly __typename: "HomeGenericSectionData" | "HomeRecentlyPlayedSectionData"
        readonly title: {
            readonly text: string
        }
    }
    readonly uri: string
    readonly sectionItems: {
        readonly items: {
            readonly content: {
                readonly data: SectionItemAlbum | SectionItemPlaylist | SectionItemArtist | SectionItemNotFound | SectionItemEpisode
                readonly __typename: "PlaylistResponseWrapper" | "AlbumResponseWrapper"
            } | {
                readonly __typename: "UnknownType"
            }
        }[]
        readonly totalCount: number
    }
}

export type BrowsePageResponse = {
    readonly data: {
        readonly browse: {
            readonly header: {
                readonly title: {
                    readonly transformedLabel: string
                }
            }
            readonly sections: {
                readonly items: Section[]
                readonly totalCount: number
            }
            readonly __typename: "BrowseSectionContainer"
        } | {
            readonly __typename: "GenericError"
        }
    }
}

export type BrowseSectionResponse = {
    readonly data: {
        readonly browseSection: {
            readonly sectionItems: {
                readonly pagingInfo: {
                    readonly nextOffset: number | null
                }
                readonly totalCount: number
                readonly items: {
                    readonly content: {
                        readonly data: SectionItemAlbum | SectionItemPlaylist | SectionItemArtist | SectionItemNotFound | SectionItemEpisode
                    }
                }[]
            }
            readonly data: {
                readonly title: {
                    readonly transformedLabel: string
                }
            }
        }

    }
}

export type RecentlyPlayedUris = {
    readonly playContexts: {
        readonly uri: string
    }[]
}

export type RecentlyPlayedDetails = {
    readonly data: {
        readonly lookup: ({
            readonly __typename: "AlbumResponseWrapper" | "PlaylistResponseWrapper"
            readonly data: SectionItemAlbum | SectionItemPlaylist | SectionItemArtist | SectionItemPodcast
        } | {
            readonly __typename: "UnknownTypeWrapper"
            readonly _uri: string
        })[]
    }
}

export type UserPlaylistsResponse = {
    readonly public_playlists: {
        uri: string
        name: string
        /** not an actual url. in the format spotify:(image|mosaic):<id>
         * image url prefix is https://i.scdn.co/image/
         * mosaic is https://mosaic.scdn.co/300/
         */
        image_url: "spotify:image:ab67706c0000da84e7cfad2835d15c8d7829ddb8",
        owner_name: string
        owner_uri: string
    }[]
    /** this is bugged and only works when offset is 0 */
    readonly total_public_playlists_count: number
}

export type BookChaptersResponse = {
    readonly data: {
        readonly podcastUnionV2: {
            readonly chaptersV2: {
                readonly totalCount: number
                readonly items: {
                    readonly entity: {
                        readonly data: IChapterEpisodeUnionV2
                    }
                }[]
                readonly pagingInfo: {
                    readonly nextOffset: number | null
                }
            }
        }
    }
}

export type PodcastEpisodesResponse = {
    readonly data: {
        readonly podcastUnionV2: {
            readonly episodesV2: {
                readonly totalCount: number
                readonly items: {
                    readonly entity: {
                        readonly data: IEpisodeEpisodeUnionV2
                    }
                }[]
                readonly pagingInfo: {
                    readonly nextOffset: number | null
                }
            }
        }
    }
}

export type TranscriptResponse = {
    readonly section: ({
        readonly startMs: number
        readonly text: {
            readonly sentence: {
                readonly text: string
            }
        }
    } | {
        readonly startMs: number
        readonly title: unknown
    } | {
        readonly startMs: number
        readonly fallback: {
            readonly sentence: {
                readonly text: string
            }
        }
    })[]
    readonly language: "en"
}

export interface ICommonEpisodeUnionv2 {
    readonly name: string
    readonly duration: {
        readonly totalMilliseconds: number
    }
    readonly coverArt: {
        readonly sources: ImageSources
    }
    readonly uri: string
    readonly audio: {
        readonly items: {
            readonly fileId: string
            // only MP4_128 and MP4_256 are available on the web and therefore what we support
            readonly format: "MP4_128" | "AAC_24"
        }[]
    }
    readonly htmlDescription: string
    readonly mediaTypes: ["AUDIO"] | ["AUDIO", "VIDEO"]
    readonly transcripts: undefined | {
        readonly items: unknown
    }
    readonly playability: {
        playable: boolean
    }
    readonly "__typename": "Episode" | "Chapter"
}

export interface IChapterEpisodeUnionV2 extends ICommonEpisodeUnionv2 {
    readonly audiobookV2: {
        readonly data: {
            readonly name: string
            /** in this format "spotify:show:5VzFvh1JlEhBMS6ZHZ8CNO" */
            readonly uri: string
            readonly coverArt: {
                readonly sources: ImageSources
            }
        }
    }
    readonly "__typename": "Chapter"
}

export interface IEpisodeEpisodeUnionV2 extends ICommonEpisodeUnionv2 {
    readonly podcastV2: {
        readonly data: {
            readonly name: string
            /** in this format "spotify:show:5VzFvh1JlEhBMS6ZHZ8CNO" */
            readonly uri: string
            readonly coverArt: {
                readonly sources: ImageSources
            }
        }
    }
    readonly releaseDate: {
        readonly isoString: string
    }
    readonly "__typename": "Episode"
}

export type EpisodeMetadataResponse = {
    readonly data: {
        readonly episodeUnionV2: IEpisodeEpisodeUnionV2 | IChapterEpisodeUnionV2
    }
}

export type ArtistMetadataResponse = {
    readonly data: {
        readonly artistUnion: {
            readonly stats: {
                readonly followers: number
                readonly monthlyListeners: number
                readonly worldRank: number
            }
            readonly profile: {
                readonly name: string
                readonly biography: {
                    readonly text: string
                }
            }
            readonly visuals: {
                readonly avatarImage: null | {
                    readonly sources: ImageSources
                }
                readonly headerImage: null | {
                    readonly sources: ImageSources
                }
            }
        }
    }
}

export type DiscographyResponse = {
    readonly data: {
        readonly artistUnion: {
            readonly discography: {
                readonly all: {
                    readonly items: {
                        readonly releases: {
                            readonly items: {
                                readonly id: string
                                readonly name: string
                                readonly tracks: {
                                    readonly totalCount: number
                                }
                                readonly date: {
                                    readonly isoString: string
                                }
                                readonly coverArt: {
                                    readonly sources: ImageSources
                                }
                            }[]
                        }
                    }[]
                    readonly totalCount: number
                }
            }
        }
    }
}

export type TrackMetadataResponse = {
    readonly data: {
        readonly trackUnion: {
            readonly playcount: string
            readonly uri: string
            readonly trackNumber: number
            readonly firstArtist: {
                readonly items: {
                    readonly id: string
                    readonly profile: { readonly name: string }
                    readonly visuals: {
                        readonly avatarImage: {
                            readonly sources: ImageSources
                        }
                    }
                }[]
            }
            readonly albumOfTrack: {
                readonly date: {
                    readonly isoString: string
                }
                readonly uri: string
            }
            readonly duration: {
                readonly totalMilliseconds: number
            }
        }
    }
}

export type LyricsResponse = {
    readonly lyrics: {
        readonly language: "en" | "es" | "fr"
        readonly lines: {
            readonly startTimeMs: string
            readonly words: string
        }[]
    }
}

export type WhatsNewResponse = {
    readonly data: {
        readonly whatsNewFeedItems: {
            readonly items: {
                readonly content: {
                    readonly data: SectionItemAlbum
                    readonly __typename: "AlbumResponseWrapper"
                }
            }[]
            readonly totalCount: number
        }
    }
}

export type HomeResponse = {
    readonly data: {
        readonly home: {
            readonly sectionContainer: {
                readonly sections: {
                    readonly items: Section[]
                    readonly totalCount: number
                }
            }
        }
    }
}

export type SongMetadataResponse = {
    readonly name: string
    /** in milliseconds */
    readonly duration: number
    readonly album: {
        readonly cover_group: {
            readonly image: {
                readonly file_id: string
                readonly height: number
            }[]
        }
        readonly date: {
            readonly day: number
            readonly month: number
            readonly year: number
        }
    }
    readonly artist: {
        gid: string
        name: string
    }[]
    readonly canonical_uri: string
    readonly file: Files | undefined
    readonly alternative: undefined | {
        readonly file: Files
    }[]
}

type Files = {
    readonly file_id: string
    // only MP4_128 and MP4_256 are available on the web and therefore what we support
    readonly format: "MP4_128" | "AAC_24" | "MP4_256" | "MP4_256_DUAL" | "OGG_VORBIS_320"
}[]

export type ShowMetadataResponse = {
    readonly data: {
        readonly podcastUnionV2: {
            readonly rating: {
                readonly averageRating: {
                    readonly average: number
                    readonly totalRatings: number
                }
            }
            readonly htmlDescription: string
            readonly name: string
            readonly coverArt: {
                readonly sources: ImageSources
            }
            readonly __typename: "Podcast"
        } | {
            readonly rating: {
                readonly averageRating: {
                    readonly average: number
                    readonly totalRatings: number
                }
            }
            readonly publishDate: {
                readonly isoString: string
            }
            readonly htmlDescription: string
            readonly name: string
            readonly coverArt: {
                readonly sources: ImageSources
            }
            readonly __typename: "Audiobook"
        }
    }
}

export type ArtistDetails = {
    readonly id: string
    readonly profile: { readonly name: string }
    readonly visuals: {
        readonly avatarImage: {
            readonly sources: ImageSources
        }
    }
}

export type AlbumTracksResponse = {
    readonly data: {
        readonly albumUnion: {
            readonly tracks: Tracks
        }
    }
}

export type Tracks = {
    readonly items: {
        readonly track: {
            readonly playcount: string
            readonly name: string
            readonly duration: { readonly totalMilliseconds: number }
            readonly artists: {
                readonly items: {
                    readonly profile: { readonly name: string }
                    readonly uri: string
                }[]
            }
            readonly uri: string
        }
        readonly uid: string
    }[]
    readonly totalCount: number
}

export type AlbumResponse = {
    readonly data: {
        readonly albumUnion: {
            readonly uri: string
            readonly name: string
            readonly tracks: Tracks
            readonly artists: {
                readonly items: ArtistDetails[]
            }
            readonly coverArt: {
                readonly sources: ImageSources
            }
            readonly date: {
                readonly isoString: string
            }
        }
    }
}

export type PlaylistContentResponse = {
    readonly data: {
        readonly playlistV2: {
            readonly content: PlaylistContent
        }
    }
}

type Owner = {
    readonly data: {
        readonly name: string
        readonly username: string
        readonly avatar: null | {
            readonly sources: ImageSources
        }

    }
}

export type PlaylistResponse = {
    readonly data: {
        readonly playlistV2: {
            readonly uri: string
            readonly name: string
            readonly ownerV2: Owner
            readonly images: {
                readonly items: {
                    readonly sources: {
                        readonly url: string
                        readonly height: number | null
                    }[]
                }[]
            }
            readonly content: PlaylistContent
        }
    }

}

type ImageSources = {
    readonly height: number
    readonly url: string
}[]

export type PlaylistContent = {
    readonly totalCount: number
    readonly items: {
        readonly addedAt: {
            readonly isoString: string
        }
        readonly itemV2: {
            readonly __typename: "EpisodeOrChapterResponseWrapper"
            readonly data: {
                readonly __typename: "Episode"
                readonly coverArt: {
                    readonly sources: ImageSources
                }
                readonly episodeDuration: {
                    totalMilliseconds: number
                }
                readonly name: string
                readonly uri: string
                readonly podcastV2: {
                    readonly data: {
                        readonly coverArt: {
                            readonly sources: ImageSources
                        }
                        readonly name: string
                        readonly uri: string
                    }
                }
                readonly releaseDate: {
                    readonly isoString: string
                }
            } | {
                readonly __typename: "RestrictedContent"
            }
        } | {
            readonly __typename: "TrackResponseWrapper"
            readonly data: {
                readonly playcount: string
                readonly trackDuration: {
                    readonly totalMilliseconds: number
                }
                readonly name: string
                readonly uri: string
                readonly albumOfTrack: {
                    readonly coverArt: {
                        readonly sources: ImageSources
                    }
                }
                readonly artists: {
                    readonly items: {
                        readonly uri: string
                        readonly profile: { readonly name: string }
                    }[]
                }
            }
        } | {
            readonly __typename: "LocalTrackResponseWrapper"
        }
    }[]
}

export type FileManifestResponse = {
    readonly cdnurl: string[]
}

export type SeektableResponse = {
    readonly timescale: 44100
    readonly encoder_delay_samples: 1024
    readonly index_range: [number, number]
    readonly init_range: [number, number]
    readonly offset: number
    readonly padding_samples: number
    readonly pssh: string
    readonly pssh_widevine: string
    readonly seektable_version: string
    readonly segments: [number, number][]
}

export type ProfileAttributesResponse = {
    readonly data: {
        readonly me: null | {
            readonly profile: {
                readonly username: string
            }
        }
    }
}

export type GetLicenseResponse = {
    readonly expires: number
    readonly uri: string
}
//#endregion
