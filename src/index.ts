import Bot from "./bot"
import { loadConfig } from "./utils/config"
import { playCommand } from "./commands/music/play"
import { pauseCommand } from "./commands/music/pause"
import { resumeCommand } from "./commands/music/resume"
import { skipCommand } from "./commands/music/skip"
import { leaveCommand } from "./commands/music/leave"

const config = loadConfig()
const bot = new Bot(config)

bot.init([ playCommand, pauseCommand, resumeCommand, skipCommand, leaveCommand ])