import { execFileSync } from "node:child_process"

execFileSync("npm", ["run", "debug-build"], { stdio: 'inherit' })
execFileSync("node", ["src/utilities/server.js"], { stdio: 'inherit' })
