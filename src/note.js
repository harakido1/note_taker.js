// Global Query Selectors from DOM Elements.
const noteContainer = document.querySelector('.note-container');
const modalContainer = document.querySelector('.modal-container');
const form = document.querySelector('form');
const titleInput = document.querySelector('#title');

// Classes for creating a new note.
class Note {
   constructor(title, body) {
      this.title = title;
      this.body = body;
      this.id = Math.random();
   }
}

/* --- LOCAL STORAGE --- */
// Function: Retrieve notes from storage.
function getNotes() {
   let notes;
   if (localStorage.getItem('noteApp.notes') === null) {
      notes = [];
   } else {
      notes = JSON.parse(localStorage.getItem('noteApp.notes'));
   }
   //console.log(notes);
   return notes;
}
//getNotes();

// Function: Add notes to localStorage.
function addNoteToLocalStorage(note) {
   const notes = getNotes();
   notes.push(note);
   localStorage.setItem('noteApp.notes', JSON.stringify(notes));
}

// Function: Remove notes from localStorage.
function removeNote(id) {
   const notes = getNotes();
   notes.forEach((note, index) => {
      if (note.id === id) {
         notes.splice(index, 1);
      }
      localStorage.setItem('noteApp.notes', JSON.stringify(notes));
   })
}


/* --- UI UPDATES --- */
// Function: Create a new note in UI.
function addNoteToList(note) {
   const newUINote = document.createElement('div');
   newUINote.classList.add('note');
   newUINote.innerHTML = `
   <span hidden>${note.id}</span>
   <h2 class="note__title">${note.title}</h2>
   <p class="note__body">${note.body}</p>
   <div class="note__btns">
      <button class="note__btn note__view">View Details</button>
      <button class="note__btn note__delete">Delete Note</button>
   </div>
   `;
   noteContainer.appendChild(newUINote);
}


// Function: Show notes in UI.
function displayNotes() {
   const notes = getNotes();
   notes.forEach(note => {
      addNoteToList(note);
   });
}

// Function Show alert message.
function showAlertMessage(message, alertClass) {
   const alertDiv = document.createElement('div');
   alertDiv.className = `message ${alertClass}`;
   alertDiv.appendChild(document.createTextNode(message));
   form.insertAdjacentElement('beforebegin', alertDiv);
   titleInput.focus();
   setTimeout(() => alertDiv.remove(), 3000);
}

// Function: View Note in modal.
function activateNoteModal(title, body) {
   const modalTitle = document.querySelector('.modal__title');
   const modalBody = document.querySelector('.modal__body');
   modalTitle.textContent = title;
   modalBody.textContent = body;
   modalContainer.classList.add('active');
}


// Event: Close modal.
const modalBtn = document.querySelector('.modal__btn').addEventListener('click', () => {
   modalContainer.classList.remove('active');
})

// Event: Note buttons operation.
noteContainer.addEventListener('click', (e) => {
   if(e.target.classList.contains('note__view')) {
      const currentNote = e.target.closest('.note');
      const currentTitle = currentNote.querySelector('.note__title').textContent;
      const currentBody = currentNote.querySelector('.note__body').textContent;
      activateNoteModal(currentTitle, currentBody);
   }
   if(e.target.classList.contains('note__delete')) {
      const currentNote = e.target.closest('.note');
      showAlertMessage('Your note was permanently deleted.', 'remove-message');
      currentNote.remove();
      const id = currentNote.querySelector('span').textContent;
      removeNote(Number(id));
   }
})


// Event: Display notes.
document.addEventListener('DOMContentLoaded', displayNotes);

// Event: Note form submit.
form.addEventListener('submit', (e) => {
   e.preventDefault();
   const noteInput = document.querySelector('#note');

   // validate inputs.
   if(titleInput.value.length > 0 && noteInput.value.length > 0) {
      const newNote = new Note(titleInput.value, noteInput.value);
      addNoteToList(newNote);
      addNoteToLocalStorage(newNote);
      titleInput.value = "";
      noteInput.value = "";
      showAlertMessage('Note successfully added!', 'success-message');
      titleInput.focus();
   } else {
      showAlertMessage('Please add both a title and a note.', 'alert-message');
   }
})