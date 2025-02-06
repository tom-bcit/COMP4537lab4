const messages = require('./messages');

class WordStore {
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
                this.updateFeedback(messages.feedbackSuccess, "green");
                this.form.reset();
            } else {
                this.updateFeedback(messages.feedbackFailure, "red");
            }
        } catch (error) {
            this.updateFeedback(messages.feedbackFailure, "red");
        }
    }

    updateFeedback(message, color) {
        if (this.feedback) {
            this.feedback.innerText = message;
            this.feedback.style.color = color;
        }
    }
}

// Initialize the WordStore class when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new WordStore("wordForm", "submissionFeedback");
});
