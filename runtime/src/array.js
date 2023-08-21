import { untrack, onDispose, signal, root } from './reactivity'

const FALLBACK = Symbol("fallback")

/**
The MIT License (MIT)

Copyright (c) 2017 Adam Haile

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

// Modified version of mapSample from S-array[https://github.com/adamhaile/S-array] by Adam Haile
/**
 * reactively transforms an array with a callback function - underlying helper for the `<for>` control flow
 *
 * similar to `Array.prototype.map`, but gets the index as accessor, transforms only values that changed and returns an accessor and reactively tracks changes to the list.
 */
export function mapArray(list, mapFn, options = {}) {

  let items = []
  let mapped = []
  let disposers = []
  let len = 0
  let indexes = mapFn.length > 1 ? [] : null

  onDispose(() => dispose(disposers))
  return () => {
    let newItems = list() || []
    let i
    let j

    const mapper = (disposer) => {
      disposers[j] = disposer
      if (indexes) {
        const s = signal(j)
        indexes[j] = s
        return mapFn(newItems[j], s)
      }
      return mapFn(newItems[j])
    }

    return untrack(() => {
      let newLen = newItems.length
      let newIndices
      let newIndicesNext
      let temp
      let tempdisposers
      let tempIndexes
      let start
      let end
      let newEnd
      let item

      // fast path for empty arrays
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers)
          disposers = []
          items = []
          mapped = []
          len = 0
          if (indexes) indexes = []
        }
        if (options.fallback) {
          items = [FALLBACK]
          mapped[0] = root(disposer => {
            disposers[0] = disposer
            return options.fallback()
          })
          len = 1
        }
      }
      // fast path for new create
      else if (len === 0) {
        mapped = new Array(newLen)
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j]
          mapped[j] = root(mapper)
        }
        len = newLen
      } else {
        temp = new Array(newLen)
        tempdisposers = new Array(newLen)
        if (indexes) tempIndexes = new Array(newLen)

        // skip common prefix
        for (
          start = 0, end = Math.min(len, newLen);
          start < end && items[start] === newItems[start];
          start++
        );

        // common suffix
        for (
          end = len - 1, newEnd = newLen - 1;
          end >= start && newEnd >= start && items[end] === newItems[newEnd];
          end--, newEnd--
        ) {
          temp[newEnd] = mapped[end]
          tempdisposers[newEnd] = disposers[end]
          if (indexes) tempIndexes[newEnd] = indexes[end]
        }

        // 0) prepare a map of all indices in newItems, scanning backwards so we encounter them in natural order
        newIndices = new Map()
        newIndicesNext = new Array(newEnd + 1)

        for (j = newEnd; j >= start; j--) {
          item = newItems[j]
          i = newIndices.get(item)
          newIndicesNext[j] = i === undefined ? -1 : i
          newIndices.set(item, j)
        }
        // 1) step through all old items and see if they can be found in the new set; if so, save them in a temp array and mark them moved; if not, exit them
        for (i = start; i <= end; i++) {
          item = items[i]
          j = newIndices.get(item)
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i]
            tempdisposers[j] = disposers[i]
            if (indexes) tempIndexes[j] = indexes[i]
            j = newIndicesNext[j]
            newIndices.set(item, j)
          }
          else disposers[i]()
        }
        // 2) set all the new values, pulling from the temp array if copied, otherwise entering the new value
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j]
            disposers[j] = tempdisposers[j]
            if (indexes) {
              indexes[j] = tempIndexes[j]
              indexes[j](j)
            }
          }
          else mapped[j] = root(mapper)
        }
        // 3) in case the new set is shorter than the old, set the length of the mapped array
        mapped = mapped.slice(0, (len = newLen))
        // 4) save a copy of the mapped items for the next update
        items = newItems.slice(0)
      }
      return mapped
    })
  }
}

function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]()
}