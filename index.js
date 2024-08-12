// Accessing DOM elements
const formInput = document.getElementById("form-control6");
const button = document.getElementById("button-submit");
const defineWord = document.getElementById("definition12");
const pTagPhonetic = document.getElementById("lead");
const ul = document.getElementById("list-unstyled");
const ulForSyn = document.getElementById("synonyms");
const ulForAnt = document.getElementById("antonymns");

const items = ul ? ul.getElementsByTagName("li") : [];
const itemsForSyn = ulForSyn ? ulForSyn.getElementsByTagName("li") : [];
const itemsForAnt = ulForAnt ? ulForAnt.getElementsByTagName("li") : [];

// Event Listener for button click
if (button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();  // Prevent default form submission
        console.log("Button clicked");

        if (formInput) {
            const word = formInput.value.trim();
            console.log("Word to define:", word);
            formInput.style.borderColor = "yellow";

            if (word) {
                getWordDefinition(word);
            }
        }
    });
}

// Function to fetch word data from the API
function getWordDefinition(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(data => {
            console.log("API data:", data);
            const firstArray = data[0];
            updateHtmlWithApiData(firstArray);
            emptyOutList();
            putDataInList(0, firstArray);
            putDataForSynonyms(0, firstArray);
            putDataForAntonyms(0, firstArray);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

// Function to update HTML with word data
function updateHtmlWithApiData(data) {
    if (defineWord) {
        defineWord.innerHTML = "Word: " + (data.word || 'N/A');
    }
    if (pTagPhonetic) {
        pTagPhonetic.innerHTML = "Phonetics: " + "<b>" + (data.phonetic || 'N/A') + "</b>";
    }
}

// Function to clear list items
function emptyOutList() {
    if (items) {
        for (let i = 0; i < items.length; i++) {
            items[i].innerHTML = "";
        }
    }
}

// Function to populate list with definitions
function putDataInList(amount, data) {
    const definitions = data.meanings[amount]?.definitions || [];
    if (items) {
        for (let i = 0; i < definitions.length && i < 6; i++) {
            if (items[i]) {
                const definition = definitions[i];
                items[i].innerHTML = (i === 0 && data.meanings[amount]?.partOfSpeech ? 
                    "Part of Speech: " + data.meanings[amount].partOfSpeech + "<br/>" : "") +
                    "<b>" + (i + 1) + "</b>: " + definition.definition;
                    
                if (definition.example) {
                    items[i].innerHTML += "<br/><b>Example:</b> <i>" + definition.example + "</i>";
                }
            }
        }
    }
}

// Function to populate list with synonyms
function putDataForSynonyms(amount, data) {
    console.log("Inside loop synonyms");
    const synonyms = data.meanings[amount]?.synonyms || [];
    if (itemsForSyn) {
        for (let i = 0; i < synonyms.length && i < 6; i++) {
            if (itemsForSyn[i]) {
                itemsForSyn[i].innerHTML = (i === 0 ? "<i>Synonyms:</i><br/>" : "") + synonyms[i];
            }
        }
    }
}

// Function to populate list with antonyms
function putDataForAntonyms(amount, data) {
    console.log("Inside antonyms function");
    const antonyms = data.meanings[amount]?.antonyms || [];
    if (itemsForAnt) {
        for (let i = 0; i < antonyms.length && i < 6; i++) {
            if (itemsForAnt[i]) {
                itemsForAnt[i].innerHTML = (i === 0 ? "<i>Antonyms:</i><br/>" : "") + antonyms[i];
            }
        }
    }
}