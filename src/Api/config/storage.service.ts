import { Preferences } from '@capacitor/preferences';
import type { AppStorageData, BubbleApi } from '../models/api.types.ts';
import { initialUser } from '../../shared/models/user.types.ts';
import { generateUUID } from '../../shared/utils/shared.utils.ts';

export class StorageService {
  private readonly _storageKey: string = 'puyo_game';
  private _isInitialized: boolean = false;

  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    const data = await this._getStorageData();

    if (!data || !data.game.isSeeded) {
      await this._seedDatabase();
      console.log('🌱 Base de données seedée avec succès');
    } else {
      console.log('✅ Base déjà seedée, skip');
    }

    this._isInitialized = true;
  }

  private async _getStorageData(): Promise<AppStorageData | null> {
    const { value } = await Preferences.get({ key: this._storageKey });
    return value ? JSON.parse(value) : null;
  }

  private async _saveStorageData(data: AppStorageData): Promise<void> {
    await Preferences.set({
      key: this._storageKey,
      value: JSON.stringify(data),
    });
  }

  private async _seedDatabase(): Promise<void> {
    const initialData: AppStorageData = {
      user: { ...initialUser },
      game: {
        isSeeded: true,
        score: 0,
        oxygenLevel: 100,
        inventory: [],
      },
      playerStats: {
        bestScore: 0,
        coins: 0,
      },
      bubbles: [],
    };

    await this._saveStorageData(initialData);
  }

  // ==========================================
  // SINGLETONS (User, Game, PlayerStats)
  // ==========================================

  async getSingleton<T extends 'user' | 'game' | 'playerStats'>(key: T): Promise<AppStorageData[T] | null> {
    const data = await this._getStorageData();
    return data ? data[key] : null;
  }

  async update<T extends 'user' | 'game' | 'playerStats'>(key: T, updates: Partial<AppStorageData[T]>): Promise<boolean> {
    const data = await this._getStorageData();
    if (!data) return false;

    data[key] = {
      ...data[key],
      ...updates,
    };

    await this._saveStorageData(data);
    return true;
  }

  // ==========================================
  // BUBBLES
  // ==========================================

  async getAllBubbles(): Promise<BubbleApi[]> {
    const data = await this._getStorageData();
    return data?.bubbles || [];
  }

  async addBubbles(newBubbles: BubbleApi[]): Promise<BubbleApi[]> {
    const data = await this._getStorageData();
    if (!data) return [];

    const bubblesWithIds = newBubbles.map(bubble => ({
      ...bubble,
      id: bubble.id || generateUUID(),
    })) as BubbleApi[];

    data.bubbles = [...data.bubbles, ...bubblesWithIds];
    await this._saveStorageData(data);

    return bubblesWithIds;
  }

  async insert(tableName: string, dataObj: any): Promise<void> {
    // for retro-compatibility with some repositories during initialization
    if (tableName === 'bubble') {
      await this.addBubbles(Array.isArray(dataObj) ? dataObj : [dataObj]);
    } else if (tableName === 'game') {
      await this.update('game', dataObj);
    }
  }

  async truncate(tableName: string): Promise<void> {
    if (tableName === 'bubble') {
      await this.clearBubbles();
    } else if (tableName === 'game') {
      await this.update('game', {
        score: 0,
        oxygenLevel: 100,
        inventory: [],
      });
    }
  }

  async updateBubbleById(id: string, updates: Partial<BubbleApi>): Promise<boolean> {
    const data = await this._getStorageData();
    if (!data) return false;

    const bubbleIndex = data.bubbles.findIndex(b => b.id === id);
    if (bubbleIndex === -1) return false;

    data.bubbles[bubbleIndex] = {
      ...data.bubbles[bubbleIndex],
      ...updates,
    };

    await this._saveStorageData(data);
    return true;
  }

  async updateBubblesWhere(filter: Partial<BubbleApi>, updates: Partial<BubbleApi>): Promise<BubbleApi[]> {
    const data = await this._getStorageData();
    if (!data) return [];

    const updatedBubbles: BubbleApi[] = [];
    data.bubbles = data.bubbles.map(bubble => {
      const matches = Object.entries(filter).every(([k, v]) => (bubble as any)[k] === v);
      if (matches) {
        const updated = { ...bubble, ...updates };
        updatedBubbles.push(updated);
        return updated;
      }
      return bubble;
    });

    await this._saveStorageData(data);
    return updatedBubbles;
  }

  async deleteBubbleById(id: string | string[]): Promise<boolean> {
    const data = await this._getStorageData();
    if (!data) return false;

    const idsToDelete = Array.isArray(id) ? id : [id];
    const originalLength = data.bubbles.length;

    data.bubbles = data.bubbles.filter(bubble => !idsToDelete.includes(bubble.id));

    if (data.bubbles.length < originalLength) {
      await this._saveStorageData(data);
      return true;
    }

    return false;
  }

  async clearBubbles(): Promise<void> {
    const data = await this._getStorageData();
    if (!data) return;

    data.bubbles = [];
    await this._saveStorageData(data);
  }

  // ==========================================
  // UTILITAIRES
  // ==========================================

  async clear(): Promise<void> {
    await Preferences.remove({ key: this._storageKey });
    this._isInitialized = false;
  }

  async resetDatabase(): Promise<void> {
    await this.clear();
    await this.initialize();
  }
}

export const storageService = new StorageService();
