"use client"

import { useState } from "react"
import { Alert, Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Stack, TextField, Typography } from "@mui/material"
import ShuffleIcon from "@mui/icons-material/Shuffle"
import { groupColor } from "@/lib/group-colors"
import type { CreateGroupsInput, Group } from "@/lib/types"
import SkillLevel from "./SkillLevel"

interface Props {
  groups: Group[]
  onGenerate: (input: CreateGroupsInput) => Promise<void>
}

export default function GroupList({ groups, onGenerate }: Props) {
  const [nbGroup, setNbGroup] = useState("2")
  const [nbUser, setNbUser] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onGenerate({ nb_group: Number(nbGroup), ...(nbUser ? { nb_user: Number(nbUser) } : {}) })
    } catch {
      setError("Impossible de générer les groupes.")
    } finally {
      setBusy(false)
    }
  }

  const invalid = !Number.isInteger(Number(nbGroup)) || Number(nbGroup) < 1

  return (
    <Card variant="outlined">
      <CardHeader title="Groupes" />
      <CardContent sx={{ pt: 0 }}>
        <Stack component="form" direction={{ xs: "column", sm: "row" }} spacing={1} onSubmit={generate}>
          <TextField
            label="Nombre de groupes"
            type="number"
            size="small"
            value={nbGroup}
            onChange={(event) => setNbGroup(event.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Max par groupe (optionnel)"
            type="number"
            size="small"
            value={nbUser}
            onChange={(event) => setNbUser(event.target.value)}
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <Button type="submit" variant="contained" startIcon={<ShuffleIcon />} disabled={busy || invalid}>
            Générer
          </Button>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {groups.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Pas encore de groupes. Lance la génération.
          </Typography>
        ) : (
          <Box sx={{ mt: 2, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(auto-fill, minmax(260px, 1fr))" } }}>
            {groups.map((group) => {
              const color = groupColor(group.id)
              return (
                <Card
                  key={group.id}
                  variant="outlined"
                  sx={{ borderTop: 4, borderTopColor: color, transition: "box-shadow 150ms ease-out", "&:hover": { boxShadow: 3 } }}
                >
                  <CardHeader
                    title={`Groupe ${group.id}`}
                    subheader={`${group.users.length} membre${group.users.length > 1 ? "s" : ""}`}
                    slotProps={{ title: { variant: "subtitle1", fontWeight: 600 } }}
                  />
                  <CardContent sx={{ pt: 0, "&:last-child": { pb: 2 } }}>
                    <Stack spacing={2} divider={<Divider flexItem />}>
                      {group.users.map((member) => (
                        <Box key={member.id}>
                          <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: "center" }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 13, bgcolor: color, color: "#1b1b1f" }}>
                              {member.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                              {member.name}
                            </Typography>
                          </Stack>
                          <Stack spacing={0.75}>
                            {member.skills.map((skill) => (
                              <SkillLevel key={skill.skillId} skill={skill} />
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
