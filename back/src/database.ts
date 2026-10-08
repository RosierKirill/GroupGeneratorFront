import { Database } from 'bun:sqlite'

export const database = new Database(`${import.meta.dir}/../data.sqlite`)

database.run('PRAGMA foreign_keys = ON')

database.run(`
  CREATE TABLE IF NOT EXISTS "User" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    "group" INTEGER
  )
`)

database.run(`
  CREATE TABLE IF NOT EXISTS Skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value INTEGER NOT NULL CHECK (typeof(value) = 'integer' AND value BETWEEN 1 AND 5)
  )
`)

database.run(`
  CREATE TABLE IF NOT EXISTS Userskills (
    userId INTEGER NOT NULL,
    skillId INTEGER NOT NULL,
    PRIMARY KEY (userId, skillId),
    FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (skillId) REFERENCES Skills(id) ON DELETE CASCADE
  )
`)
