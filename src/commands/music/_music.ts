import { Guild, VoiceChannel } from "discord.js"
import { AudioPlayer, createAudioResource, VoiceConnection } from "@discordjs/voice"
import play from "play-dl"

export interface Song {
    title: string
    url: string
    duration: string
}

export interface GuildQueue {
    voiceChannel: VoiceChannel
    connection: VoiceConnection
    player: AudioPlayer
    songs: Song[]
    volume: number
}

export const musicQueue = new Map<string, GuildQueue>()

export async function playSong(guild: Guild, song: Song) {
    const serverQueue = musicQueue.get(guild.id)

    if (!serverQueue) {
        return
    }

    if (!song) {
        serverQueue.connection.destroy()
        musicQueue.delete(guild.id)
        return
    }

    const stream = await play.stream(song.url)
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type
    })

    serverQueue.player.play(resource)
}