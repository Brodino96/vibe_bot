import { Command } from "../commands"
import { ChannelType, GuildMember } from "discord.js"
import { musicQueue, playSong } from "./_music"
import play from "play-dl"
import { AudioPlayerStatus, createAudioPlayer, joinVoiceChannel } from "@discordjs/voice"

export const playCommand = new Command(
    "play",
    async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const member = interaction.member as GuildMember
        const voiceChannel = member.voice.channel

        if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
            await interaction.reply({ content: "You need to be in a voice channel to play music!", flags: "Ephemeral" })
            return
        }

        const songQuery = interaction.options.getString("song")
        let serverQueue = musicQueue.get(interaction.guildId!)

        if (!songQuery) {
            if (serverQueue && serverQueue.player.state.status === AudioPlayerStatus.Paused) {
                serverQueue.player.unpause()
                await interaction.reply({ content: "Resumed the music!" })
            } else {
                await interaction.reply({ content: "You need to provide a song to play!", flags: "Ephemeral" })
            }
            return
        }
        
        await interaction.deferReply()

        const searchResult = await play.search(songQuery, { limit: 1 })
        if (searchResult.length === 0) {
            await interaction.editReply({ content: "I couldn't find that song." })
            return
        }

        const video = searchResult[0]
        const song = {
            title: video.title!,
            url: video.url,
            duration: video.durationRaw,
        }

        if (!serverQueue) {
            const player = createAudioPlayer()
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guildId!,
                adapterCreator: interaction.guild!.voiceAdapterCreator,
            })

            serverQueue = {
                voiceChannel: voiceChannel,
                connection: connection,
                player: player,
                songs: [song],
                volume: 5,
            }

            musicQueue.set(interaction.guildId!, serverQueue)

            player.on(AudioPlayerStatus.Idle, () => {
                serverQueue!.songs.shift()
                if(serverQueue!.songs.length > 0) {
                    playSong(interaction.guild!, serverQueue!.songs[0])
                } else {
                    serverQueue!.connection.destroy()
                    musicQueue.delete(interaction.guildId!)
                }
            })
            
            connection.subscribe(player)
            
            try {
                playSong(interaction.guild!, song)
                await interaction.editReply({ content: `Start playing: **${song.title}**` })
            } catch (error) {
                console.error(error)
                musicQueue.delete(interaction.guildId!)
                await interaction.editReply({ content: "There was an error playing the song." })
            }
        } else {
            serverQueue.songs.push(song)
            await interaction.editReply({ content: `**${song.title}** has been added to the queue!` })
        }
    }
)