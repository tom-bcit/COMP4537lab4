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
    const isValid = /^[A-Za-z]+$/.test(word);

    if (!isValid) {
      this.updateFeedback(messages.invalidInput, "red");
      return;
    }

    if (!word) {
      this.updateFeedback(messages.emptyField, "red");
      return;
    }

    try {
      const endpoint = `https://whale-app-aoaek.ondigitalocean.app/comp4537lab4-server-2-back-end/api/definitions?word=${word}`;
      let response = await fetch(endpoint);

      let result = await response.json();
      if (response.ok) {
        const word = result.word;
        const definition = result.definition;
        const requestNumber = result.requestNumber;
        this.updateResponseText(word, definition);
        this.updateFeedback("", "green");
      } else {
        const requestNumber = result.requestNumber;
        const error = result.error;
        this.updateFeedback(`${messages.requestNumber}${requestNumber}\n${error}`, "red");
      }
    } catch (error) {
      this.updateFeedback(messages.feedbackSearch, "red");
    }
  }

  updateFeedback(message, color) {
    if (this.feedback) {
      this.feedback.innerText = message;
      this.feedback.style.color = color;
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
    document.getElementById("heading").innerText = messages.headingSearch;
  }
}

// Initialize the WordStore class when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WordSearch("wordForm", "submissionFeedback");
});
Ui.updateUserStrings();