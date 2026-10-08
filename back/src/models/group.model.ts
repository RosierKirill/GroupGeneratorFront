import { database } from "../database";
import type { Group } from "../entities";
import { UserModel } from "./user.model";

export const GroupModel = {
  findAll: async (): Promise<Group[]> => {
    const users = await UserModel.findAll();
    const groups = new Map<number, Group>();

    for (const user of users) {
      if (user.group === null) continue;

      let group = groups.get(user.group);
      if (!group) {
        group = { id: user.group, users: [] };
        groups.set(user.group, group);
      }
      group.users.push(user);
    }

    return [...groups.values()].sort((a, b) => a.id - b.id);
  },

  generate: async (nbGroup: number, nbUser?: number): Promise<Group[]> => {
    const users = await UserModel.findAll();
    const rankedUsers = users
      .map((user) => ({
        user,
        score: user.skills.reduce((total, skill) => total + skill.value, 0),
      }))
      .sort((a, b) => b.score - a.score);
    const groups: Group[] = Array.from({ length: nbGroup }, (_, index) => ({
      id: index + 1,
      users: [],
    }));

    for (const { user } of rankedUsers) {
      const candidates = groups.filter(
        (group) => nbUser === undefined || group.users.length < nbUser,
      );
      if (candidates.length === 0) break;

      const target = candidates.reduce((smallest, group) =>
        group.users.length < smallest.users.length ? group : smallest,
      );
      target.users.push({ ...user, group: target.id });
    }

    const updateUserGroup = database.query(
      'UPDATE "User" SET "group" = ? WHERE id = ?',
    );
    const updateGroups = database.transaction(() => {
      database.run('UPDATE "User" SET "group" = NULL');
      for (const group of groups) {
        for (const user of group.users) {
          updateUserGroup.run(group.id, user.id);
        }
      }
    });
    updateGroups();

    return groups;
  },
};
