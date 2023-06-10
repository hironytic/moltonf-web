//
// History.ts
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

import type { Readable } from "svelte/store"
import { writable } from "svelte/store"
import { v4 as uuidv4 } from 'uuid'

export class HistoryLocation {
  readonly path: string
  readonly components: string[]

  private constructor(path: string, components: string[]) {
    this.path = path
    this.components = components
  }

  static fromPath(path: string): HistoryLocation {
    const components0 = path
      .replace(/(^\/+|\/+$)/g, "") // remove leading and trailing slashes
      .split("/")
      .map(it => decodeURIComponent(it))
    const components1 = (components0.length === 1 && components0[0] === "") ? [] : components0
    const components = (path.startsWith("/")) ? ["/", ...components1] : components1
    return new HistoryLocation(path, components)
  }

  static fromComponents(components: string[]): HistoryLocation {
    const [first, ...remaining] = components
    const path = (first === "/") 
      ? "/" + remaining.map(it => encodeURIComponent(it)).join("/")
      : components.map(it => encodeURIComponent(it)).join("/")
    return new HistoryLocation(path, components)
  }
}

export interface HistoryLocationWithId {
  readonly id: string
  readonly location: HistoryLocation
}

export interface History {
  readonly location$: Readable<HistoryLocationWithId>
  navigate(location: HistoryLocation, replace: boolean): void
  getHref(location: HistoryLocation): string
}

export class HashHistory implements History {
  readonly location$ = writable(this.getLocationFromWindow(), () => {
    const popStateListener = () => {
      this.onPopState()
    }
    window.addEventListener("popstate", popStateListener)
    return () => {
      window.removeEventListener("popstate", popStateListener)
    }
  })
  
  private getLocationFromWindow(): HistoryLocationWithId {
    const id = window.history.state?.id ?? "initial"
    const hash = window.location.hash
    const location = (hash !== "") ? HistoryLocation.fromPath(hash.substring(1)) : HistoryLocation.fromPath("/")
    return {
      id,
      location,
    }
  }
  
  private onPopState() {
    this.location$.set(this.getLocationFromWindow())
  }
  
  navigate(location: HistoryLocation, replace: boolean) {
    const path = this.getHref(location)
    const state = {
      id: uuidv4(),
    }
    try {
      if (replace) {
        window.history.replaceState(state, "", path)
      } else {
        window.history.pushState(state, "", path)
      }
    } catch (e) {
      if (replace) {
        window.location.replace(path)
      } else {
        window.location.assign(path)
      }
    }
    
    this.location$.set(this.getLocationFromWindow())
  }
  
  getHref(location: HistoryLocation): string {
    return "#" + location.path
  }
}
