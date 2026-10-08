"use client"

import { useState } from "react"
import { Alert, Box, Button, Card, CardContent, CardHeader, Rating, Stack, TextField, Typography } from "@mui/material"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import { SKILLS } from "@/lib/skills"
import type { CreateUserInput } from "@/lib/types"

interface Props {
  onSubmit: (input: CreateUserInput) => Promise<void>
}

const emptyLevels = () => Object.fromEntries(SKILLS.map((skill) => [skill.id, 0]))

export default function AddUserForm({ onSubmit }: Props) {
  const [name, setName] = useState("")
  const [levels, setLevels] = useState<Record<number, number>>(emptyLevels)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        skills: SKILLS.map((skill) => ({ skillId: skill.id, value: levels[skill.id] })),
      })
      setName("")
      setLevels(emptyLevels())
    } catch {
      setError("Impossible d'ajouter cette personne.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card variant="outlined">
      <CardHeader title="Ajouter un élève" />
      <CardContent sx={{ pt: 0 }}>
        <Stack component="form" spacing={2} onSubmit={submit}>
          <TextField label="Nom" size="small" fullWidth value={name} onChange={(event) => setName(event.target.value)} />
          {SKILLS.map((skill) => (
            <Box key={skill.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography variant="body2" id={`skill-${skill.id}`}>
                {skill.name}
              </Typography>
              <Rating
                name={`skill-${skill.id}`}
                value={levels[skill.id]}
                onChange={(_, value) => setLevels((current) => ({ ...current, [skill.id]: value ?? 0 }))}
              />
            </Box>
          ))}
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" startIcon={<PersonAddIcon />} disabled={busy || !name.trim()}>
            Ajouter
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
