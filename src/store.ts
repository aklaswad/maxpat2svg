import { writable, type Writable, derived } from 'svelte/store';
import { MaxPat } from './maxpat2svg'
import { type DiffItem } from './github'

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
export const diffFiles: Writable<DiffFileItem[]> = writable([])
export const diffItems: Writable<{[id: string]: DiffItem}> = writable({})
export const opacityBalance: Writable<number> = writable(500)
export const diffOpacity = derived(opacityBalance, ($opacityBalance) => {
  const v = $opacityBalance / 1000
  return {
    right: v,
    left: 1.0 - v
  }
})
