import { Client } from "discord.js"
import { config } from "./utils/config"
import { tryCatch } from "typecatch"
import { Command, CommandManager } from "./commands/commands"

export default class Bot {
    public client: Client

    constructor() {
        this.client = new Client({
            intents: [ "Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent" ]
        })
    }

    public async init(commands: Command[]): Promise<void> {
        const { error: loginError } = await tryCatch(this.client.login(config.token))
        if (loginError) {
            console.error(`Failed to login: ${loginError}`)
            return process.exit(0)
        }

        console.info(`Bot ready! Logged in as ${this.client.user?.tag}`)

        new CommandManager(this.client, commands)
    }
}