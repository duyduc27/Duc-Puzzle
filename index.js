const pieces = document.querySelectorAll('.piece');
const dropZones = document.querySelectorAll('.drop-zone');
const notification = document.getElementById('notification');
const resetButton = document.getElementById('resetButton');
const successMessage = document.getElementById('successMessage');
const formContainer = document.getElementById('winnerForm');

//Drag and Drop event listeners
pieces.forEach(piece => {
    piece.addEventListener('dragstart', dragStart);
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', dragOver);
    zone.addEventListener('dragleave', dragLeave);
    zone.addEventListener('drop', drop);
});

// Reset button listener
resetButton.addEventListener('click', resetPuzzle)

function dragStart(e){
    // Allow drag
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e){
    // Allow drop
    e.preventDefault();
    e.target.style.backgroundColor = 'lightblue'; // Add highlight
}

function drop(e){
    // Ensure we are interacting with a valid drop zone
    if (!e.target.classList.contains('drop-zone')) return;

    // Retrieve piece Id
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);

    if (!e.target.hasChildNodes()){
        // Place piece in drop zone
        e.target.appendChild(piece);
        // Remove dash style
        e.target.style.border = 'none';
        e.target.style.backgroundColor = ''; // Reset highlight
        checkCompletion(); // Check if complete
    }
}

function dragLeave(e){
    e.target.style.backgroundColor = ''; // Remove highlight
}

function resetPuzzle(){
    // Reset notification
    notification.style.display = 'none' // Hide incorrect order message

    // Reset successMessage
    successMessage.style.display = 'none'; // Hide success message

    // Reset submit form
    formContainer.style.display = 'none'; // Hide success submit form

    // Reset drop zones and re-enable borders
    dropZones.forEach(zone => {
        zone.innerHTML = '';
        zone.style.border = '2px dashed #ccc';
        zone.style.backgroundColor = '';
    })

    // Move pieces back to the starting area
    pieces.forEach(piece => {
        document.querySelector('.puzzle-pieces').appendChild(piece);
    })

    // Shuffle the images after resetting
    shuffleImages();    
}

function checkCompletion(){
    let isComplete = true;

    dropZones.forEach((zone, index) => {
        const child = zone.children[0];
        if(!child || child.id !== `piece${index + 1}`){
            isComplete = false;
        }
    });

    if(isComplete){
        showSuccess();
    } else if (Array.from(dropZones).every(zone => zone.hasChildNodes())){
        showIncorrectOrder();
    }
}

function showSuccess(){
    notification.style.display = 'none' // Hide incorrect order message

    // Clear any previous success messages
    successMessage.innerHTML = '<img src="https://i.pinimg.com/originals/93/25/8f/93258fcc19aebb334cda7651f03dcb8e.gif" alt="Surprise Image">';

    successMessage.style.display = 'block'; // Display success message

    // Make an AJAX call to the CloudPage to update the count
    fetch("https://mct2bm4dwyh625p8dz4hnhbc131q.pub.sfmc-content.com/zanw2avrw2c", {
        method: "GET"
    })
    .then(response => response.text())
    .then(message => {
        // Display the congrats message from AMPscript
        document.getElementById('successMessage').innerHTML += `${message}`;
        // Scroll to the success message
    
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    })
    .catch(error => console.error('Error: ', error));


    // Show the winner form
    const winnerForm = document.getElementById('winnerForm');
    winnerForm.style.display = 'block';

    // Populate the timestamp
    document.getElementById('timestamp').value = new Date().toISOString();
}

function showIncorrectOrder() {
    notification.style.display = 'block'; // Show incorrect order message
}

function shuffleImages(){
    const container = document.getElementById('puzzlePieces');
    const images = Array.from(container.children);
    
    // Fisher-Yates Shuffle Algorithm
    for(let i = images.length -1; i> 0; i-- ){
        const j = Math.floor(Math.random() * (i +1) );
        [images[i],  images[j] ] = [images[j],  images[i]];
    }

    images.forEach(image => container.appendChild(image));
}

// Call the function after the page loads
window.onload = shuffleImages;