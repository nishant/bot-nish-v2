export interface YoutubeResponseSearchItem {
  id: {
    videoId: string;
  };
}

export interface YoutubeResponse {
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeResponseSearchItem[];
}
