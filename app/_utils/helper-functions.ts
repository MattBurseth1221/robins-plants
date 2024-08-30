import { User } from "lucia";
import { createHash } from "crypto";

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

export function formatDate(date: Date) {
  let newDate = date.toLocaleString();

  //Remove milliseconds from date string
  newDate = newDate.slice(0, -6) + newDate.slice(-3);

  //Check and remove date if comment was made today
  if (date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
    let newDateArr = newDate.split(' ');
    newDate = newDateArr[1] + " " +  newDateArr[2];
  }

  return newDate;
}

export async function createTempPassword() {
  let tempPassword = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 15; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    tempPassword += characters.charAt(randomInd);
  }

  const hashedTempPassword = generateRandomIdFromString(tempPassword);

  console.log("password info: ");
  console.log(tempPassword);
  console.log(hashedTempPassword);

  return {tempPassword: tempPassword, hashedTempPassword: hashedTempPassword};
}

export function generateRandomIdFromString(data: string): string {
  let seed = 0;
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < data.length; i++) {
        ch = data.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString();
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

export function generateSHA256(data: string): string {
  const hash = createHash('sha256');
  return hash.update(data).digest('hex') as string;
}