import { database } from './database'

const users = [
  { id: 1001, name: 'Jon Snow', group: 1 },
  { id: 1002, name: 'Arya Stark', group: 1 },
  { id: 1003, name: 'Daenerys Targaryen', group: 2 },
  { id: 1004, name: 'Tyrion Lannister', group: 3 },
  { id: 1005, name: 'Jaime Lannister', group: 3 },
  { id: 1006, name: 'Brienne of Tarth', group: null },
]

const skills = [
  { id: 2001, name: 'Combat', value: 5 },
  { id: 2002, name: 'Strategy', value: 4 },
  { id: 2003, name: 'Leadership', value: 3 },
  { id: 2004, name: 'Diplomacy', value: 2 },
  { id: 2005, name: 'Stealth', value: 1 },
]

const userSkills = [
  [1001, 2001],
  [1001, 2002],
  [1001, 2003],
  [1002, 2001],
  [1002, 2005],
  [1003, 2002],
  [1003, 2003],
  [1003, 2004],
  [1004, 2002],
  [1004, 2004],
  [1005, 2001],
  [1005, 2003],
  [1006, 2001],
  [1006, 2004],
]

const seed = database.transaction(() => {
  const insertUser = database.query(`
    INSERT INTO "User" (id, name, "group")
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name, "group" = excluded."group"
  `)
  for (const user of users) {
    insertUser.run(user.id, user.name, user.group)
  }

  const insertSkill = database.query(`
    INSERT INTO Skills (id, name, value)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name = excluded.name, value = excluded.value
  `)
  for (const skill of skills) {
    insertSkill.run(skill.id, skill.name, skill.value)
  }

  const insertUserSkill = database.query(`
    INSERT OR IGNORE INTO Userskills (userId, skillId)
    VALUES (?, ?)
  `)
  for (const [userId, skillId] of userSkills) {
    insertUserSkill.run(userId, skillId)
  }
})

try {
  seed()
  console.log(`Fixtures loaded: ${users.length} users, ${skills.length} skills, ${userSkills.length} user-skill links.`)
} finally {
  database.close()
}
