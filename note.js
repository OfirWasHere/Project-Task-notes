
setData()
const localNotes = setData();

// Setting up the Local Storage, if local storage doesn't exist ==> it will Create a new empty Array inside the local storage. else it will take the existing one.
function setData() {
    if (localStorage.getItem("localArray") === null) {
        return localStorage.setItem("localArray", JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem("localArray"));
}

// Updating the data inside the local Storage. (calling/using this function after removing or adding a new note)
function setNewData(data) {
    localStorage.setItem("localArray", JSON.stringify(data))
}

// Loading notes from local Storage on page-up or refresh.
onPageUp()
function onPageUp() {
    localArray = JSON.parse(localStorage.getItem("localArray"))
    let index = 0;
    for (const item of localArray) {
        index++
        createNote(item, index)
    }
}

// note handler, This is how we get user inputs and start working with them.
function newNoteHandler() {
    // Prevent page from refresh
    event.preventDefault()

    // Getting DOMS and putting them into an object called "current note".
    const titleBox = document.getElementById("titleBox").value;
    const descriptionBox = document.getElementById("descriptionBox").value;
    const dateBox = document.getElementById("dateBox").value;
    const timeBox = document.getElementById("timeBox").value;

    //The note object the user inputs 
    const currentNote = {
        title: titleBox,
        description: descriptionBox,
        date: dateBox,
        time: timeBox,
    }

    // Sending DOMS to validation
    // If Validation is true ==> the note will be sent to LocalStorage, and all form inputs will reset.
    if (validation(currentNote)) {
        if (localNotes.length <= 0) {
            currentNote.index = 0;
        } else {
            currentNote.index = localNotes.length;
        }
        localNotes.push(currentNote);
        setNewData(localNotes)
        createNote(currentNote)
        resetInputs()
    }
}

// validation of the current note
function validation(currentNote) {

    // Title validation
    if (currentNote.title === "") {
        titleBox.style.backgroundColor = "Pink"
        titleBox.placeholder = " Missing Title"
        return;
    }
    titleBox.style.backgroundColor = ""

    //*======================* Date validation ======================== */

    if (currentNote.date.length === 0) {
        dateBox.style.backgroundColor = "Pink"
        alert("Missing Date!")
        return;
    }

    if (getDate() > currentNote.date) {
        alert("Date cannot be before today's date!")
        // Just to make sure dates are correct
        console.log(`${getDate()} > ${currentNote.date}`)
        return;
    }
    dateBox.style.backgroundColor = ""

    //*======================* End of Date validation ======================== */

    //time validation
    if (currentNote.time.length === 0) {
        timeBox.style.backgroundColor = "Pink"
        alert("Missing Time!")
        return;
    }
    timeBox.style.backgroundColor = ""

    return true;
}

// Create note with template and put it on user display
function createNote(tempNote) {

    let index = tempNote.index;
    let title = tempNote.title;
    let description = tempNote.description;
    let date = tempNote.date;
    let time = tempNote.time;

    //holding the parent elements (divs) so we can add elements to it
    const parentDiv = document.getElementById("notePrintDiv");

    // Div parent with styling
    const noteDiv = document.createElement("div");
    noteDiv.setAttribute("class", "col-xxl-3 col-xl-4 col-lg-4 md-6 col-sm-6");
    parentDiv.appendChild(noteDiv)

    //Div background (its parent as well)
    const backgroundImageDiv = document.createElement("div");
    backgroundImageDiv.setAttribute("class", "backgroundImage");
    noteDiv.appendChild(backgroundImageDiv);

    // title div which is appended to 
    const divTitle = document.createElement("div")
    divTitle.setAttribute("id", "title");
    divTitle.innerHTML = title;
    backgroundImageDiv.appendChild(divTitle);

    // "X" button which is appended to the title
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = `<span class="material-symbols-outlined"> delete_forever </span>`;
    closeBtn.setAttribute("id", "deleteButton");
    closeBtn.setAttribute("onclick", `deleteNote(this.parentElement.parentElement.parentElement,${index})`)
    divTitle.appendChild(closeBtn);

    // Div Description 
    const descriptionDiv = document.createElement("div");
    descriptionDiv.setAttribute("id", "noteDescription")
    descriptionDiv.innerHTML = description;
    backgroundImageDiv.appendChild(descriptionDiv);

    // Div date 
    const dateDiv = document.createElement("div");
    dateDiv.setAttribute("id", "date");
    dateDiv.innerHTML = date;
    backgroundImageDiv.appendChild(dateDiv);

    // Div time 
    const divTime = document.createElement("div");
    divTime.setAttribute("id", "hour");
    divTime.innerHTML = time;
    backgroundImageDiv.appendChild(divTime)
};

// Delete function, remove both from Visual display and removes from Local storage
function deleteNote(visualNote, index) {
    localNotes.splice(index, 1);
    updateNotesIndex(localNotes);
    setNewData(localNotes);
    visualNote.remove();
    location.reload();
};

// This is how I make sure the index is in the correct place and updated
function updateNotesIndex(localNotes) {
    for (const item of localNotes) {
        if (item.index !== localNotes.indexOf(item)) {
            item.index = localNotes.indexOf(item)
        }
    }
};

// Resets the form inputs
function resetInputs() {
    document.getElementById("mainForm").reset();
};

// Getting todays date in the following format "00/00/0000",
function getDate() {
    var today = new Date()
    const date = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    const result = date.toISOString().split('T')[0];
    return (result);
};



