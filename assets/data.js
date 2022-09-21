const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event('ondatasaved'));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) books = data;

  document.dispatchEvent(new Event('ondataloaded'));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composeBookObject(title, author, year, isCompleted) {
  return {
    id: +new Date(),
    title,
    author,
    year: parseInt(year),
    isCompleted,
  };
}

function findBook(bookId) {
  for (book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (book of books) {
    if (book.id === bookId) return index;

    index++;
  }

  return -1;
}

function refreshDataFromBookShelf() {
  const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
  let listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

  for (book of books) {
    const newBookShelf = makeBookShelf(book.title, book.author, book.year, book.isCompleted);
    newBookShelf[BOOK_ITEMID] = book.id;

    if (book.isCompleted) {
      listCompleted.append(newBookShelf);
    } else {
      listUncompleted.append(newBookShelf);
    }
  }
}
