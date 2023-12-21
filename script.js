// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwMlqQ63_8YLE7Gm-HTeFxGjA8WMRkT10",
    authDomain: "searchai-a4b8d.firebaseapp.com",
    projectId: "searchai-a4b8d",
    storageBucket: "searchai-a4b8d.appspot.com",
    messagingSenderId: "301180826333",
    appId: "1:301180826333:web:75150fced3537601326134",
    measurementId: "G-5JBBEE3HW9",
    databaseURL: "https://searchai-a4b8d-default-rtdb.asia-southeast1.firebasedatabase.app", // Update this line
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
const database = getDatabase(app);

async function getDataFromFirebase() {
    const aiLinksRef = ref(database, 'aiLinks');
    try {
        const snapshot = await get(aiLinksRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            // Transform data into an array
            const dataArray = Object.keys(data).map(key => ({ ...data[key], id: key }));
            return dataArray;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return []; // Ensure that you return a default value in case of an error
    }
}

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    // Check if the pressed key is Enter (key code 13)
    if (event.key === "Enter") {
        // Call the search function
        search();
    }
});

async function search() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; // Clear previous results

    const dataAi = await getDataFromFirebase();

    for (const entry of dataAi) {
        const keywords = entry.keywords.map(keyword => keyword.toLowerCase());

        // Check if at least one word in the user input is present in at least one keyword for an entry
        const atLeastOneWordPresent = searchInput.split(' ').some(word => {
            return keywords.some(keyword => {
                return keyword.includes(word);
            });
        });
        
        console.log(`Entry: ${JSON.stringify(entry)}, At Least One Word Present: ${atLeastOneWordPresent}`);

        if (atLeastOneWordPresent) {
            const entryContainer = document.createElement("div");
            entryContainer.classList.add("entry-container");

            entryContainer.addEventListener("click", () => {
                window.open(entry.link, "_blank");
            });

            const imageContainer = document.createElement("div");
            imageContainer.classList.add("image-container");

            const image = document.createElement("img");
            image.src = getImagePath(entry.name); // Assuming a function to get the image path
            image.alt = entry.keywords.join(", "); // Use all keywords as alt text

            imageContainer.appendChild(image);
            entryContainer.appendChild(imageContainer);

            const textContainer = document.createElement("div");
            textContainer.classList.add("text-container");

            const nameElement = document.createElement("h3");
            nameElement.textContent = entry.name;

            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = entry.description;

            textContainer.appendChild(nameElement);
            textContainer.appendChild(descriptionElement);

            entryContainer.appendChild(textContainer);

            resultDiv.appendChild(entryContainer);// Add a horizontal line between entries
            

        }
    }

    if (resultDiv.children.length === 0) {
        resultDiv.innerHTML = '<p class="no-results-message">Unfortunately, no AIs were found.</p>';
    }
}

document.getElementById("searchButton").addEventListener("click", search);
// Function to construct image path based on multiple keywords
function getImagePath(name) {

  return `img/${name}.png`;
}



