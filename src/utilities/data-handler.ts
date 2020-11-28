import {
  Collection,
  DMChannel,
  Guild,
  GuildMember,
  NewsChannel,
  Snowflake,
  TextChannel,
} from 'discord.js';
import { client } from '../server';
import { logger } from './logger';

export class DataHandler {
  private static guild: Guild;

  private static users: Collection<Snowflake, GuildMember>;

  private static usernames: Array<string>;

  private static roles: Array<string>;

  constructor() {
    DataHandler.fetchData().then((r) =>
      logger.info('Successfully fetched data.'),
    );
  }

  public static async fetchData(): Promise<void> {
    await client.guilds.fetch('403400771787423755').then((guild) => {
      this.guild = guild;
      this.users = guild.members.cache;
      this.usernames = guild.members.cache.map((member) => member.displayName);
      this.roles = guild.roles.cache.map((role) => role.name);
    });
  }

  public static async getAllUsernames(): Promise<Array<string>> {
    return this.usernames;
  }

  public static async getAllUsersByRole(
    roleId: string,
  ): Promise<Array<string>> {
    const usersWithRole: Array<string> = [];

    this.users.map((member) => {
      const role = member.roles.cache.get(roleId);
      if (role !== undefined && !member.user.bot) {
        usersWithRole.push(member.id);
      }
      return usersWithRole;
    });

    return usersWithRole;
  }

  public static async sendMessageToUser(
    userId: string,
    messageContent: string,
  ): Promise<void> {
    const user = this.users.get(userId)!;
    if (user !== undefined) {
      // await user.send(`Your secret santa assignment is ${messageContent}`);
      logger.info(
        'MOCK MSG!!',
        userId,
        this.getUsernameById(userId),
        messageContent,
      );
    }
  }

  public static async sendMessageToChannel(
    channel: TextChannel | DMChannel | NewsChannel,
    messageContent: string,
  ): Promise<void> {
    await channel.send(messageContent);
  }

  public static async getUsernameById(userId: string) {
    const user = this.users.get(userId)!;
    if (user !== undefined) return user.displayName;
    return 'USER NOT FOUND!!';
  }

  public static async userHasRole(
    member: GuildMember,
    roleName: string,
  ): Promise<boolean> {
    return !!member?.roles.cache.find((role) => role.name === roleName);
  }
}
