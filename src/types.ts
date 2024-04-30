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
                readonly sources: {
                    readonly url: string
                    readonly height: number
                }[]
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
    }
    readonly artist: {
        gid: string
        name: string
    }[]
    readonly date: {
        readonly day: number
        readonly month: number
        readonly year: number
    }
    readonly canonical_uri: string
    readonly file: {
        readonly file_id: string
        // only MP4_128 and MP4_256 are available on the web and therefore what we support
        readonly format: "MP4_128" | "AAC_24" | "MP4_256" | "MP4_256_DUAL" | "OGG_VORBIS_320"
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
