import { Client, Interaction } from "discord.js"
import { tryCatch } from "typecatch"

export class Command {
    public name: string
    public execute: (interaction: Interaction) => Promise<void>
    constructor(name: string, fn: (interaction: Interaction) => Promise<void> ) {
        this.name = name
        this.execute = fn
    }
}

export class CommandManager {
    private client: Client
    private commands: Map<string, Command>
    
    constructor(client: Client, commands: Command[]) {
        this.client = client
        this.commands = new Map<string, Command>()
        for (const command of commands) {
            this.commands.set(command.name, command)
        }
        this.registerEvents()
    }

    private async registerEvents() {
        this.client.on("interactionCreate", async (interaction: Interaction) => {
            if (!interaction.isCommand()) { return }

            const command = this.commands.get(interaction.commandName)

            if (!command) { return }

            const { error } = await tryCatch(command.execute(interaction))
            if (error) {
                console.error(`Failed to run command ${error}`)
                await interaction.reply({ content: "There was an error while executing this command!", flags: "Ephemeral" })
            }
        })
    }
}