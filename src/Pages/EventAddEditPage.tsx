import { FC, useState, useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router'
import { startOfDay } from 'date-fns'
import { Note } from '../models'
import { getNotesFromLocalStorage, saveNotesToLocalStorage } from '../utils'
import { Button, Grid, Input } from '@material-ui/core'
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

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

const NoteForm: FC<{ initialNote: Note; onSave: (v: Note) => void }> = ({
  initialNote,
  onSave,
}) => {
  const [note, setNote] = useState<Note>(initialNote)
  // const [date, setDate] = useState<Date>(new Date())

  const changeNoteKind = (kind: Note['kind']) => {
    if (kind === note.kind) return

    switch (kind) {
      case 'Holiday':
        return setNote((note) => ({
          kind: 'Holiday',
          id: note.id,
          timestamp: note.timestamp,
          budget: 0,
        }))
      case 'Event':
        return setNote((note) => ({
          kind: 'Event',
          id: note.id,
          timestamp: note.timestamp,
          address: '',
        }))

      case 'Other':
        return setNote((note) => ({
          kind: 'Other',
          id: note.id,
          timestamp: note.timestamp,
          description: '',
        }))
    }
  }

  const renderData = () => {
    switch (note.kind) {
      case 'Event':
        return (
          <div>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justifyContent="space-around">
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Time picker"
                  value={new Date(note.timestamp)}
                  onChange={(date) => {
                    if (date) {
                      setNote({ ...note, timestamp: date.getTime() })
                    }
                  }}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
                <Input
                  placeholder="Адрес"
                  type="text"
                  value={note.address}
                  onChange={(e) =>
                    setNote({ ...note, address: e.target.value })
                  }
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </div>
        )
      case 'Holiday':
        return (
          <div>
            <Input
              placeholder="Бдюджет"
              type="number"
              value={note.budget}
              onChange={(e) =>
                setNote({ ...note, budget: Number(e.target.value || 0) })
              }
            />
          </div>
        )
      case 'Other':
        return (
          <div>
            <Input
              placeholder="Описание"
              type="text"
              value={note.description}
              onChange={(e) =>
                setNote({ ...note, description: e.target.value })
              }
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <Button onClick={() => changeNoteKind('Holiday')}>HOLIDAY</Button>
      <Button onClick={() => changeNoteKind('Event')}>EVENT</Button>
      <Button onClick={() => changeNoteKind('Other')}>OTHER</Button>
      {renderData()}
      <Button onClick={() => onSave(note)}>Save</Button>
    </div>
  )
}
