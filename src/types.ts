//#region custom types
export type Settings = unknown

export type SpotifySource = Required<Source<
    { readonly something: "unknown" },
    "unknown",
    "POSTS",
    "POSTS",
    "POSTS"
>>

export type State = {
    readonly bearer_token: string
    readonly license_uri: string
}
//#endregion

//#region JSON types
export type ContentType = "track" | "episode"
export type PlaylistType = "album" | "playlist"

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
    })[]
    readonly language: "en"
}

export type EpisodeMetadataResponse = {
    readonly data: {
        readonly episodeUnionV2: {
            readonly name: string
            readonly duration: {
                readonly totalMilliseconds: number
            }
            readonly coverArt: {
                readonly sources: ImageSources
            }
            readonly releaseDate: {
                readonly isoString: string
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
            readonly mediaTypes: ["AUDIO"] | ["AUDIO", "VIDEO"]
        }
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
        }
    }
}

export type TrackMetadataResponse = {
    readonly data: {
        readonly trackUnion: {
            readonly playcount: string
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
            }
            readonly duration: {
                readonly totalMilliseconds: number
            }
        }
    }
}

export type LyricsResponse = {
    readonly lyrics: {
        readonly language: "en"
        readonly lines: {
            readonly startTimeMs: string
            readonly words: string
        }[]
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
    readonly file: {
        readonly file_id: string
        // only MP4_128 and MP4_256 are available on the web and therefore what we support
        readonly format: "MP4_128" | "AAC_24" | "MP4_256" | "MP4_256_DUAL" | "OGG_VORBIS_320"
    }[]
}

export type PodcastMetadataResponse = {
    readonly data: {
        readonly podcastUnionV2: {
            readonly rating: {
                readonly averageRating: {
                    readonly average: number
                    readonly totalRatings: number
                }
            }
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
    }[]
    readonly totalCount: number
}

export type AlbumResponse = {
    readonly data: {
        readonly albumUnion: {
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

export type GetLicenseResponse = {
    readonly expires: number
    readonly uri: string
}
//#endregion
