// auto-unsubscribes subscriptions, use as class decorator:
// @AutoUnsubscribe([])
// if wanting to exclude certain subscriptions, mark in array in the decorator, e.g:

import { isDevMode } from '@angular/core';
import { Subscription } from 'rxjs';

// @AutoUnsubscribe(['mySubscription'])
export function AutoUnsubscribe(blackList = []) {

  return (constructor) => {
    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function() {
      let destroyCount = 0;
      for (const prop of Object.keys(this)) {
        const subscriber = this[prop];
        if (!blackList.includes(prop)) {
          if (subscriber && (typeof subscriber.unsubscribe === 'function')) {
            subscriber.unsubscribe();
            destroyCount ++;
          }
        }
      }
      if (destroyCount > 0) {
        if (isDevMode()) {
          console.log(`Auto-unsubscribed -> ( ${destroyCount} )`);
        }
      }
      if (original && typeof original === 'function') {
        original.apply(this, arguments);
      }
    };
  };
}
