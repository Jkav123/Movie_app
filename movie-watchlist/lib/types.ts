export interface User {
  id: number;
  email: string;
  name: string;
}

export interface OMDbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Response: string;
}

export interface OMDbSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface WatchlistEntry {
  id: number;
  user_id: number;
  imdb_id: string;
  title: string;
  poster_url: string | null;
  overview: string | null;
  release_year: string | null;
  rating: number | null;
  status: "want_to_watch" | "watching" | "watched";
  added_at: string;
  updated_at: string;
}

export interface UpdateWatchlistInput {
  rating?: number | null;
  status?: WatchlistEntry["status"];
}

export interface Comment {
  id: number;
  user_id: number;
  imdb_id: string;
  parent_id: number | null;
  body: string;
  created_at: string;
  author_name: string;
  replies?: Comment[];
}

export interface CreateCommentInput {
  imdb_id: string;
  body: string;
  parent_id?: number | null;
}
