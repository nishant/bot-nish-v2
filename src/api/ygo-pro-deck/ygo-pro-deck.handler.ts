import axios from 'axios';
import { logger } from '../../utilities/logger';
import { YgoProDeckResponse } from './ygo-pro-deck.response';

const searchEndpoint = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';
const imageEndpoint = 'https://storage.googleapis.com/ygoprodeck.com/pics';
const smallImageEndpoint =
  'https://storage.googleapis.com/ygoprodeck.com/pics_small/';

const searchClient = axios.create({
  baseURL: searchEndpoint,
});

const imageClient = axios.create({
  baseURL: imageEndpoint,
});

const smallImageClient = axios.create({
  baseURL: smallImageEndpoint,
});

export const search = async (
  fuzzyName: string,
): Promise<YgoProDeckResponse> => {
  try {
    const { data: body } = await searchClient.get('', {
      params: { fname: fuzzyName },
    });
    logger.info(
      'YGOProDeck API Search',
      `query: ${fuzzyName}`,
      `response: ${body}`,
    );
    return body;
  } catch (e) {
    logger.info('YGOProDeck API Search Error!!!', `${e.message}`);
    throw new Error('YGOProDeck API Search Error');
  }
};

export const getCardImage = async (id: number): Promise<Blob> => {
  try {
    const { data: body } = await imageClient.get(`/${id}`);
    logger.info('YGOProDeck Image Search', `query: ${id}`, `response: ${body}`);
    return body;
  } catch (e) {
    logger.info('YGOProDeck Image Search Error!!!', `${e.message}`);
    throw new Error('YGOProDeck Image Search Error');
  }
};

export const getCardImageSmall = async (id: number): Promise<Blob> => {
  try {
    const { data: body } = await smallImageClient.get(`/${id}`);
    logger.info('YGOProDeck Image Search', `query: ${id}`, `response: ${body}`);
    return body;
  } catch (e) {
    logger.info('YGOProDeck Image Search Error!!!', `${e.message}`);
    throw new Error('YGOProDeck Image Search Error');
  }
};
