import { Box, LinearProgress, Stack, Typography } from "@mui/material"
import type { Skill } from "@/lib/types"

export default function SkillLevel({ skill }: { skill: Skill }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary" noWrap sx={{ width: 110, flexShrink: 0 }}>
        {skill.name}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(skill.value / 5) * 100}
        aria-label={`${skill.name} : ${skill.value} sur 5`}
        sx={{ flex: 1, height: 6, borderRadius: 999 }}
      />
      <Box component="span" sx={{ fontFamily: "var(--font-mono)", fontSize: 12, width: 24, textAlign: "right" }}>
        {skill.value}/5
      </Box>
    </Stack>
  )
}
