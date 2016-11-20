import { Injectable } from '@angular/core';

import { Display } from './display';
import { OnPlay } from './on-play';
import { OnStop } from './on-stop';
import { IsPlaying } from './is-playing';

/**
 * Service to control queue list and playback;
 */
@Injectable()
export class QueueService<I> {
  queue: I[] = [];
  current: number = 0;

  constructor(
    private onPlay: OnPlay<I>,
    private onStop: OnStop,
    public isPlaying: IsPlaying) {
  }

  /**
   * Add item to queue
   */
  add(item: I): void {
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

    if (this.current == index) {
      this.current--;
      this.stop();
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
  list(): I[] {
    return this.queue;
  }

  next(): void {
    if (this.current < this.queue.length - 1) {
      this.setCurrent(this.current + 1);
      this.play();
    }
  }

  previous(): void {
    if (this.current > 0) {
      this.setCurrent(this.current - 1);
      this.play();
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
    if (this.queue.length > this.current) {
      this.current = index;
      this.play();
    }

  }

  getCurrentIndex(): number {
    return 0;
  }

  getCurrentItem(): I {
    return this.queue[this.current];
  }

  getItemAt(index: number): I {
    return null;
  }
  indexOfBySongId(): number {
    return 0;
  }

  getDisplay(): Display {
    return null;
  }
}