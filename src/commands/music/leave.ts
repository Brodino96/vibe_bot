import { Command } from "../commands"
import { musicQueue } from "./_music"

export const leaveCommand = new Command(
    "leave",
    async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const serverQueue = musicQueue.get(interaction.guildId!)
        if (!serverQueue) {
            await interaction.reply({ content: "I'm not in a voice channel!", flags: "Ephemeral" })
            return
        }

        serverQueue.connection.destroy()
        musicQueue.delete(interaction.guildId!)
        await interaction.reply({ content: "Left the voice channel!" })
    }
)