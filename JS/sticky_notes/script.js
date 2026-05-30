let noteCount = 0;

const addBtn = document.getElementById('addBtn');
const noteInput = document.getElementById('noteInput');
const notesContainer = document.getElementById('notesContainer');

addBtn.addEventListener('click', addNote);

noteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        addNote();
    }
});

function addNote() {
    const noteText = noteInput.value.trim();
    
    if (noteText === '') {
        alert('Please type a note first!');
        return;
    }

    const noteElement = document.createElement('div');
    noteElement.className = `note ${noteCount % 2 === 0 ? 'color-1' : 'color-2'}`;

    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.textContent = noteText;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'note-delete';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
        noteElement.remove();
    });

    noteElement.appendChild(noteContent);
    noteElement.appendChild(deleteBtn);
    notesContainer.appendChild(noteElement);

    noteCount++;
    noteInput.value = '';
    noteInput.focus();
}
