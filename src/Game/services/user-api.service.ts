import type { LangCode } from '../../Authentication/models/user.types.ts';
import { http } from '../../shared/services/http-client.ts';

export function updateSettingsApi(setting: string, value: boolean | LangCode): Promise<void> {
  return http<void>(`/user/settings/${setting}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: value,
    auth: true,
  });
}

export function getAvailableAvatarsApi(): Promise<string[]> {
  return http<string[]>('/user/avatar', {
    method: 'GET',
    auth: true,
  });
}

export function getAvailableAstronautsApi(): Promise<string[]> {
  return http<string[]>('/user/astronaut', {
    method: 'GET',
    auth: true,
  });
}

export async function updateAvatarApi(avatar: string): Promise<void> {
  await http<void>('/user/avatar', {
    method: 'POST',
    body: avatar,
    auth: true,
  });
}

export async function updateAstronautApi(astronaut: string): Promise<void> {
  await http<void>('/user/astronaut', {
    method: 'POST',
    body: astronaut,
    auth: true,
  });
}

export async function updatePlayerNameApi(playerName: string): Promise<void> {
  await http<void>('/user/playerName', {
    method: 'POST',
    body: playerName,
    auth: true,
  });
}
