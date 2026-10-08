import { Rating, Stack, Typography } from "@mui/material"
import type { Skill } from "@/lib/types"

const LEVEL_COLORS = ["#e5645a", "#f2994a", "#f2c94c", "#8bc34a", "#3fb68b"]

export default function SkillLevel({ skill }: { skill: Skill }) {
  const color = LEVEL_COLORS[Math.min(Math.max(skill.value, 1), 5) - 1]

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between" }}>
      <Typography variant="body2" sx={{ minWidth: 0 }}>
        {skill.name}
      </Typography>
      <Rating
        value={skill.value}
        max={5}
        size="small"
        readOnly
        aria-label={`${skill.name} : ${skill.value} sur 5`}
        sx={{ "& .MuiRating-iconFilled": { color }, "& .MuiRating-iconEmpty": { color: "divider" } }}
      />
    </Stack>
  )
}
