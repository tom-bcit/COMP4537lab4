import { messages } from '../lang/en/messages.js';

class WordSearch {
    constructor(formId, feedbackId) {
        this.form = document.getElementById(formId);
        this.feedback = document.getElementById(feedbackId);
        
        if (this.form) {
            this.form.addEventListener("submit", (event) => this.handleSubmit(event));
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        let word = document.getElementById("word").value.trim();

        if (!word ) {
            alert("Please fill in field.");
            return;
        }

        try {
            let response = await fetch("/api/search-word?word=${word}");

            let result = await response.json();
            if (response.ok) {
              const word = result.word;
              const definition = result.definition;
              const requestNumber = result.requestNumber;
              this.updateResponseText(word, definition);
            } else {
                const requestNumber = result.requestNumber;
                const error = result.error;
                this.updateFeedback(error, "red");
            }
        } catch (error) {
            this.updateFeedback(messages.feedbackSearch, "red");
        }
    }

    updateResponseText(word, definition) {
        const responseText = document.getElementById("response");
        responseText.innerText = `${word}: ${definition}`;
    }
}
class Ui {
  static updateUserStrings() {
    document.getElementById("wordLabel").innerText = messages.wordLabel;
    document.getElementById("responseLabel").innerText = messages.responseLabel;
    document.getElementById("submit").innerText = messages.submit;
    document.getElementById("heading").innerText = messages.headingStore;
  }
}

// Initialize the WordStore class when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new WordSearch("wordForm", "submissionFeedback");
});
Ui.updateUserStrings();