export interface cardImage {
  id: number;
  // eslint-disable-next-line camelcase
  image_url: string;
  // eslint-disable-next-line camelcase
  image_url_small: string;
}
export interface YGOCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  race: string;
  archetype?: string;
  // eslint-disable-next-line camelcase
  card_images: cardImage[];
}

export interface MonsterCard extends YGOCard {
  atk: number;
  def?: number;
  level?: number;
  attribute: string;
  scale?: number;
  linkval?: number;
  linkmarkers?: string[];
}

export interface SpellCard extends YGOCard {}
export interface TrapCard extends YGOCard {}

export interface YgoProDeckResponse {
  data: Array<MonsterCard | SpellCard | TrapCard>;
}
