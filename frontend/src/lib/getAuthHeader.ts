import { createClient } from "./supabase";

export async function getAuthHeader() {
    const supabase = createClient()
    const {
        data: { session },
    } = await supabase.auth.getSession()

    // if (!session) throw new Error('No session')

    return {
        // Authorization: `Bearer ${session.access_token}`,
        Authorization: `Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjVjYzQ2MWMzLTBlMzctNGU0My05ODE4LTA5NGNiZTBlNDkwZSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1a3NqcmdrcXB4eHVjd2t6em5lLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5ZmMyYWRiMS02MTg5LTQ2ZjYtYjg0ZS04MDM3ZGEyYTVjNzIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc1MzA2OTMyLCJpYXQiOjE3NzUzMDMzMzIsImVtYWlsIjoicGhlYmVkaXp6eTM4NkBwcm9tYWlsLmluayIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJwaGViZWRpenp5Mzg2QHByb21haWwuaW5rIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiOWZjMmFkYjEtNjE4OS00NmY2LWI4NGUtODAzN2RhMmE1YzcyIiwidXNlcm5hbWUiOiJkaXp6eSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzc1MzAzMzMyfV0sInNlc3Npb25faWQiOiIyYWU2OWJhNi1mYjMzLTRiMTMtOTkwNi01MmNjNjExM2RjZmEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.oCILEe9PYKtqpRy8U6_v6TLeaUnLfz-tHsXH8yDGEuHrzuqULRZBQLIBKjGMZw8g9og6xPbdUhxENMXgPDys5g`,
    }
}