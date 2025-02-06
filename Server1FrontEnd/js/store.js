document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("wordForm").addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      let word = document.getElementById("word").value.trim();
      let definition = document.getElementById("definition").value.trim();

      if (!word || !definition) {
          alert("Please fill in both fields.");
          return;
      }

      try {
          let response = await fetch("/api/store-word", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ word, definition })
          });

          let result = await response.json();
          if (response.ok) {
              alert("Word stored successfully!");
              document.getElementById("wordForm").reset();
          } else {
              alert("Error: " + result.message);
          }
      } catch (error) {
          console.error("Fetch error:", error);
          alert("Failed to store the word. Try again.");
      }
  });
});
