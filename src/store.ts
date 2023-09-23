import { writable, type Writable, derived } from 'svelte/store';
import { MaxPat, Box } from './maxpat2svg'
import { type DiffItem, type SideOfDiff } from './github'
import { makeTree } from './util'

export type MaxPatFile = {
  filename: string
  left?: MaxPat
  right?: MaxPat
}

export type DiffFileItem = {
  name: string,
  id: string
}

export const showInspector: Writable<boolean> = writable(false)


/**
 * Main file list in flat form.
 */
export const diffItems: Writable<DiffItem[]> = writable([])

/**
 * Directory tree style of file list. Not includes sub patcher tree.
 */
export const diffItemTree = derived(diffItems, ($diffItems) => {
  return makeTree(Object.values($diffItems).map( i => ({ path: i.path || [''], item: i })))
//  return makeTree($diffItems.map( i => ({ path: i.path || [''], item: i })))
})

export const diffItemIndex: Writable<{[id: string]: DiffItem}> = writable({})

export const opacityBalance: Writable<number> = writable(500)
export const diffOpacity = derived(opacityBalance, ($opacityBalance) => {
  const v = $opacityBalance / 1000
  return {
    right: v,
    left: 1.0 - v
  }
})

export const selecting: Writable<boolean> = writable(false)
export const selected: Writable<{[side in SideOfDiff]?: Box}> = writable({})
