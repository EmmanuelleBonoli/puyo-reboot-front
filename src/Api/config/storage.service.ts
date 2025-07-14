import { Preferences } from '@capacitor/preferences';
import type { DatabaseSchema } from '../models/api.types';
import { generateUUID } from '../../shared/utils/shared.utils.ts';

export class StorageService {
  private readonly _dbPrefix: string;
  private _isInitialized: boolean = false;

  constructor(dbPrefix: string = 'puyo_game') {
    this._dbPrefix = dbPrefix;
  }

  // ==========================================
  // API INITIALISATION
  // ==========================================

  /**
   * Initialiser les données avec seed si nécessaire
   */
  async initialize(): Promise<void> {
    if (this._isInitialized) return;

    // Vérifier si déjà seedé
    const isSeeded = await this._checkIfSeeded();

    if (!isSeeded) {
      await this._seedDatabase();
      console.log('🌱 Base de données seedée avec succès');
    } else {
      console.log('✅ Base déjà seedée, skip');
    }

    this._isInitialized = true;
  }

  /**
   * Vérifier si la base a déjà été seedée
   */
  private async _checkIfSeeded(): Promise<boolean> {
    const { value } = await Preferences.get({ key: `${this._dbPrefix}_seeded` });
    return value === 'true';
  }

  /**
   * Marquer la base comme seedée
   */
  private async _markAsSeeded(): Promise<void> {
    await Preferences.set({
      key: `${this._dbPrefix}_seeded`,
      value: 'true',
    });
  }

  /**
   * Seed initial de la base
   */
  private async _seedDatabase(): Promise<void> {
    try {
      // Générer les IDs
      const userId = generateUUID();
      const gameId = generateUUID();
      const statsId = generateUUID();

      // Créer les données initiales
      await this.insert('user', {
        id: userId,
        playerName: 'Player1',
        isLeftHanded: false,
        isMusicEnabled: true,
        isSoundEffectsEnabled: true,
        language: 'fr',
        avatar: '/images/User/Avatar/avatar-2.png',
        astronaut: '/images/User/Astronaut/astro.png',
      });

      await this.insert('game', {
        id: gameId,
        userId: userId,
        score: 0,
        oxygenLevel: 100,
        inventory: [],
      });

      await this.insert('playerStats', {
        id: statsId,
        userId: userId,
        bestScore: 0,
        coins: 0,
      });

      // Marquer comme seedé
      await this._markAsSeeded();
    } catch (error) {
      console.error('❌ Erreur lors du seeding:', error);
      throw error;
    }
  }

  // ==========================================
  // API FONCTIONS UTILITAIRES
  // ==========================================

  /**
   * Générer une clé unique
   */
  private _getKey(tableName: string, id?: string): string {
    return id ? `${this._dbPrefix}_${tableName}_${id}` : `${this._dbPrefix}_${tableName}_list`;
  }

  /**
   * SAVE : Insert/Update intelligent qui gère tableau ou objet unique
   * - Pour les singletons (user, game, playerStats) : remplace l'unique entrée
   * - Pour bubble : peut accepter un array ou un seul élément
   */

  async insert<T extends keyof DatabaseSchema>(
    tableName: T,
    data: DatabaseSchema[T] | DatabaseSchema[T][] | Partial<DatabaseSchema[T]> | Partial<DatabaseSchema[T]>[]
  ): Promise<DatabaseSchema[T] | DatabaseSchema[T][]> {
    if (tableName === 'bubble') {
      const bubbles = Array.isArray(data) ? data : [data];
      return await this.addBubbles(bubbles);
    }

    // Pour les singletons (user, game, playerStats)
    return this._saveOne(tableName, Array.isArray(data) ? data[0] : data);
  }

  private async _saveOne<T extends keyof DatabaseSchema>(tableName: T, data: Partial<DatabaseSchema[T]>): Promise<DatabaseSchema[T]> {
    const id = data.id || generateUUID();

    const row = {
      id,
      ...data,
    } as DatabaseSchema[T];

    // Pour les singletons, on remplace la seule entrée
    if (tableName !== 'bubble') {
      await this._saveSingleton(tableName, row);
    } else {
      await this._saveMultiple(tableName, row);
    }

    return row;
  }

  private async _saveSingleton<T extends keyof DatabaseSchema>(tableName: T, row: DatabaseSchema[T]): Promise<void> {
    // Pour les singletons, on stocke directement
    await Preferences.set({
      key: `${this._dbPrefix}_${tableName}`,
      value: JSON.stringify(row),
    });
  }

  private async _saveMultiple<T extends keyof DatabaseSchema>(tableName: T, row: DatabaseSchema[T]): Promise<void> {
    // Sauver l'item individuel
    await Preferences.set({
      key: this._getKey(tableName as string, row.id),
      value: JSON.stringify(row),
    });

    // Mettre à jour la liste des IDs
    const listKey = this._getKey(tableName as string);
    const { value: listValue } = await Preferences.get({ key: listKey });
    const ids: string[] = listValue ? JSON.parse(listValue) : [];

    if (!ids.includes(row.id)) {
      ids.push(row.id);
      await Preferences.set({
        key: listKey,
        value: JSON.stringify(ids),
      });
    }
  }

  /**
   * Récupérer un singleton (user, game, playerStats) - pas d'ID requis
   */
  async getSingleton<T extends keyof DatabaseSchema>(tableName: T): Promise<DatabaseSchema[T] | null> {
    if (tableName === 'bubble') {
      throw new Error('Utilisez selectAll() pour la table bubble');
    }

    const { value } = await Preferences.get({ key: `${this._dbPrefix}_${tableName}` });
    return value ? JSON.parse(value) : null;
  }

  /**
   * Récupérer toutes les lignes
   */
  async selectAll<T extends keyof DatabaseSchema>(tableName: T): Promise<DatabaseSchema[T][]> {
    if (tableName === 'bubble') {
      return (await this.getAllBubbles()) as DatabaseSchema[T][];
    }

    const listKey = this._getKey(tableName);
    const { value: listValue } = await Preferences.get({ key: listKey });

    if (!listValue) return [];

    const ids: string[] = JSON.parse(listValue);
    const results: DatabaseSchema[T][] = [];

    for (const id of ids) {
      const itemKey = this._getKey(tableName, id);
      const { value: itemValue } = await Preferences.get({ key: itemKey });

      if (itemValue) {
        results.push(JSON.parse(itemValue));
      }
    }

    return results;
  }

  /**
   * UPDATE : Mise à jour intelligente sans ID requis pour les singletons
   */
  async update<T extends keyof DatabaseSchema>(tableName: T, updates: Partial<DatabaseSchema[T]>): Promise<boolean> {
    const existing = await this.getSingleton(tableName);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await Preferences.set({
      key: `${this._dbPrefix}_${tableName}`,
      value: JSON.stringify(updated),
    });

    return true;
  }

  /**
   * TRUNCATE : Vider intelligemment selon le type de table
   */
  async truncate<T extends keyof DatabaseSchema>(tableName: T): Promise<void> {
    if (tableName !== 'bubble') {
      // Singleton : supprimer LA seule entrée
      await Preferences.remove({ key: `${this._dbPrefix}_${tableName}` });
    } else {
      // Multiple : vider toutes les bubbles
      await this.clearBubbles();
    }
  }

  // ==========================================
  // MÉTHODES SPÉCIFIQUES POUR BUBBLE
  // ==========================================

  /**
   * Ajouter une ou plusieurs bubbles au tableau existant
   */
  async addBubbles(newBubbles: DatabaseSchema['bubble'][]): Promise<DatabaseSchema['bubble'][]> {
    const existingBubbles = await this.getAllBubbles();

    const bubblesWithDates = newBubbles.map(bubble => ({
      id: bubble.id || generateUUID(),
      ...bubble,
    })) as DatabaseSchema['bubble'][];

    const allBubbles = [...existingBubbles, ...bubblesWithDates];
    await this.saveBubbles(allBubbles);

    return bubblesWithDates;
  }

  async saveBubbles(bubbles: DatabaseSchema['bubble'][]): Promise<void> {
    await Preferences.set({
      key: `${this._dbPrefix}_bubbles`,
      value: JSON.stringify(bubbles),
    });
  }

  async getAllBubbles(): Promise<DatabaseSchema['bubble'][]> {
    const { value } = await Preferences.get({ key: `${this._dbPrefix}_bubbles` });
    return value ? JSON.parse(value) : [];
  }

  async getBubbleById(id: string): Promise<DatabaseSchema['bubble'] | null> {
    const allBubbles = await this.getAllBubbles();
    return allBubbles.find(b => b.id === id) || null;
  }

  async getBubblesWhere(filter: Partial<DatabaseSchema['bubble']>): Promise<DatabaseSchema['bubble'][]> {
    const allBubbles = await this.getAllBubbles();

    return allBubbles.filter(bubble => {
      return Object.entries(filter).every(([key, value]) => bubble[key as keyof DatabaseSchema['bubble']] === value);
    });
  }

  async updateBubbleById(id: string, updates: Partial<DatabaseSchema['bubble']>): Promise<boolean> {
    const allBubbles = await this.getAllBubbles();
    const bubbleIndex = allBubbles.findIndex(b => b.id === id);

    if (bubbleIndex === -1) return false;

    allBubbles[bubbleIndex] = {
      ...allBubbles[bubbleIndex],
      ...updates,
    };

    await this.saveBubbles(allBubbles);

    return true;
  }

  /**
   * Mettre à jour plusieurs bubbles selon un filtre (équivalent UPDATE WHERE)
   */
  async updateBubblesWhere(
    filter: Partial<DatabaseSchema['bubble']>,
    updates: Partial<DatabaseSchema['bubble']>
  ): Promise<DatabaseSchema['bubble'][]> {
    const allBubbles = await this.getAllBubbles();
    const updatedBubbles: DatabaseSchema['bubble'][] = [];

    const newBubbles = allBubbles.map(bubble => {
      // Vérifier si cette bubble matche le filtre
      const matches = Object.entries(filter).every(([key, value]) => (bubble as any)[key] === value);

      if (matches) {
        const updated = {
          ...bubble,
          ...updates,
        };
        updatedBubbles.push(updated);
        return updated;
      }

      return bubble;
    });

    await this.saveBubbles(newBubbles);
    return updatedBubbles;
  }

  /**
   * Supprimer une ou plusieurs bubbles par ID(s)
   */
  async deleteBubbleById(id: string | string[]): Promise<boolean> {
    const idsToDelete = Array.isArray(id) ? id : [id];
    const allBubbles = await this.getAllBubbles();

    const filteredBubbles = allBubbles.filter(bubble => !idsToDelete.includes(bubble.id));

    const deletedCount = allBubbles.length - filteredBubbles.length;
    if (deletedCount > 0) {
      await this.saveBubbles(filteredBubbles);
      return true;
    }

    return false;
  }

  async clearBubbles(): Promise<void> {
    await this.saveBubbles([]);
  }

  // ==========================================
  // UTILITAIRES
  // ==========================================

  async clear(): Promise<void> {
    await Preferences.clear();
    this._isInitialized = false;
  }

  async resetDatabase(): Promise<void> {
    await this.clear();
    await this.initialize();
  }
}

export const storageService = new StorageService('puyo_game');
