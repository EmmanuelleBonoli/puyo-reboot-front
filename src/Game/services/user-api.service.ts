import type { LangCode } from '../../shared/models/user.types.ts';
import { userServerService } from '../../Api/services/user.server.service.ts';

export async function updateSettingsApi(setting: string, value: boolean | LangCode): Promise<void> {
  await userServerService.updateSettings(setting, value);
}

export async function updateAvatarApi(avatar: string): Promise<void> {
  await userServerService.updateAvatar(avatar);
}

export async function updateAstronautApi(astronaut: string): Promise<void> {
  await userServerService.updateAstronaut(astronaut);
}

export async function updatePlayerNameApi(playerName: string): Promise<void> {
  await userServerService.updatePlayerName(playerName);
}
