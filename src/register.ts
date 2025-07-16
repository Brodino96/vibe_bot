import { REST, Routes } from "discord.js"
import { config } from "./utils/config"
import { tryCatch } from "typecatch"

async function registerCommands() {

    const commandsToRegister: { name: string, description: string, options: any[] }[] = [
        {
            name: "play",
            description: "Plays the song that you specify",
            options: [{name: "song", type: 3, description: "The song to play", required: false}]
        },
        {
            name: "pause",
            description: "Pauses the current song",
            options: []
        },
        {
            name: "resume",
            description: "Resumes the paused song",
            options: []
        },
        {
            name: "skip",
            description: "Skips the current song",
            options: []
        },
        {
            name: "leave",
            description: "Makes the bot quit the current voice chat",
            options: []
        }
    ]

    const rest = new REST({ version: "9"}).setToken(config.token)

    const { error } = await tryCatch(rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commandsToRegister }
    ))

    if (error) {
        console.error(error)
    }

    console.log("Successfully reloaded application (/) commands")
}

registerCommands()