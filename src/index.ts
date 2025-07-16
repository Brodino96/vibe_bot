import Bot from "./bot"
import { playCommand } from "./commands/music/play"
import { pauseCommand } from "./commands/music/pause"
import { resumeCommand } from "./commands/music/resume"
import { skipCommand } from "./commands/music/skip"
import { leaveCommand } from "./commands/music/leave"

const bot = new Bot()

export const commands = [ playCommand, pauseCommand, resumeCommand, skipCommand, leaveCommand ]
bot.init(commands)