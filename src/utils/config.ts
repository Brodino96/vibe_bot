import { Snowflake } from "discord.js"
import fs from "fs"
import path from "path"

const configPath = path.join(process.cwd(), "config", "config.json")

export interface Config {
    token: string,
    clientId: Snowflake
}

const defaultConfig: Config = {
    token: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    clientId: "xxxxxxxxxxxxxxxxxxx"
}

function loadConfig(): Config {

    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(path.dirname(configPath), { recursive: true })
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4))
        console.log("Created default config.json. Please update the values")
        process.exit(1)
    }

    return JSON.parse(fs.readFileSync(configPath, "utf-8")) as Config
}

export const config = loadConfig()