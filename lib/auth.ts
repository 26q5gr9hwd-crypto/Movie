const USERS_KEY = 'danflix_users';
const SESSION_KEY = 'danflix_session';

async function hashPassword(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function register(username: string, password: string): Promise<boolean> {
  const users = getUsers();
  if (users[username]) return false;
  users[username] = await hashPassword(password);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, username);
  return true;
}

export async function login(username: string, password: string): Promise<boolean> {
  const users = getUsers();
  if (users[username] !== await hashPassword(password)) return false;
  localStorage.setItem(SESSION_KEY, username);
  return true;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}
