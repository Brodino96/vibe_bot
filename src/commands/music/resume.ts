import { Command } from "../commands"
import { musicQueue } from "./_music"
import { AudioPlayerStatus } from "@discordjs/voice"

export const resumeCommand = new Command(
    "resume",
    async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const serverQueue = musicQueue.get(interaction.guildId!)
        if (!serverQueue) {
            await interaction.reply({ content: "There is no song that I could resume!", ephemeral: true })
            return
        }

        if (serverQueue.player.state.status === AudioPlayerStatus.Playing) {
            await interaction.reply({ content: "The music is already playing!", ephemeral: true })
            return
        }

        serverQueue.player.unpause()
        await interaction.reply({ content: "Resumed the music!" })
    }
)