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
        readonly format: "MP4_128" | "AAC_24"
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
