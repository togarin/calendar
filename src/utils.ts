import { NOTES_LOCAL_STORAGE_KEY } from './constants'
import { Note } from './models'

export const getNotesFromLocalStorage = (): Array<Note> => {
  const notesData = localStorage.getItem(NOTES_LOCAL_STORAGE_KEY)
  if (!notesData) return []

  const notes = JSON.parse(notesData)
  if (!Array.isArray(notes)) {
    localStorage.setItem(NOTES_LOCAL_STORAGE_KEY, JSON.stringify([]))
    return []
  }

  return notes
}

export const saveNotesToLocalStorage = (v: Array<Note>) => {
  localStorage.setItem(NOTES_LOCAL_STORAGE_KEY, JSON.stringify(v))
}
