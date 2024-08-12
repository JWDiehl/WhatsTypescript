// Import stylesheets
import './style.css';
import axios from 'axios';

// Get the form element and result container with non-null assertions
const form = document.querySelector<HTMLFormElement>('#defineform');
const resultContainer = document.querySelector<HTMLDivElement>('#results');

if (form && resultContainer) {
  form.onsubmit = async (event: Event) => {
    event.preventDefault(); // Prevent form from reloading the page

    // Extract the word from the form
    const formData = new FormData(form);
    const text = formData.get('defineword') as string;

    if (text) {
      try {
        // Make a request to the Dictionary API
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);

        // Extract definitions from the response with optional chaining
        const meanings = response.data[0]?.meanings || [];
        const definitions = meanings.flatMap((meaning: any) =>
          meaning.definitions.map((def: any) => def.definition)
        );

        // Update the result container with definitions
        resultContainer.innerHTML = `
          <h1>Definition of "${text}"</h1>
          <ul class="list-unstyled">
            ${definitions.length > 0
              ? definitions.map((definition: string) => `<li>${definition}</li>`).join('')
              : '<li>No definitions found.</li>'
            }
          </ul>
        `;
      } catch (error) {
        // Handle errors (e.g., word not found)
        resultContainer.innerHTML = `
          <h1>Error</h1>
          <p>Could not find the word "${text}". Please try another word.</p>
        `;
        console.error('Error fetching definitions:', error);
      }
    } else {
      // Handle case where no word is provided
      resultContainer.innerHTML = `
        <h1>Error</h1>
        <p>No word was provided. Please enter a word to define.</p>
      `;
    }
  };
} else {
  console.error('Form or result container element not found.');
}