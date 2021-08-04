import { FC } from 'react'
import { format } from 'date-fns'
import { Note } from '../models'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Typography,
} from '@material-ui/core'

export const NoteCard: FC<{
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
