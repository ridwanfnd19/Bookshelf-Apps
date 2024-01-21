const bookshelfIsComplete = [];
const bookshelfNotComplete = [];
const maksBook = 4;
const RENDER_EVENT = 'render-book';
const ADD_EVENT = 'add-book';
const DELETE_EVENT = 'delete-book';
const BOOKSHELF_COMPLETE_FULL_EVENT = 'bookshelf-complete-full-event';
const BOOKSHELF_NOT_COMPLETE_FULL_EVENT = 'bookshelf-not-complete-full-event';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const addDialog = document.getElementsByClassName('add-dialog');
const deleteDialog = document.getElementsByClassName('delete-dialog');
const fullDialog1 = document.getElementsByClassName('rak1-full-dialog');
const fullDialog2 = document.getElementsByClassName('rak2-full-dialog');
const search = document.getElementById("search");

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    };
    return true;
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify([...bookshelfIsComplete, ...bookshelfNotComplete]);
        localStorage.setItem(STORAGE_KEY, parsed);
    };
};

document.addEventListener(ADD_EVENT, function () {
    addDialog[0].style.visibility = 'visible';
    deleteDialog[0].style.display = 'none';
    fullDialog1[0].style.display = 'none';
    fullDialog2[0].style.display = 'none';
    setTimeout(() => {
        addDialog[0].style.visibility = 'hidden';
        addDialog[0].style.background = 'transparent';
    }, 1000);   

    setTimeout(() => {
        addDialog[0].style.background = null;
        addDialog[0].style.display = 'flex';
        deleteDialog[0].style.display = 'flex';
        fullDialog1[0].style.display = 'flex';
        fullDialog2[0].style.display = 'flex';
    }, 2000);
});

document.addEventListener(DELETE_EVENT, function () {
    addDialog[0].style.display = 'none';
    deleteDialog[0].style.visibility = 'visible';
    fullDialog1[0].style.display = 'none';
    fullDialog2[0].style.display = 'none';
    setTimeout(() => {
        deleteDialog[0].style.visibility = 'hidden';
        deleteDialog[0].style.background = 'transparent';
    }, 1000);   

    setTimeout(() => {
        deleteDialog[0].style.background = null;
        addDialog[0].style.display = 'flex';
        deleteDialog[0].style.display = 'flex';
        fullDialog1[0].style.display = 'flex';
        fullDialog2[0].style.display = 'flex';
    }, 2000);
});

document.addEventListener(BOOKSHELF_COMPLETE_FULL_EVENT, function () {
    addDialog[0].style.display = 'none';
    deleteDialog[0].style.display = 'none';
    fullDialog1[0].style.visibility = 'visible';
    fullDialog2[0].style.display = 'none';
    setTimeout(() => {
        fullDialog1[0].style.visibility = 'hidden';
        fullDialog1[0].style.background = 'transparent';
    }, 1000);
    
    setTimeout(() => {
        fullDialog1[0].style.background = null;
        addDialog[0].style.display = 'flex';
        deleteDialog[0].style.display = 'flex';
        fullDialog1[0].style.display = 'flex';
        fullDialog2[0].style.display = 'flex';
    }, 2000);
});

document.addEventListener(BOOKSHELF_NOT_COMPLETE_FULL_EVENT, function () {
    addDialog[0].style.display = 'none';
    deleteDialog[0].style.display = 'none';
    fullDialog1[0].style.display = 'none';
    fullDialog2[0].style.visibility = 'visible';
    setTimeout(() => {
        fullDialog2[0].style.visibility = 'hidden';
        fullDialog2[0].style.background = 'transparent';
    }, 1000);
    
    setTimeout(() => {
        fullDialog2[0].style.background = null;
        addDialog[0].style.display = 'flex';
        deleteDialog[0].style.display = 'flex';
        fullDialog1[0].style.display = 'flex';
        fullDialog2[0].style.display = 'flex';
    }, 2000);
});

function addBook() {
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookYear = document.getElementById('year').value;
    const bookIsComplete = document.getElementById('isComplete').checked;

    const id = +new Date();
    const bookObject = generateBookObject(id, bookTitle, bookAuthor, bookYear, bookIsComplete);
    
    if (bookObject.isCompleted == true) {
        if (bookshelfIsComplete.length == maksBook) {
        document.dispatchEvent(new Event(BOOKSHELF_COMPLETE_FULL_EVENT));
        } else {
            bookshelfIsComplete.push(bookObject);
            saveData();
            document.dispatchEvent(new Event(ADD_EVENT));
        };
    } else {
        if (bookshelfNotComplete.length == maksBook) {
            document.dispatchEvent(new Event(BOOKSHELF_NOT_COMPLETE_FULL_EVENT));
        } else {
            bookshelfNotComplete.push(bookObject);
            saveData();
            document.dispatchEvent(new Event(ADD_EVENT));
        };
    };
    clearForm();
    document.dispatchEvent(new Event(RENDER_EVENT));
};

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
        for (const book of data) {
            if(book.isCompleted) {
                bookshelfIsComplete.push(book);
            } else {
                bookshelfNotComplete.push(book);
            };
        };
    };
  
    document.dispatchEvent(new Event(RENDER_EVENT));
};

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('input-book');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    };
});

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
};

function clearForm(){
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("year").value = "";
    document.getElementById('isComplete').checked = false;
};

function findIndexFromBookshelfCompleted(bookId) {
    for (const index in bookshelfIsComplete) {
        if (bookshelfIsComplete[index].id === bookId) {
            return index;
        };
    };
    return -1;
};

function findIndexFromBookshelNotfCompleted(bookId) {
    for (const index in bookshelfNotComplete) {
        if (bookshelfNotComplete[index].id === bookId) {
            return index;
        };
    };
    return -1;
};

function removeBookFromBookshelfCompleted(bookId) {
    const bookTarget = findIndexFromBookshelfCompleted(bookId);
  
    if (bookTarget === -1) return;
  
    Swal.fire({
        title: "Apakah anda ingin menghapus data buku?",
        text: "",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Iya",
        denyButtonText: "Tidak",
        showCancelButton: false
    }).then((result) => {
        if(result.value){
            bookshelfIsComplete.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            document.dispatchEvent(new Event(DELETE_EVENT));
        };
    });
};

function removeBookFromBookshelfUnCompleted(bookId) {
    const bookTarget = findIndexFromBookshelNotfCompleted(bookId);
  
    if (bookTarget === -1) return;
  
    Swal.fire({
        title: "Apakah anda ingin menghapus data buku?",
        text: "",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Iya",
        denyButtonText: "Tidak",
        showCancelButton: false
    }).then((result) => {
        if(result.value){
            bookshelfNotComplete.splice(bookTarget, 1);
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
            document.dispatchEvent(new Event(DELETE_EVENT));
        };
    });
};

function addBookToCompleted(bookId) {
    if (bookshelfIsComplete.length != 4) {
        const bookTarget = findIndexFromBookshelNotfCompleted(bookId);
      
        if (bookTarget == -1) return;
      
        bookshelfNotComplete[bookTarget].isCompleted = true;
        bookshelfIsComplete.push(bookshelfNotComplete[bookTarget]);
        bookshelfNotComplete.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    } else {
        document.dispatchEvent(new Event(BOOKSHELF_COMPLETE_FULL_EVENT));
    };
};

function undoBookFromCompleted(bookId) {
    if (bookshelfNotComplete.length != 4) {
        const bookTarget = findIndexFromBookshelfCompleted(bookId);
      
        if (bookTarget == -1) return;
      
        bookshelfIsComplete[bookTarget].isCompleted = false;
        bookshelfNotComplete.push(bookshelfIsComplete[bookTarget]);
        bookshelfIsComplete.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    } else {
        document.dispatchEvent(new Event(BOOKSHELF_NOT_COMPLETE_FULL_EVENT));
    };
};

function makeBook(bookObject) {
    const {id, title, author, year, isCompleted} = bookObject;
  
    const container = document.createElement('div');
    container.className = 'book';
    container.setAttribute('id', `book-${id}`);
    
    const h5 = document.createElement('h5');
    h5.textContent = title;
    container.appendChild(h5);
  
    const elementAuthor = document.createElement('p');
    elementAuthor.textContent = `Penulis: ${author}`;
    container.appendChild(elementAuthor);
  
    const elementYear = document.createElement('p');
    elementYear.textContent = `Tahun: ${year}`;
    container.appendChild(elementYear);
  
    const elemenetAction = document.createElement('div');
    elemenetAction.className = 'book-action';
  
    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.className = 'undo-button';
  
        const iconUndo = document.createElement('i');
        iconUndo.className = 'fa-solid fa-rotate-left';
        undoButton.appendChild(iconUndo);
  
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });
        elemenetAction.appendChild(undoButton);
  
        const trashButton = document.createElement('button');
        trashButton.className = 'trash-button';
  
        const iconTrash = document.createElement('i');
        iconTrash.className = 'fa-solid fa-trash';
        trashButton.appendChild(iconTrash);
        
        trashButton.addEventListener('click', function () {
            removeBookFromBookshelfCompleted(id);
        });
        elemenetAction.appendChild(trashButton);

        container.appendChild(elemenetAction);
    } else {
        const checkButton = document.createElement('button');
        checkButton.className = 'check-button';
  
        const iconCheck = document.createElement('i');
        iconCheck.className = 'fa-solid fa-check';
        checkButton.appendChild(iconCheck);
  
        checkButton.addEventListener('click', function () {
            addBookToCompleted(id);
        });
        elemenetAction.appendChild(checkButton);
  
        const trashButton = document.createElement('button');
        trashButton.className = 'trash-button';
  
        const iconTrash = document.createElement('i');
        iconTrash.className = 'fa-solid fa-trash';
        trashButton.appendChild(iconTrash);
        
        trashButton.addEventListener('click', function () {
            removeBookFromBookshelfUnCompleted(id);
        });
        elemenetAction.appendChild(trashButton);

        container.appendChild(elemenetAction);
    };
  
    return container;
};

function bookshelfEmpty() {
    const div = document.createElement('div');
    div.className = 'books-list-empty';

    const i = document.createElement('i');
    i.className = 'fa-solid fa-face-frown';
    div.appendChild(i);

    const p = document.createElement('p');
    p.textContent = 'Rak Kosong';
    div.appendChild(p);

    return div;
};

function displayBooks(books) {
    const uncompletedList = document.getElementById('books-uncompleted');
    const listCompleted = document.getElementById('books-completed');

    uncompletedList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBook(book);
        if (book.isCompleted) {
            listCompleted.append(bookElement);
        } else {
            uncompletedList.append(bookElement);
        };
    };
    listCompleted.append(bookshelfEmpty());
    
    uncompletedList.append(bookshelfEmpty());

    if(bookshelfIsComplete.length == 0) {
        const elementbookshelfIsComplete = document.getElementsByClassName('beread-book');
        const bookList = elementbookshelfIsComplete[0].getElementsByClassName('book-list');
        const bookListEmpty = bookList[0].getElementsByClassName('books-list-empty');
        bookListEmpty[0].style.display = 'flex';
    } else {
        const elementbookshelfIsComplete = document.getElementsByClassName('beread-book');
        const bookList = elementbookshelfIsComplete[0].getElementsByClassName('book-list');
        const bookListEmpty = bookList[0].getElementsByClassName('books-list-empty');
        bookListEmpty[0].style.display = 'none';
    };

    if(bookshelfNotComplete.length == 0) {
        const elementbookshelfNotComplete = document.getElementsByClassName('unread-book');
        const bookList = elementbookshelfNotComplete[0].getElementsByClassName('book-list');
        const bookListEmpty = bookList[0].getElementsByClassName('books-list-empty');
        bookListEmpty[0].style.display = 'flex';
    } else {
        const elementbookshelfNotComplete = document.getElementsByClassName('unread-book');
        const bookList = elementbookshelfNotComplete[0].getElementsByClassName('book-list');
        const bookListEmpty = bookList[0].getElementsByClassName('books-list-empty');
        bookListEmpty[0].style.display = 'none';
    };
};

document.addEventListener(RENDER_EVENT, function () {
    const books = [...bookshelfIsComplete, ...bookshelfNotComplete];
    displayBooks(books);
});

search.addEventListener("keyup", function(e){
    const searchValue = e.target.value.toLowerCase();
    const books = [...bookshelfIsComplete, ...bookshelfNotComplete];
    const result = books.filter((book) => { return book.title.toLowerCase().includes(searchValue)});
    displayBooks(result);
});