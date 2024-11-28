//DECLARATION OF GLOBAL VARIABLES
let listNotes = [];
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let currentItem = null;

//--------------------------------------------------------------------------------------/ᐠ - ˕ -マ
//PROGRAM
window.onload = () => {
    // Check if a value stored in localStorage with key "listNotes" exists
    if (localStorage.getItem("listNotes")) 
    {
        listNotes = JSON.parse(localStorage.getItem("listNotes"));
        renderNotes(); 
    }

    // Event to create a new note
    document.getElementById("Create").addEventListener("click", () => 
    {
        const titleNota = document.getElementById("Title").value.trim();
        const descripcionNota = document.getElementById("Description").value.trim();

        if (!titleNota || !descripcionNota) 
        {
            alert("Please fill in both fields (title and description).");
            return;
        }

        const nuevaNota = //Note JSON format
        {
            title: titleNota,
            descripcion: descripcionNota,
            hour: new Date().toLocaleTimeString(),
            positionX: 40,
            positionY: 50
        };

        listNotes.push(nuevaNota);
        localStorage.setItem("listNotes", JSON.stringify(listNotes));
        document.getElementById("Title").value = "";
        document.getElementById("Description").value = "";
        renderNotes();
    });
};

//--------------------------------------------------------------------------------------/ᐠ - ˕ -マ
//FUNCTIONS
//Function to render the notes
function renderNotes() 
{
    const list = document.getElementById("list");
    list.innerHTML = ""; 

    listNotes.forEach((nota, index) => 
    {
        const li = document.createElement("li");
        li.style.position = "absolute"; 
        li.style.left = nota.positionX+'px'; 
        li.style.top = nota.positionY+'px';  

        li.innerHTML = '<strong>'+nota.title+'</strong>: '+nota.descripcion+' <em>('+nota.hour+')</em><button class="edit" data-index="'+index+'">Edit</button><button class="delete" data-index='+index+'">Delete</button>';
        li.style.cursor = "grab";

        //Events for picking up, moving and dropping notes
        li.addEventListener("mousedown", (e) => 
        {
            isDragging = true;
            currentItem = li; 
            offsetX = e.clientX - li.offsetLeft;
            offsetY = e.clientY - li.offsetTop;
            li.style.cursor = "grabbing";
            if (isDragging && currentItem) 
            {
                playSound();
            }
        });

        document.addEventListener("mousemove", (e) => 
        {
            if (isDragging && currentItem) 
            {
                currentItem.style.left = e.clientX - offsetX + "px";
                currentItem.style.top = e.clientY - offsetY + "px";
            }
        });

        document.addEventListener("mouseup", () => 
        {
            if (isDragging && currentItem) 
            {
                playSound();
                isDragging = false;
                const index = Array.from(list.childNodes).indexOf(currentItem);
                listNotes[index].positionX = parseInt(currentItem.style.left);
                listNotes[index].positionY = parseInt(currentItem.style.top);
                localStorage.setItem("listNotes", JSON.stringify(listNotes));
                currentItem.style.cursor = "grab";
                currentItem = null;
            }
        });

        //Modify and delete events
        const botonEdit = li.querySelector(".edit");
        botonEdit.addEventListener("click", () => 
        {
            const nuevoTitle = prompt("New title:", nota.title);
            const nuevaDescription = prompt("New description:", nota.descripcion);

            if (nuevoTitle !== null && nuevaDescription !== null) 
            {
                listNotes[index].title = nuevoTitle;
                listNotes[index].descripcion = nuevaDescription;
                listNotes[index].hour = new Date().toLocaleTimeString(); 
                localStorage.setItem("listNotes", JSON.stringify(listNotes));
                renderNotes();  
            }
        });

        const botonDelete = li.querySelector(".delete");
        botonDelete.addEventListener("click", () => 
        {
            if (confirm("Are you sure you want to delete this note?")) 
            {
                listNotes.splice(index, 1); 
                localStorage.setItem("listNotes", JSON.stringify(listNotes));
                renderNotes(); 
            }
        });

        list.appendChild(li);
    });
}

//Function that starts the sound
function playSound() 
{
    var KeySound = new Audio('Sounds/paper.mp3');
    KeySound.play();
    KeySound.volume = 1.0;
}
