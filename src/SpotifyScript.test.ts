//#region imports
import { describe, test } from "node:test"
import assert from "node:assert"
// initializes global state
import "@kaidelorenzo/grayjay-polyfill"

import { get_gid, get_secrets } from "./SpotifyScript.js"
//#endregion

describe("script module", { skip: false }, () => {
    test("test disable", { skip: false }, () => {
        if (source.disable === undefined) {
            throw new Error("Missing disable method")
        }
        source.disable()
        assert.strictEqual("11", (11).toString())
    })
    test("test get gid", { skip: false }, () => {
        const song_uri_id = "6XXxKsu3RJeN3ZvbMYrgQW"
        const gid = get_gid(song_uri_id)
        assert.strictEqual(gid, "e4eac7232f3d48fb965b5a03c49eb93a")
    })
    test("test regex", { skip: false }, () => {
        [
            "182bf8ab",
            "4ea32f5e",
            "16ed73ab",
            "c5849afb",
            "f34a1773",
            "4333d450",
            "1890476d"
        ].map((file_id) => {
            get_secrets(`https://open-exp.spotifycdn.com/cdn/build/web-player/web-player.${file_id}.js`)
        })
    })
})
