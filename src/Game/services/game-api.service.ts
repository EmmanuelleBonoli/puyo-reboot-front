import {http} from '../../shared/services/http-client';
import type {Bubble, BubblePair, Game} from '../models/game.types.ts';

export async function deleteOldGameAndReturnNewOne(gameId: string): Promise<Game> {
    return http<Game>(`/game/${gameId}`, {
        method: 'DELETE',
        auth: true,
    });
}

export async function deleteBubbles(gameId: string, bubblesId: string[]): Promise<boolean> {
    return http<boolean>(`/game/${gameId}/bubbles`, {
        method: 'DELETE',
        body: bubblesId,
        auth: true
    })
}

export async function updateBubblesOnServer(gameId: string, bubblesToMove: Bubble[]): Promise<boolean> {
    return http<boolean>(`/game/${gameId}/bubbles`, {
        method: 'PUT',
        body: bubblesToMove,
        auth: true
    })
}

export async function getWaitingBubblesFromServer(gameId: string): Promise<BubblePair> {
    return http<BubblePair>(`/game/${gameId}/generateBubbles`, {
        method: 'GET',
        auth: true
    })
}
