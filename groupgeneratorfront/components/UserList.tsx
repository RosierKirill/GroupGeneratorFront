import { Avatar, Card, CardContent, CardHeader, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { groupColor } from "@/lib/group-colors"
import type { User } from "@/lib/types"

export default function UserList({ users }: { users: User[] }) {
  return (
    <Card variant="outlined">
      <CardHeader title="Élèves" subheader={`${users.length} personne${users.length > 1 ? "s" : ""}`} />
      <CardContent sx={{ pt: 0 }}>
        {users.length === 0 ? (
          <Typography color="text.secondary">Personne pour l&apos;instant. Ajoute le premier élève.</Typography>
        ) : (
          <List disablePadding>
            {users.map((user) => (
              <ListItem
                key={user.id}
                disableGutters
                secondaryAction={
                  user.group !== null ? (
                    <Chip size="small" label={`Groupe ${user.group}`} sx={{ bgcolor: groupColor(user.group), color: "#1b1b1f" }} />
                  ) : null
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "primary.main" }}>{user.name.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} slotProps={{ primary: { noWrap: true } }} sx={{ pr: 10 }} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
