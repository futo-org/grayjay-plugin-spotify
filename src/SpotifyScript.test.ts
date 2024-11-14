//#region imports
import { describe, test } from "node:test"
import assert from "node:assert"
// initializes global state
import "@kaidelorenzo/grayjay-polyfill"

import { get_gid } from "./SpotifyScript.js"
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
})
