const GROUP_COLORS = ["#8f86ff", "#ff9a7d", "#4fc3a1", "#f2b84b", "#5aa9e6", "#e57aa9"]

export const groupColor = (groupId: number) => GROUP_COLORS[(groupId - 1) % GROUP_COLORS.length]
