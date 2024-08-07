import { User } from "lucia";
import crypto from "crypto";

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

export async function createTempPassword() {
  let tempPassword = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 15; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    tempPassword += characters.charAt(randomInd);
  }

  const hashedTempPassword = await sha256(tempPassword);

  return {tempPassword: tempPassword, hashedTempPassword: hashedTempPassword};
}

export function sha256(data: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

export function testPassword(password: string, confirmPassword: string) {
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  if (password !== confirmPassword) return { error: "Passwords do not match" };

  return { success: "Password is valid" };
}
