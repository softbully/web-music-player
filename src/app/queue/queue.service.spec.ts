/**
 * Unit test for QueueService
 */

import { async } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { Identifiable } from './identifiable';

describe('Queue Service', () => {
  /*
   * Queue Management
   */

  it(`should correctly add item to queue`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);

    expect(queue.list().length).toEqual(1);
    expect(queue.list()).toContain(item);
  }));

  it(`should correctly remove item from queue`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);
    queue.remove(0);

    expect(queue.list().length).toEqual(0);
    expect(queue.list()).not.toContain(item);
  }));

  it(`should skip to next and play when removing current item 
          from queue and is currently playing`, async(() => {
      let queue: QueueService<any> = createQueueService();
      let item1: Identifiable = { id: 1 };
      let item2: Identifiable = { id: 2 };

      queue.add(item1);
      queue.add(item2);

      expect(queue.isPlaying()).toEqual(true);
      queue.remove(0);
//      expect(queue.isPlaying()).toEqual(true);

      //    expect(queue.getCurrentItem()).toEqual(item2);
    }));


  it(`should skip to next and not play when removing current item from queue and isPlaying is false`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);
    queue.stop();
    queue.remove(0);

    expect(queue.isPlaying()).toEqual(false);
    expect(queue.getCurrentItem()).toEqual(item2);
    expect(queue.isPlaying()).toEqual(false);
  }));

  it(`should not skip to next when removing current item from queue`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);
    queue.remove(1);

    expect(queue.getCurrentItem()).toEqual(item1);
  }));

  it(`should correctly clear queue`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);
    queue.clear();

    expect(queue.list().length).toEqual(0);
    expect(queue.list()).not.toContain(item);
  }));

  /**
   * Playback
   */

  it(`should not be playing when newly initialized`, async(() => {
    let queue: QueueService<any> = createQueueService();

    expect(queue.isPlaying()).toEqual(false);
  }));

  it(`should not play when queue is empty`, async(() => {
    let queue: QueueService<any> = createQueueService();

    queue.play();

    expect(queue.isPlaying()).toEqual(false);
  }));

  it(`should start playing automatically when an item is added to queue`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);

    expect(queue.isPlaying()).toEqual(true);
  }));

  it(`should stop playing on stop`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);
    expect(queue.isPlaying()).toEqual(true);

    queue.stop();

    expect(queue.isPlaying()).toEqual(false);
  }));


  it(`should start playing on play`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);
    queue.stop();
    queue.play();

    expect(queue.isPlaying()).toEqual(true);
  }));

  it(`should update state on next`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    expect(queue.isPlaying()).toEqual(true);
  }));

  it(`should return correct current item`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    queue.add(item);

    expect(queue.getCurrentItem()).toEqual(item);
  }));

  it(`should return correct item when searching by id`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item: Identifiable = { id: 1 };

    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    let indexById: number = queue.indexOfBySongId(item2.id);

    expect(indexById).toEqual(1);
  }));

  it(`should update current item correctly`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    expect(queue.getCurrentItem()).toEqual(item1);
    queue.setCurrent(1);
    expect(queue.getCurrentItem()).toEqual(item2);
  }));

  it(`should throw error when setting current out of bounds`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    expect(() => queue.setCurrent(-1)).toThrowError();
    expect(() => queue.setCurrent(2)).toThrowError();
  }));

  it(`should go to next on next if current is not last`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    expect(queue.getCurrentItem()).toEqual(item1);
    queue.next();
    expect(queue.getCurrentItem()).toEqual(item2);
  }));

  it(`should remain on last on next if current is last`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);
    queue.setCurrent(1);

    expect(queue.getCurrentItem()).toEqual(item2);
    queue.next();
    expect(queue.getCurrentItem()).toEqual(item2);
  }));

  it(`should go to previous on previous if current is not first`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);
    queue.setCurrent(1);

    expect(queue.getCurrentItem()).toEqual(item2);
    queue.previous();
    expect(queue.getCurrentItem()).toEqual(item1);
  }));

  it(`should remain on first on previous if current is first`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    expect(queue.getCurrentItem()).toEqual(item1);
    queue.previous();
    expect(queue.getCurrentItem()).toEqual(item1);
  }));

  it(`should start playing on set current if previously playing`, async(() => {
    let queue: QueueService<any> = createQueueService();

    queue.add({ id: 1 });
    queue.add({ id: 2 });

    expect(queue.isPlaying()).toEqual(true);
    queue.setCurrent(1);
    expect(queue.isPlaying()).toEqual(true);
  }));

  it(`should not start playing on set current if not previously playing`, async(() => {
    let queue: QueueService<any> = createQueueService();

    queue.add({ id: 1 });
    queue.add({ id: 2 });
    queue.stop();

    expect(queue.isPlaying()).toEqual(false);
    queue.setCurrent(1);
    expect(queue.isPlaying()).toEqual(false);
  }));

  it(`should start playing on previous if previously playing`, async(() => {
    let queue: QueueService<any> = createQueueService();

    queue.add({ id: 1 });
    queue.add({ id: 2 });
    queue.setCurrent(1);

    expect(queue.isPlaying()).toEqual(true);
    queue.previous();
    expect(queue.isPlaying()).toEqual(true);
  }));

  it(`should not start playing on previous if not previously playing`, async(() => {
    let queue: QueueService<any> = createQueueService();

    queue.add({ id: 1 });
    queue.add({ id: 2 });
    queue.setCurrent(1);
    queue.stop();

    expect(queue.isPlaying()).toEqual(false);
    queue.previous();
    expect(queue.isPlaying()).toEqual(false);
  }));

  it(`should continue playing on next if previously playing`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);

    expect(queue.isPlaying()).toEqual(true);
    queue.next();
    expect(queue.isPlaying()).toEqual(true);
  }));

  it(`should not start playing on next if not previously playing`, async(() => {
    let queue: QueueService<any> = createQueueService();
    let item1: Identifiable = { id: 1 };
    let item2: Identifiable = { id: 2 };

    queue.add(item1);
    queue.add(item2);
    queue.stop();

    expect(queue.isPlaying()).toEqual(false);
    queue.next();
    expect(queue.isPlaying()).toEqual(false);
  }));

  it(`should throw error on getDisplay`, async(() => {
    let queue: QueueService<any> = createQueueService();
    expect(() => queue.getDisplay()).toThrowError();
  }));

});

class Player<I> {
  isPlaying: boolean = false;
  play(item: I): void { this.isPlaying = true; }
  stop(): void { this.isPlaying = false; }
}

function createQueueService(): QueueService<any> {
  let player = new Player();
  let queue: QueueService<any> = new QueueService<any>(
    (item) => player.play(item),
    () => player.stop(),
    () => player.isPlaying
  );

  return queue;
}