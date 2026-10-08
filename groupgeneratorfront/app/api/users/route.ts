import { createUsers, listUsers } from "@/lib/mock-db"
import { parseUsers } from "@/lib/validation"

export function GET() {
  return Response.json(listUsers())
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const inputs = parseUsers(body)
  if (!inputs) return Response.json({ error: "Body incomplet/incorrect" }, { status: 400 })
  return Response.json(createUsers(inputs), { status: 201 })
}
