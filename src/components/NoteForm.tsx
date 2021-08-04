import { FC, useState } from 'react'
import { Note } from '../models'
import { Container, Button, Grid, Input } from '@material-ui/core'
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

export const NoteForm: FC<{ initialNote: Note; onSave: (v: Note) => void }> = ({
  initialNote,
  onSave,
}) => {
  const [note, setNote] = useState<Note>(initialNote)

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
          <Container>
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
          </Container>
        )
      case 'Holiday':
        return (
          <Container>
            <Input
              placeholder="Бдюджет"
              type="number"
              value={note.budget}
              onChange={(e) =>
                setNote({ ...note, budget: Number(e.target.value || 0) })
              }
            />
          </Container>
        )
      case 'Other':
        return (
          <Container>
            <Input
              placeholder="Описание"
              type="text"
              value={note.description}
              onChange={(e) =>
                setNote({ ...note, description: e.target.value })
              }
            />
          </Container>
        )
      default:
        return null
    }
  }

  return (
    <Container>
      <Button onClick={() => changeNoteKind('Holiday')}>HOLIDAY</Button>
      <Button onClick={() => changeNoteKind('Event')}>EVENT</Button>
      <Button onClick={() => changeNoteKind('Other')}>OTHER</Button>
      {renderData()}
      <Button onClick={() => onSave(note)}>Save</Button>
    </Container>
  )
}
