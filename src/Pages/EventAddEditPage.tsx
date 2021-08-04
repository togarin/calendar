import { FC, useState, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router'
import { startOfDay } from 'date-fns'
import { Note } from '../models'
import { getNotesFromLocalStorage, saveNotesToLocalStorage } from '../utils'
import { NoteForm } from '../components/NoteForm'

type EventAddEditPageParams = {
  id?: string
  timestamp?: string
}

export const EventAddEditPage: FC<{}> = () => {
  const { id, timestamp } = useParams<EventAddEditPageParams>()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setLoading] = useState(!!id)
  const history = useHistory()

  useEffect(() => {
    if (!id) return

    const notes = getNotesFromLocalStorage()
    const note = notes.find((n) => n.id === Number(id))
    if (!note) {
      history.replace('/')
      alert('Записи с таким id не существует')
      return
    }
    setNote(note)

    setLoading(false)
  }, [id, history])

  const handleSaveNote = useCallback(
    (noteToSave: Note) => {
      const notes = getNotesFromLocalStorage()

      saveNotesToLocalStorage(
        note
          ? notes.map((n) => (n.id === noteToSave.id ? noteToSave : n))
          : [...notes, noteToSave],
      )
      history.replace('/')
    },
    [history, note],
  )

  if (isLoading) return null

  return (
    <div>
      <NoteForm
        onSave={handleSaveNote}
        initialNote={
          note || {
            kind: 'Holiday',
            budget: 0,
            id: new Date().getTime(),
            timestamp: startOfDay(
              timestamp ? Number(timestamp) : new Date(),
            ).getTime(),
          }
        }
      />
    </div>
  )
}
