import { User } from "lucia";

export function userIsAdmin(user: User | null) {
  if (user === null) return false;
  if (
    user.username === "Admin" ||
    user.username === "Robin" ||
    user.username === "admin"
  )
    return true;

  return false;
}
