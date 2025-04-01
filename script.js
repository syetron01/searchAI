import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

//Please don't hack this, I did this on purpose for my own learnings on other stuffs...
const firebaseConfig = {
    apiKey: "AIzaSyAwMlqQ63_8YLE7Gm-HTeFxGjA8WMRkT10",
    authDomain: "searchai-a4b8d.firebaseapp.com",
    projectId: "searchai-a4b8d",
    storageBucket: "searchai-a4b8d.appspot.com",
    messagingSenderId: "301180826333",
    appId: "1:301180826333:web:75150fced3537601326134",
    measurementId: "G-5JBBEE3HW9",
    databaseURL: "https://searchai-a4b8d-default-rtdb.asia-southeast1.firebasedatabase.app", 
  };
  

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
const database = getDatabase(app);

async function getDataFromFirebase() {
    const aiLinksRef = ref(database, 'aiLinks');
    try {
        const snapshot = await get(aiLinksRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const dataArray = Object.keys(data).map(key => ({ ...data[key], id: key }));
            return dataArray;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        search();
    }
});

async function search() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = ""; 
    const dataAi = await getDataFromFirebase();

    for (const entry of dataAi) {
        const keywords = entry.keywords.map(keyword => keyword.toLowerCase());

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
            image.src = getImagePath(entry.name); 
            image.alt = entry.keywords.join(", ");

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

            resultDiv.appendChild(entryContainer);
            

        }
    }

    if (resultDiv.children.length === 0) {
        resultDiv.innerHTML = '<p class="no-results-message">Unfortunately, no AIs were found.</p>';
    }
}

document.getElementById("searchButton").addEventListener("click", search);
function getImagePath(name) {

  return `img/${name}.png`;
}



