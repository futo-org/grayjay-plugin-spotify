import { execFileSync } from "node:child_process"

execFileSync("npm", ["update"], { stdio: 'inherit' })
execFileSync("npm", ["run", "build"], { stdio: 'inherit' })
execFileSync("npm", ["run", "lint"], { stdio: 'inherit' })
execFileSync("npm", ["test"], { stdio: 'inherit' })
