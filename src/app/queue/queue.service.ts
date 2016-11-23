import { Injectable } from '@angular/core';

import { Display } from './display';
import { OnPlay } from './on-play';
import { OnStop } from './on-stop';
import { IsPlaying } from './is-playing';
import { Identifiable } from './identifiable';

/**
 * Service to control queue list and playback;
 */
@Injectable()
export class QueueService<I extends Identifiable> {
  queue: Identifiable[] = [];
  currentIndex: number = 0;

  constructor(
    private onPlay: OnPlay<Identifiable>,
    private onStop: OnStop,
    public isPlaying: IsPlaying) {
  }

  /**
   * Add item to queue
   */
  add(item: Identifiable): void {
    this.queue.push(item);

    if (this.queue.length == 1) {
      this.setCurrent(0);
      this.play();
    }
  }

  /**
   * Remove item from queue
   */
  remove(index: number): void {
    this.queue.splice(index, 1);

    if (this.currentIndex == index) {
      this.currentIndex--;
      this.next();
    }
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.stop();
    this.queue.splice(0, this.queue.length);
  }

  /**
   * List items from queue
   */
  list(): Identifiable[] {
    return this.queue;
  }

  next(): void {
    if (this.currentIndex < this.queue.length - 1) {
      this.setCurrent(this.currentIndex + 1);
    }
  }

  previous(): void {
    if (this.currentIndex > 0) {
      this.setCurrent(this.currentIndex - 1);
    }
  }

  play(): void {
    if (this.queue.length > 0) {
      this.onPlay(this.getCurrentItem());
    }
  }

  stop(): void {
    this.onStop();
  }

  setCurrent(index: number): void {
    if (index < 0 || index >= this.queue.length) {
      throw new Error("Cannot set current. Index '" + index +
        "' is out of [0.." + (this.queue.length - 1) + "] bounds");
    }

    this.currentIndex = index;

    if (this.isPlaying()) {
      this.play();
    }
  }

  getCurrentItem(): Identifiable {
    return this.getItemAt(this.currentIndex);
  }

  getItemAt(index: number): Identifiable {
    return this.queue[index];
  }

  indexOfBySongId(id: number): number {
    let index = -1;

    this.queue.forEach((item) => {
      if (item.id == id) {
        index = this.queue.indexOf(item);
      }
    });

    return index;
  }

  getDisplay(): Display {
    throw new Error("getDisplay() not implemented in queue service");
  }
}