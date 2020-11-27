import Discord, { Message } from 'discord.js';
import { BotConfig, config } from './config';
import { CommandHandler } from './utilities/command-handler';
import { logger } from './utilities/logger';

/** Pre-startup validation of the bot config. */
const validateConfig = (botConfig: BotConfig) => {
  if (!botConfig.token) throw new Error('no discord bot token provided!');
};

validateConfig(config);

export const client = new Discord.Client();
const commandHandler = new CommandHandler(config.prefix);

client.on('ready', () => {
  logger.info('bot started!');
});

client.on('message', (message: Message) => {
  commandHandler.handleMessage(message);
});

client.on('error', (e) => {
  logger.error('discord client error!', e);
});

client.login(config.token);
