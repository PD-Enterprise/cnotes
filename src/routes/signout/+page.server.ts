import { signOut } from "../../lib/utils/auth"
import type { Actions } from "./$types"

export const actions: Actions = { default: signOut }