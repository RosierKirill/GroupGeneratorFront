import { generateGroups, listGroups } from "@/lib/mock-db"
import { parseGroups } from "@/lib/validation"

export function GET() {
  return Response.json(listGroups())
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const input = parseGroups(body)
  if (!input) return Response.json({ error: "Body incomplet" }, { status: 400 })
  return Response.json(generateGroups(input), { status: 201 })
}
