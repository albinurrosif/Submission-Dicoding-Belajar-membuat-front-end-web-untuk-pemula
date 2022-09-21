const UNCOMPLETED_LIST_BOOKSHELF_ID = 'incompleteBookshelfList';
const COMPLETED_LIST_BOOKSHELF_ID = 'completeBookshelfList';
const BOOK_ITEMID = 'itemId';

//menambahkan buku
function addBook() {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
  const BookTitle = document.getElementById('inputBookTitle').value;
  const BookAuthor = document.getElementById('inputBookAuthor').value;
  const BookYear = document.getElementById('inputBookYear').value;
  const BookIsComplete = document.getElementById('inputBookIsComplete').checked;

  const book = makeBookShelf(BookTitle, BookAuthor, BookYear, BookIsComplete);

  /* web storage */
  // menambahkan buku
  const bookObject = composeBookObject(BookTitle, BookAuthor, BookYear, BookIsComplete);
  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  if (BookIsComplete) {
    listCompleted.append(book);
  } else {
    listUncompleted.append(book);
  }

  updateDataToStorage();
}

//mengubah tombol masukan buku
const checkbox = document.getElementById('inputBookIsComplete');
let check = false;

checkbox.addEventListener('change', function () {
  if (checkbox.checked) {
    check = true;
    document.querySelector('span').innerText = 'Selesai dibaca';
  } else {
    check = false;
    document.querySelector('span').innerText = 'Belum selesai dibaca';
  }
});

//membuat element html
function makeBookShelf(title, author, year, isCompleted) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerHTML = `Penulis: <span id="author">` + author + `</span>`;

  const textYear = document.createElement('p');
  textYear.innerHTML = `Tahun: <span id="year">` + year + `</span>`;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  if (isCompleted) {
    buttonContainer.append(uncompletedgreenButton());
  } else {
    buttonContainer.append(completedgreenButton());
  }
  buttonContainer.append(redButton());

  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textTitle, textAuthor, textYear, buttonContainer);

  return container;
}

//dasar membuat tombol
function createButton(buttonTypeClass, buttonText, eventListener) {
  const button = document.createElement('button');
  button.classList.add(buttonTypeClass);
  button.innerText = buttonText;
  button.addEventListener('click', function (event) {
    eventListener(event);
  });
  return button;
}

//tombol selesai dibaca
function completedgreenButton() {
  return createButton('green', 'Selesai dibaca', function (event) {
    addBookToCompleted(event.target.parentElement.parentElement);
  });
}

//tombol hapus buku
function redButton() {
  return createButton('red', 'Hapus buku', function (event) {
    removeBookFromCompleted(event.target.parentElement.parentElement);
  });
}

//tombol belum selesai dibaca
function uncompletedgreenButton() {
  return createButton('green', 'Belum selesai dibaca', function (event) {
    undoBookFromCompleted(event.target.parentElement.parentElement);
  });
}

//memindahkan buku dari belum selesai ke selesai dibaca
function addBookToCompleted(bookElement) {
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
  const bookTitle = bookElement.querySelector('h3').innerText;
  const bookAuthor = bookElement.querySelector('span#author').innerText;
  const bookYear = bookElement.querySelector('span#year').innerText;
  const newBookShelf = makeBookShelf(bookTitle, bookAuthor, bookYear, true);

  /* web storage */
  // memperbarui buku menjadi ‘completed’
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBookShelf[BOOK_ITEMID] = book.id;

  listCompleted.append(newBookShelf);
  bookElement.remove();

  updateDataToStorage();
}

//menghapus buku
function removeBookFromCompleted(bookElement) {
  /* web storage */
  // menghapus data
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);

  bookElement.remove();

  updateDataToStorage();
}

//memindahkan buku dari selesai ke belum selesai dibaca
function undoBookFromCompleted(bookElement) {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
  const bookTitle = bookElement.querySelector('h3').innerText;
  const bookAuthor = bookElement.querySelector('span#author').innerText;
  const bookYear = bookElement.querySelector('span#year').innerText;
  const newBookShelf = makeBookShelf(bookTitle, bookAuthor, bookYear, false);

  /* web storage */
  // memperbarui buku menjadi ‘not completed’
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBookShelf[BOOK_ITEMID] = book.id;

  listUncompleted.append(newBookShelf);
  bookElement.remove();

  updateDataToStorage();
}

//fitur search
const searchButton = document.getElementById('searchSubmit');

searchButton.addEventListener('click', (event) => {
  event.preventDefault();

  const bookTitleInput = document.getElementById('searchBookTitle').value.toLowerCase();

  const booksList = document.querySelectorAll('article');

  for (book of booksList) {
    const title = book.firstElementChild.textContent.toLowerCase();

    if (title.includes(bookTitleInput)) {
      book.style.display = 'block';
    } else {
      book.style.display = 'none';
    }
  }
});
