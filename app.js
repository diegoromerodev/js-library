// responsive grid default
let gridSize = 3

// STORE ALL BOOKS
const myLibrary = JSON.parse(localStorage.getItem('books')) || [{
    author: "Stephen King",
    id: "ID1613043951346",
    pages: "571",
    read: true,
    style: "artistic",
    title: "The Shining"
    }]

class Book {
    constructor (title, author, pages = 0, read = false, style){
        this.id = "ID" + Math.round(Date.now() * 2 * Math.random())
        this.title = title
        this.author = author
        this.pages = pages
        this.read = read
        this.style = style
    }
}

function toggleRead(id){
    const book = myLibrary.find(el => el.id === id)
    book.read = !book.read
    if (book.read){
        document.querySelector(`#${id} span`).classList.remove('hidden')
    } else {
        document.querySelector(`#${id} span`).classList.add('hidden')
    }
    localStorage.setItem('books', JSON.stringify(myLibrary))
}

function addBookToLibrary(book) {
    myLibrary.push(book)
    createBooks(myLibrary)
    if (myLibrary.length % gridSize) createBlankBooks(myLibrary.length % gridSize)
}

function deleteBook(id) {
    const bookToDelete = myLibrary.findIndex(el => el.id === id)
    myLibrary.splice(bookToDelete, 1)
    createBooks(myLibrary)
    if (myLibrary.length % gridSize) createBlankBooks(myLibrary.length % gridSize)
}

// SELECT INPUT FROM FIELDS
// select submit button
const submitBtn = document.querySelector('#submit')
// select book info fields
const titleField = document.querySelector('#title')
const authorField = document.querySelector('#author')
const pagesField = document.querySelector('#pages')
const readBool = document.querySelector('#read')
// select books holder
const booksParent = document.querySelector('#all-books')
// select book creation form
const creationForm = document.querySelector('#create-book')
// select create buttons
document.querySelector('#create-btn').addEventListener('click', () => {
    creationForm.classList.remove('hidden')
})
// select cancel button
document.querySelector('#cancel').addEventListener('click', (e) => {
    e.preventDefault()
    creationForm.classList.add('hidden')
})

submitBtn.onclick = function(e) {
    e.preventDefault()
    // check if empty submit
    if (!titleField.value || !authorField.value) return;
    // call book creator with input values
    const newBook = new Book(titleField.value, authorField.value, pagesField.value, readBool.checked, pickStyle())
    addBookToLibrary(newBook)
    // clear input
    titleField.value = ''
    authorField.value = ''
    pagesField.value = ''
    readBool.checked = false
    creationForm.classList.add('hidden')
}

let lastRandIx = 1;

function pickStyle() {
    // class styles to pick
    const styleClass = [' ', 'artistic', 'peaceful', 'joy', 'sunshine']
    // choose index
    const randIx = Math.floor(Math.random() * styleClass.length)
    if (randIx === lastRandIx) {
        return pickStyle()
    }
    lastRandIx = randIx
    return styleClass[randIx]
}

// CREATE NEW SINGLE BOOK HTML STRUCTURE
function createBooks(arr) {
    localStorage.setItem('books', JSON.stringify(arr))
    booksParent.innerHTML = ''
    for (let book of arr){
        const {id, title, author, pages, read, style} = book
        const nameArr = author.split(' ')
        // create a template string to save some time
        const singleBook = `
        <div class="single-book" id="${id}">
            <div class="book-thumb ${style}">
                <p class="title">${title}</p>
                <p class="author">${nameArr[0][0] + '. ' + nameArr[nameArr.length - 1]}</p>
            </div>
            <span class="read ${read ? '' : 'hidden'}">FINISHED</span>
            <div class="book-options">
                <div class="book-info">
                    <h3 class="row-title">${title}</h3>
                    <div class="row-info">
                        <p class="row-author"><em>By ${author}</em></p>
                        <p class="row-pages"><small>${pages} pages</small></p>
                    </div>
                </div>
                <div class="action-btn">
                    <button class="btn-read btn"><i class="fas fa-check"></i></button>
                    <button class="btn-del btn"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>`
    
        // append book to parent
        booksParent.insertAdjacentHTML("afterbegin", singleBook)
        document.querySelector(`#${id} button.btn-read.btn`).addEventListener('click', () => toggleRead(id))
        document.querySelector(`#${id} button.btn-del.btn`).addEventListener('click', () => deleteBook(id))
    }
}

//addBookToLibrary(new Book("The Bible", "Jesus H Christ", 1050, true))
//addBookToLibrary(new Book("The Shining", "Stephen King", 925, true, 'artistic'))

function createBlankBooks(amount){
    for (let i = 0; i < gridSize - amount; i++){
        const singleBook = `
        <div class="single-book blank-book">
            <i class="fas fa-plus-circle"></i>
        </div>`
    
        // append book to parent
        booksParent.insertAdjacentHTML("beforeend", singleBook)
    }
    document.querySelectorAll('.blank-book').forEach(el => el.addEventListener('click', () => creationForm.classList.remove('hidden')))
}


// responsive query for grid size

function setGridSize() {
    if(window.innerWidth < 1000){
        gridSize = 2
        createBooks(myLibrary)
        createBlankBooks(myLibrary.length % 2)
    } else {
        gridSize = 3
        createBooks(myLibrary)
        createBlankBooks(myLibrary.length % 3)
    }
}

window.addEventListener('resize', setGridSize)
setGridSize()

createBooks(myLibrary)
if(myLibrary.length) createBlankBooks(myLibrary.length % gridSize);