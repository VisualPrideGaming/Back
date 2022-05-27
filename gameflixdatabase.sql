CREATE DATABASE IF NOT EXISTS Gameflix;

USE Gameflix;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nickname VARCHAR(30) NOT NULL, 
    rol VARCHAR(40) NOT NULL,
    image_user VARCHAR(200) 
);

CREATE TABLE IF NOT EXISTS platforms(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    genre VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS games(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    game_name VARCHAR(50) NOT NULL UNIQUE,
    release_date date,
    image_game VARCHAR(100),
    developer VARCHAR(80),
    rating INT
);

CREATE TABLE IF NOT EXISTS platform_games(
    idGame INT NOT NULL,
    idPlatform INT NOT NULL,

    CONSTRAINT FK_platformgames_platform
    FOREIGN KEY (idPlatform)
    REFERENCES platforms (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT FK_platformgames_game
    FOREIGN KEY (idGame)
    REFERENCES games (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    PRIMARY KEY (idGame , idPlatform)
);

CREATE TABLE IF NOT EXISTS genres_games(
    idGame INT NOT NULL,
    idGenre INT NOT NULL,

    CONSTRAINT FK_genresgames_genres
    FOREIGN KEY (idGenre)
    REFERENCES genres (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT FK_genresgames_game
    FOREIGN KEY (idGame)
    REFERENCES games (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    PRIMARY KEY (idGame , idGenre)
);



CREATE TABLE IF NOT EXISTS reviews(
    id_game INT NOT NULL,
    id_user INT NOT NULL,
    score INT NOT NULL,
    review VARCHAR(2000),

    CONSTRAINT FK_reviews_user
    FOREIGN KEY (id_user)
    REFERENCES users (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT FK_reviews_game
    FOREIGN KEY (id_game)
    REFERENCES games (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    PRIMARY KEY (id_game, id_user)

);

CREATE TABLE IF NOT EXISTS games_user(
    status_game VARCHAR(20) NOT NULL,
    id_game INT NOT NULL,
    id_user INT NOT NULL,
    
    CONSTRAINT FK_gameuser_game
    FOREIGN KEY (id_game)
    REFERENCES games (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    CONSTRAINT FK_gameuser_user
    FOREIGN KEY (id_user)
    REFERENCES users (id)
	ON UPDATE CASCADE
    ON DELETE CASCADE,

    PRIMARY KEY (status_game, id_game, id_user)

);


