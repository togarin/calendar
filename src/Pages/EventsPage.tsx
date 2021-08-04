import { FC, useState, useEffect, useMemo, useCallback } from 'react'
import { NoteCard } from '../components/NoteCard'
import { Note } from '../models'
import { NOTES_LOCAL_STORAGE_KEY } from '../constants'
import { isSameDay } from 'date-fns'
import { useHistory } from 'react-router'

import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import AddBoxIcon from '@material-ui/icons/AddBox'
import { Container, Button } from '@material-ui/core'

export const EventsPage: FC<{}> = () => {
  const [notes, setNotes] = useState<Array<Note>>([])
  const [date, setDate] = useState<Date>(new Date())
  const [isLoading, setLoading] = useState(false)
  const history = useHistory()

  useEffect(() => {
    const notesData = localStorage.getItem(NOTES_LOCAL_STORAGE_KEY)
    if (notesData) {
      const notes = JSON.parse(notesData)
      if (Array.isArray(notes)) {
        setNotes(notes)
      }
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return
    localStorage.setItem(NOTES_LOCAL_STORAGE_KEY, JSON.stringify(notes))
  }, [isLoading, notes])

  const onDelete = useCallback((id: number) => {
    setNotes((notes) => notes.filter((n) => n.id !== id))
  }, [])

  const onEdit = useCallback(
    (id: number) => {
      history.push(`/edit/${id}`)
    },
    [history],
  )

  const todayNotes = useMemo(() => {
    return notes.filter((n) => isSameDay(date, n.timestamp))
  }, [notes, date])

  if (isLoading) return null

  return (
    <Container>
      <Grid container justifyContent="space-around">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Date picker dialog"
            format="MM/dd/yyyy"
            value={date}
            onChange={(date) => date && setDate(date)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>

        <Button onClick={() => history.push(`/add/${date.getTime()}`)}>
          <AddBoxIcon />
          ADD
        </Button>
      </Grid>

      <Grid justifyContent="space-around" item xs={6}>
        {todayNotes.map((note) => (
          <NoteCard
            onDelete={onDelete}
            onEdit={onEdit}
            note={note}
            key={note.id}
          />
        ))}
      </Grid>
    </Container>
  )
}
