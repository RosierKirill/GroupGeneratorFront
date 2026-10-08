"use client"

import { useCallback, useEffect, useState } from "react"
import { Alert, AppBar, Box, Container, Stack, Toolbar, Typography } from "@mui/material"
import AddUserForm from "@/components/AddUserForm"
import GroupList from "@/components/GroupList"
import UserList from "@/components/UserList"
import { createGroups, createUser, getGroups, getSkills, getUsers } from "@/lib/api"
import type { Group, Skill, User } from "@/lib/types"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [loadError, setLoadError] = useState(false)

  const refresh = useCallback(
    () =>
      Promise.all([getUsers(), getGroups(), getSkills()])
        .then(([nextUsers, nextGroups, nextSkills]) => {
          setSkills(nextSkills)
          setUsers(nextUsers)
          setGroups(nextGroups)
          setLoadError(false)
        })
        .catch(() => setLoadError(true)),
    [],
  )

  useEffect(() => {
    void refresh()
  }, [refresh])

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Toolbar>
          <Typography variant="h6" component="h1">
            Group Generator
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {loadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Impossible de charger les données.
          </Alert>
        )}
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 2fr)" }, alignItems: "start" }}>
          <Stack spacing={3}>
            <AddUserForm
              skills={skills}
              onSubmit={async (input) => {
                await createUser(input)
                await refresh()
              }}
            />
            <UserList users={users} />
          </Stack>
          <GroupList
            groups={groups}
            onGenerate={async (input) => {
              await createGroups(input)
              await refresh()
            }}
          />
        </Box>
      </Container>
    </>
  )
}
