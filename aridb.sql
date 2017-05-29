CREATE TABLE members (
    id BIGINT(20) NOT NULL,
    username VARCHAR(30),
    discriminator INT (4),
    server VARCHAR(20) DEFAULT '' NOT NULL,
    moonlight INT(10) DEFAULT 0 NOT NULL,
    CONSTRAINT `PRIMARY` PRIMARY KEY (id, server)
);

CREATE TABLE uinfo (
    id BIGINT(20) NOT NULL,
    username VARCHAR(30),
    discriminator INT(4),
    server VARCHAR(20) DEFAULT '' NOT NULL,
    lastfm VARCHAR(20),
    song VARCHAR(30),
    CONSTRAINT `PRIMARY` PRIMARY KEY (id, server)
);
