/**
 * core.js is imported by "dom-expressions/src/client.js" 
 * It exports the core reactive primitives needed to create a reactive renderer 
 * (signal, effect, memo, etc.)
 */
export const sharedConfig = {}
export {
  effect,
  memo,
  untrack,
  root,
  getOwner,
  mergeProps,
  createComponent
} from './reactivity'