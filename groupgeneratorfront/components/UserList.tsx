import { Avatar, Box, Card, CardContent, CardHeader, Chip, Stack, Typography } from "@mui/material"
import { groupColor } from "@/lib/group-colors"
import type { User } from "@/lib/types"
import SkillLevel from "./SkillLevel"

export default function UserList({ users }: { users: User[] }) {
  return (
    <Card variant="outlined">
      <CardHeader title="Élèves" subheader={`${users.length} personne${users.length > 1 ? "s" : ""}`} />
      <CardContent sx={{ pt: 0 }}>
        {users.length === 0 ? (
          <Typography color="text.secondary">Personne pour l&apos;instant. Ajoute le premier élève.</Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {users.map((user) => (
              <Card
                key={user.id}
                variant="outlined"
                sx={{ transition: "box-shadow 150ms ease-out", "&:hover": { boxShadow: 3 } }}
              >
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: "primary.main" }}>{user.name.charAt(0).toUpperCase()}</Avatar>}
                  title={user.name}
                  slotProps={{ title: { variant: "subtitle1", fontWeight: 600, noWrap: true } }}
                  action={
                    user.group !== null ? (
                      <Chip size="small" label={`Groupe ${user.group}`} sx={{ bgcolor: groupColor(user.group), color: "#1b1b1f" }} />
                    ) : null
                  }
                />
                {user.skills.length > 0 && (
                  <CardContent sx={{ pt: 0, "&:last-child": { pb: 2 } }}>
                    <Stack spacing={0.75}>
                      {user.skills.map((skill) => (
                        <SkillLevel key={skill.skillId} skill={skill} />
                      ))}
                    </Stack>
                  </CardContent>
                )}
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
