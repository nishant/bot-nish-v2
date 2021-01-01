export interface JikanAnimeSearchResult {
  // eslint-disable-next-line camelcase
  mal_id: number;
  url: string;
  // eslint-disable-next-line camelcase
  image_url: string;
  title: string;
  airing: boolean;
  synopsis: string;
  type: string;
  episodes: number;
  score: number;
  // eslint-disable-next-line camelcase
  start_date: string;
  // eslint-disable-next-line camelcase
  end_date: string;
  members: number;
  rated: string;
}

/* eslint-disable camelcase */
export interface JikanAnimeStats {
  days_watched: number;
  mean_score: number;
  watching: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_watch: number;
  total_entries: number;
  rewatched: number;
  episodes_watched: number;
}

/* eslint-disable camelcase */
export interface JikanMangaStats {
  days_read: number;
  mean_score: number;
  reading: number;
  completed: number;
  on_hold: number;
  dropped: number;
  plan_to_read: number;
  total_entries: number;
  reread: number;
  chapters_read: number;
  volumes_read: number;
}

export interface JikanAnimeSearchResponse {
  // eslint-disable-next-line camelcase
  last_page: number;
  results: JikanAnimeSearchResult[];
}

export interface JikanUserSearchResponse {
  user_id: number;
  username: string;
  url: string;
  image_url: string;
  last_online: string;
  anime_stats: JikanAnimeStats;
  manga_stats: JikanMangaStats;
}
