import { Command } from "../commands"
import { musicQueue } from "./_music"
import { AudioPlayerStatus } from "@discordjs/voice"

export const pauseCommand = new Command(
    "pause",
    async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const serverQueue = musicQueue.get(interaction.guildId!)
        if (!serverQueue) {
            await interaction.reply({ content: "There is no song that I could pause!", flags: "Ephemeral" })
            return
        }

        if (serverQueue.player.state.status === AudioPlayerStatus.Paused) {
            await interaction.reply({ content: "The music is already paused!", flags: "Ephemeral" })
            return
        }

        serverQueue.player.pause()
        await interaction.reply({ content: "Paused the music!" })
    }
)