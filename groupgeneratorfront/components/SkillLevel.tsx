import { Rating, Stack, Typography } from "@mui/material"
import type { Skill } from "@/lib/types"

export default function SkillLevel({ skill }: { skill: Skill }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="body2" sx={{ minWidth: 0 }}>
        {skill.name}
      </Typography>
      <Rating value={skill.value} max={5} size="small" readOnly aria-label={`${skill.name} : ${skill.value} sur 5`} />
    </Stack>
  )
}
