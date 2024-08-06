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

export function removeMilliseconds(date: Date) {
  var newDate = date.toLocaleString();

  newDate = newDate.slice(0, -6) + newDate.slice(-3);

  return newDate;
}
