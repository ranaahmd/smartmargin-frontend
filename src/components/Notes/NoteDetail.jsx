import { useParams } from 'react-router-dom';

function NoteDetails(props){
  const { noteId } = useParams();
  const selectedNote = props.notes.find(
    (note) => note._id === Number(noteId)
  );

  if (!selectedNote) {
    return <div>Note Not Found!</div>;
  }

  return (
    <div>
      <h2>Note Details</h2>
      <p>Title: {selectedNote.title}</p>
      <p>Category: {selectedNote.category}</p>
    </div>
  );
}

export default NoteDetails;