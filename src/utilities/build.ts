import { createReadStream, createWriteStream } from "node:fs"
import { copyFile, rename, } from "node:fs/promises"
import * as readline from "node:readline"
import { EOL } from "node:os"
import { execFileSync } from "node:child_process"
import { argv } from "node:process"

async function modifyFile(filePath: string, offset: number) {
    const tempFilePath = `${filePath}.tmp`

    const readStream = createReadStream(filePath, 'utf-8')
    const writeStream = createWriteStream(tempFilePath, 'utf-8')
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    })

    const lines: string[] = []

    for await (const line of rl) {
        lines.push(line)
    }

    rl.close();
    readStream.close()

    if (lines[lines.length - (1 + offset)]?.slice(0, 6) === "export") {
        // Comment out export line
        lines[lines.length - (1 + offset)] = `// ${lines[lines.length - (1 + offset)]}`
    }

    for (const line of lines) {
        writeStream.write(line + EOL)
    }

    writeStream.end()

    writeStream.on('finish', async () => {
        // Rename the temporary file to overwrite the original file
        await rename(tempFilePath, filePath)
    });

    writeStream.on('error', (error) => {
        console.error('Error writing to file:', error)
    })
}

await copyFile("src/SpotifyScript.ts", "build/SpotifyScript.ts")
await copyFile("src/types.ts", "build/types.ts")
if (argv[2] !== undefined) {
    execFileSync("tsc", ["--mapRoot", argv[2], "--sourceRoot", argv[2]], { stdio: 'inherit' })
} else {
    execFileSync("tsc", { stdio: 'inherit' })
}
modifyFile("build/SpotifyScript.ts", 0)
modifyFile("build/SpotifyScript.js", 1)
