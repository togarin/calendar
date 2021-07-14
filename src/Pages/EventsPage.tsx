import { FC, useState, useEffect, useMemo, useCallback } from 'react'
import { Note } from '../models'
import { NOTES_LOCAL_STORAGE_KEY } from '../constants'
import { isSameDay, format } from 'date-fns'
import { useHistory } from 'react-router'

import Grid from '@material-ui/core/Grid'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import AddBoxIcon from '@material-ui/icons/AddBox'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Typography,
} from '@material-ui/core'

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
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="space-around">
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
        </Grid>
      </MuiPickersUtilsProvider>

      <Button onClick={() => history.push(`/add/${date.getTime()}`)}>
        <AddBoxIcon />
        ADD
      </Button>
      <div>
        {todayNotes.map((note) => (
          <NoteCard
            onDelete={onDelete}
            onEdit={onEdit}
            note={note}
            key={note.id}
          />
        ))}
      </div>
    </div>
  )
}

const NoteCard: FC<{
  note: Note
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}> = ({ note, onDelete, onEdit }) => {
  const renderData = () => {
    switch (note.kind) {
      case 'Event':
        return (
          <div>
            Адресс {note.address}, время {format(note.timestamp, 'HH:mm')}
          </div>
        )
      case 'Holiday':
        return <div>Бюджет {note.budget}</div>
      case 'Other':
        return <div>Описание {note.description}</div>
      default:
        return null
    }
  }

  return (
    <Paper>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            {format(note.timestamp, 'MMMM, d, EEEE')}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {kindLabel[note.kind]}
          </Typography>
          <Typography variant="body2" component="p">
            {renderData()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => onEdit(note.id)}>EDIT</Button>
          <Button onClick={() => onDelete(note.id)}>DELETE</Button>
        </CardActions>
      </Card>
    </Paper>
  )
}

const kindLabel = {
  Holiday: 'Выходной',
  Event: 'Событие',
  Other: 'Другое',
} as const
