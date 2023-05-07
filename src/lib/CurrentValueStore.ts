//
// CurrentValueStore.ts
//
// Copyright (c) 2023 Hironori Ichimiya <hiron@hironytic.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//

import type { Readable, StartStopNotifier, Subscriber, Unsubscriber, Updater, Writable } from "svelte/store"
import { writable } from "svelte/store"

/**
 * Readable with current value
 */
export interface CurrentValueReadable<T> extends Readable<T> {
  readonly currentValue: T
}

/**
 * Writable with current value
 */
export interface CurrentValueWritable<T> extends CurrentValueReadable<T>, Writable<T> {
}

/**
 * Creates a `CurrentValueWritable`.
 * @param value initial value
 * @param start start and stop notifications for subscriptions
 */
export function currentValueWritable<T>(value: T, start?: StartStopNotifier<T>): CurrentValueWritable<T> {
  const store = writable(value, start)

  function set(newValue: T): void {
    value = newValue
    store.set(newValue)
  }

  function update(fn: Updater<T>): void {
    set(fn(value))
  }

  function subscribe(run: Subscriber<T>, invalidate?: (value?: T) => void): Unsubscriber {
    return store.subscribe(run, invalidate)
  }

  return {
    set,
    update,
    subscribe,
    get currentValue(): T {
      return value
    }
  }
}

/**
 * Creates a `CurrentValueReadable` which holds specified value as a current value and never changes it.
 * @param value value
 */
export function currentValueReadable<T>(value: T): CurrentValueReadable<T> {
  return {
    currentValue: value,
    subscribe(subscriber: Subscriber<T>) {
      subscriber(value)
      return () => { /* do nothing */ }
    }
  }
}
