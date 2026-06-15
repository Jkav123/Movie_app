CREATE DATABASE IF NOT EXISTS movie_watchlist;
USE movie_watchlist;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(200) NOT NULL UNIQUE,
  password_hash TEXT         NOT NULL,
  name          VARCHAR(100) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  imdb_id      VARCHAR(20)  NOT NULL,
  title        VARCHAR(200) NOT NULL,
  poster_url   VARCHAR(500),
  overview     TEXT,
  release_year CHAR(4),
  rating       TINYINT      CHECK (rating BETWEEN 1 AND 5),
  note         TEXT,
  status       ENUM('want_to_watch','watching','watched') NOT NULL DEFAULT 'want_to_watch',
  added_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_movie (user_id, imdb_id)
);