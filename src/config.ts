import 'dotenv/config';

/* secrets */
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '<NO TOKEN>';
export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY ?? '<NO KEY>';

/* non-secrets */
export const SANTA_ROLE_ID = '778849334182936596';

/**
 * Discord bot config.
 *
 * Revisions to this file should not be committed.
 */
export type BotConfig = {
  /** the Discord bot token. */
  token: string;
  /** Prefix used for bot commands. */
  prefix: string;
  /** The name of the role that gives ultimate power over the bot. */
  botOwnerRoleName: string;
  /** The bot will add reactions to the command messages indicating success or failure. */
  enableReactions: boolean;
};

export const config: BotConfig = {
  token: `${DISCORD_TOKEN}`,
  prefix: '%', // Command prefix. ex: !help
  botOwnerRoleName: 'admin',
  enableReactions: true,
};
