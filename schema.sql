PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Scores (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL,
    ScoreValue INTEGER NOT NULL,
    TotalPoints INTEGER NOT NULL,
    Timestamp DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS Questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    option1 TEXT NOT NULL,
    option2 TEXT NOT NULL,
    option3 TEXT NOT NULL,
    answer TEXT NOT NULL,
    points INT NOT NULL,
    image TEXT NOT NULL
);