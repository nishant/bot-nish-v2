import 'reflect-metadata';
import { Container } from 'inversify';
import { Client } from 'discord.js';
import { TYPES } from 'src/types';
import { Bot } from 'src/bot';

export const container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);

export default container;
