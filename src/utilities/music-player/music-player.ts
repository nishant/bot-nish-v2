/* eslint-disable no-underscore-dangle */

import { logger } from '../logger';
import { MusicPlayerItem } from './music-player-item';

class _MusicPlayer {
  public queue: Array<MusicPlayerItem> = [];

  public enqueue(item: MusicPlayerItem): void {
    this.queue.push(item);
  }

  public dequeue(): void {
    this.queue.pop();
  }

  public remove(index: number): void {
    this.queue.splice(index, 1);
  }

  public enqueueFront(item: MusicPlayerItem): void {
    this.queue.unshift(item);
  }

  public getNext(): MusicPlayerItem {
    return this.queue[0];
  }

  public printQueue(): string {
    let temp = '';
    if (this.queue.length === 0) return 'queue is empty!';

    this.queue.forEach((value, index) => {
      logger.info(index + 1, value.videoUrl);
      temp += `${index + 1} => ${value.videoUrl}\n`;
    });
    return temp;
  }
}

export const MusicPlayer = new _MusicPlayer();
