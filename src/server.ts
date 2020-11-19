import Discord, { Message } from 'discord.js';
import { CommandHandler } from './command-handler';
import { BotConfig, config } from './config/config';
import { logger } from './logger';

/** Pre-startup validation of the bot config. */
const validateConfig = (botConfig: BotConfig) => {
  if (!botConfig.token) throw new Error('no discord bot token provided!');
};

validateConfig(config);

const client = new Discord.Client();
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
