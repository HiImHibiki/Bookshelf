const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList"; 
const BOOK_ITEMID = "itemId";

function addBook() {
    const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);

    const textTitle = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    // ===
    const bookObject = composeBookObject(textTitle, textAuthor, year, isCompleted);
    const book = makeBook(textTitle, "Author: " + textAuthor, "Year: " + year, isCompleted);
  
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    // ===

    if (isCompleted) {
        completedBookList.append(book);
    }
    else {
        uncompletedBookList.append(book);
    }
    updateDataToStorage();
}

function makeBook(title, author, year, isCompleted) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = author;
 
    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = year;
 
    const textContainer = document.createElement("article");
    textContainer.classList.add("book-item")

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");

    if(isCompleted){
        buttonContainer.append(createUndoButton(),createTrashButton());
    } else {
        buttonContainer.append(createCheckButton(),createTrashButton());
    }

    textContainer.append(textTitle, textAuthor, textTimestamp, buttonContainer);
    
    return textContainer;
}

function createButton(buttonTypeClass , eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    if (buttonTypeClass === "check-button") {
        button.innerText = "Completed"
    }
    if (buttonTypeClass === "undo-button") {
        button.innerText = "Undo"
    }
    if (buttonTypeClass === "trash-button") {
        button.innerText = "Delete"
    }
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}


function addTaskToCompleted(taskElement) {
    taskElement.remove();
} 

function createCheckButton() {
    return createButton("check-button", function(event){
        addTaskToCompleted(event.target.closest(".book-item"));
    });
}

function addTaskToCompleted(taskElement) {
    const taskTitle = taskElement.querySelector(".book-item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book-item > p").innerText;
    const taskTimestamp = taskElement.querySelector(".book-item > p").innerText;
    
    // ===
    const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, true);
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;
    // ===

    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
    listCompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function removeTaskFromCompleted(taskElement) {
    // ===
    const bookPosition = findBookIndex(taskElement[BOOK_ITEMID]);
    books.splice(bookPosition, 1);
    // ===

    console.log(taskElement);
    taskElement.remove();
    updateDataToStorage();
}

function createTrashButton() {
    return createButton("trash-button", function(event){
        removeTaskFromCompleted(event.target.closest(".book-item"));
    });
}

function undoTaskFromCompleted(taskElement){
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
    const taskTitle = taskElement.querySelector(".book-item > h3").innerText;
    const taskAuthor = taskElement.querySelector(".book-item > p").innerText;
    const taskTimestamp = taskElement.querySelector(".book-item > p").innerText;
 
    const newBook = makeBook(taskTitle, taskAuthor, taskTimestamp, false);

    // ===
    const book = findBook(taskElement[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;
    // ===
 
    listUncompleted.append(newBook);
    taskElement.remove();

    updateDataToStorage();
}

function createUndoButton() {
    return createButton("undo-button", function(event){
        undoTaskFromCompleted(event.target.closest(".book-item"));
    });
}

document.getElementById("searchBook").addEventListener("submit", (e)=>{
    e.preventDefault(); //biar ga reload
    const container = document.getElementById("searchBookContainer");
    container.innerHTML = "";
    addFindBook();
})

function addFindBook() {
    const container = document.querySelector("#searchBookContainer");
    const bookTitle = document.getElementById("searchBookTitle").value;
    const searchBook = findBookTitle(bookTitle);

    console.log(container);

    if (!searchBook) {
        console.log("Ga ketemu");
    }
    else {
        const book = makeFindBook(searchBook);
        container.append(book);
    }
}

function makeFindBook(book) {

    const textTitle = document.createElement("h3");
    textTitle.innerText = book.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Author: " + book.author;
 
    const textTimestamp = document.createElement("p");
    textTimestamp.innerText = "Year: " + book.year;

    const status = document.createElement("p");
    if (book.isCompleted) {
        status.innerText = "Status: Completed";
    }
    else {
        status.innerText = "Status: Incomplete";
    }
 
    const textContainer = document.createElement("article");
    textContainer.classList.add("book-item")

    textContainer.append(textTitle, textAuthor, textTimestamp);
    
    return textContainer;
}