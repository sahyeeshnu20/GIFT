// Array of questions and their correct answers
const questions = [
    { question: "What is the day, I saw you first?", answer: "08" },
    { question: "What is Kayal's favourite place in SEGI? _ Hint : can see fountain from here ", answer: "Library" },
    { question: "When is Kayal's first picture with Sahysu?", answer: "14" }
];

let currentQuestionIndex = 0; // Track the current question index

// --- Utility Functions ---

/**
 * Resets the input field, message div, and hides the Next button.
 */
function resetUI() {
    const codeInput = document.getElementById('code-input');
    const messageDiv = document.getElementById('message');
    const nextButton = document.getElementById('next-btn');

    if (codeInput) codeInput.value = '';
    if (messageDiv) messageDiv.innerHTML = '';
    if (nextButton) nextButton.style.display = 'none'; // Ensure 'Next' is hidden for a new question
}

/**
 * Function to display the current question or move to the next page if complete.
 */
function displayQuestion() {
    const questionText = document.getElementById('question-text');

    if (currentQuestionIndex < questions.length) {
        // Display the next question
        const question = questions[currentQuestionIndex];
        if (questionText) {
            questionText.textContent = question.question;
        }
        resetUI(); // Clear the form and hide 'Next'
    } else {
        // All questions answered, move to the final sequence (Page 3)
        goToPage(3);
    }
}

/**
 * Function to navigate between the application pages using IDs.
 * @param {number} pageNumber - The number of the page to show (1, 2, 3, or 4).
 */
function goToPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    const targetPage = document.getElementById(`page${pageNumber}`); // Use page ID: page1, page2, etc.

    if (!targetPage) {
        console.error(`Page page${pageNumber} not found.`);
        return;
    }

    // Hide all pages
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Show the target page
    targetPage.style.display = 'block';

    // Special handling for Page 2 (the quiz page)
    if (pageNumber === 2) {
        // Always display the current question when arriving at Page 2
        displayQuestion();
    }
}


/**
 * Handles moving to the next question or the final page.
 * This function should be called when the special 'next-btn' is clicked on Page 2.
 */
function nextQuestion() {
    // Increment the index to move to the next question
    currentQuestionIndex++;
    
    // Call displayQuestion() to either load the next question OR move to Page 3 if finished.
    displayQuestion();
}


/// --- Event Handlers ---

/**
 * Function to handle the question submission (answer check).
 */
function handleQuestionSubmit(event) {
    event.preventDefault(); 	
    const codeInput = document.getElementById('code-input');
    const messageDiv = document.getElementById('message');
    const nextButton = document.getElementById('next-btn');

    const enteredCode = codeInput.value.trim(); 
    const correctAnswer = questions[currentQuestionIndex].answer; 

    // Check if the answer is empty
    if (enteredCode === "") {
        messageDiv.innerHTML = "Please enter an answer.";
        messageDiv.style.color = 'orange';
        return;
    }
    
    // 📢 START OF DEBUGGING CODE 📢
    console.log("--- DEBUGGING ANSWER ---");
    console.log("Expected Answer (Lower):", correctAnswer.toLowerCase());
    console.log("User Input (Lower):", enteredCode.toLowerCase());
    console.log("Current Question Index:", currentQuestionIndex);
    console.log("------------------------");
    // 📢 END OF DEBUGGING CODE 📢

    // Check if the answer is correct (case-insensitive comparison)
    if (enteredCode.toLowerCase() === correctAnswer.toLowerCase()) {
        messageDiv.innerHTML = "🎉 **Congratulations kayalu! Your answer is correct!**";
        messageDiv.style.color = 'green';
        
        // Show the specific 'next-btn' to advance the question/page
        if (nextButton) {
            nextButton.style.display = 'inline-block';
        }
    } else {
        messageDiv.innerHTML = "❌ **Incorrect answer.** Please try again.";
        messageDiv.style.color = 'red';
        // Ensure the next button is hidden on incorrect attempts
        if (nextButton) {
            nextButton.style.display = 'none';
        }
    }
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    const codeForm = document.getElementById('code-form');
    const nextButton = document.getElementById('next-btn');

    // 1. Hook up the form submission to check the answer
    if (codeForm) {
        codeForm.addEventListener('submit', handleQuestionSubmit);
    }
    
    // 2. Hook up the special 'next-btn' to advance the question or page
    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
    }
    
    // 3. Override the generic HTML onClick for page navigation buttons
    // We now map all 'next-btn' clicks to the goToPage function
    document.querySelectorAll('.book .page .next-btn').forEach(button => {
        // Get the target page number from the existing inline click handler
        const onClickAttr = button.getAttribute('onclick');
        if (onClickAttr && onClickAttr.startsWith('nextPage(') && button.id !== 'next-btn') {
            const pageNumber = parseInt(onClickAttr.match(/\d+/)[0]);
            
            // Remove the old inline handler and attach the new one
            button.removeAttribute('onclick');
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button action if necessary
                goToPage(pageNumber);
            });
        }
    });

    // Start with Page 1
    goToPage(1); 
});

// Since the original HTML used nextPage(X) inline, we redefine it here
// to map to the new goToPage function for the non-quiz pages (1 to 2, 3 to 4, etc.)
function nextPage(pageNumber) {
    goToPage(pageNumber);
}