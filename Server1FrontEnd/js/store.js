import { messages } from '../lang/en/messages.js';

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
    const isValid = /^[A-Za-z]+$/.test(word);

    if (!isValid) {
      this.updateFeedback(messages.invalidInput, "red");
      return;
    }

    if (!word || !definition) {
      this.updateFeedback(messages.emptyField, "red");
      return;
    }

    try {
      let response = await fetch("https://whale-app-aoaek.ondigitalocean.app/comp4537lab4-server-2-back-end/api/definitions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ word, definition })
      });

      let result = await response.json();
      if (response.ok) {
        const requestNumber = result.requestNumber;
        this.updateFeedback(`${messages.requestNumber}${requestNumber}\n${messages.feedbackSuccess}`, "green");
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

class Ui {
  static updateUserStrings() {
    document.getElementById("wordLabel").innerText = messages.wordLabel;
    document.getElementById("definitionLabel").innerText = messages.definitionLabel;
    document.getElementById("submit").innerText = messages.submit;
    document.getElementById("heading").innerText = messages.headingStore;
  }
}

// Initialize the WordStore class when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WordStore("wordForm", "submissionFeedback");
});
Ui.updateUserStrings();
