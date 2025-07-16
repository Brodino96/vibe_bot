import { Command } from "../commands"
import { musicQueue } from "./_music"

export const skipCommand = new Command(
    "skip",
    async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const serverQueue = musicQueue.get(interaction.guildId!)
        if (!serverQueue) {
            await interaction.reply({ content: "There is no song that I could skip!", flags: "Ephemeral" })
            return
        }

        if (serverQueue.songs.length === 0) {
            await interaction.reply({ content: "There are no songs to skip!", flags: "Ephemeral" })
            return
        }

        serverQueue.player.stop()
        await interaction.reply({ content: "Skipped the song!" })
    }
)