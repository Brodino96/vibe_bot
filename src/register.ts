import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { loadConfig } from "./utils/config"
import fs from "fs"
import path from "path"

const config = loadConfig()

const commands: any[] = []

function findCommandFiles(dir: string): string[] {
    let files: string[] = []
    const items = fs.readdirSync(dir, { withFileTypes: true })

    for (const item of items) {
        const fullPath = path.join(dir, item.name)
        if (item.isDirectory()) {
            files = files.concat(findCommandFiles(fullPath))
        } else if (item.isFile() && item.name.endsWith(".ts") && !item.name.startsWith("_")) {
            files.push(fullPath)
        }
    }
    return files
}

const commandFiles = findCommandFiles(path.join(__dirname, "commands"))

for (const file of commandFiles) {
    const commandModule = require(file)
    for (const key in commandModule) {
        if (commandModule[key] && commandModule[key].name) {
            commands.push({
                name: commandModule[key].name,
                description: `Command for ${commandModule[key].name}`,
                options: commandModule[key].name === "play" ? [{name: "song", type: 3, description: "The song to play", required: false}] : []
            })
        }
    }
}

const rest = new REST({ version: "9" }).setToken(config.token);

(async () => {
    try {
        console.log("Started refreshing application (/) commands.")

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        )

        console.log("Successfully reloaded application (/) commands.")
    } catch (error) {
        console.error(error)
    }
})()