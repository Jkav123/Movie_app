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
