const toCard = (question) => {
    return `
    <div class="mui--text-black-54">
        ${new Date(question.date).toLocaleDateString()}
        ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div class="mui--text-headline">
        ${question.text}
    </div>
    <br>
    `;
};

const getQuestionsFromLocalStorage = () => {
    return JSON.parse( localStorage.getItem('questions')  || '[]');
};

const addToLocalStorage = (question) => {
    const questions = getQuestionsFromLocalStorage();
    questions.push(question);

    localStorage.setItem('questions', JSON.stringify(questions));
};

export class Question {
    static create(question) {
        return fetch('https://ask-question-app-604a4.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
          .then(response => response.json())
          .then(response => {
              question.id = response.name;
              return question;
          })
          .then(addToLocalStorage)
          .then(Question.renderList);
    }

    static listToHTML(questions) {
        return questions.length 
        ? `<ol>${questions.map(question => `<li>${question.text}</li>`).join('')}</ol>`
        : `<p>No questions yet</p>`;
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve(`<p class="error">You don't have token</p>`);
        }

        return fetch(`https://ask-question-app-604a4.firebaseio.com/questions.json?auth=${token}`)
          .then(response => response.json())
          .then(response => {
              if (response && response.error) {
                  return `<p class="error">${response.error}</p>`;
              }

              return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
              })) : [];
          });
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage();

        const html = questions.length ? questions.map(question => toCard(question)).join('')
        :   `<div class="mui--text-headline">You haven't asked anything yet</div>`;
        
        const list = document.querySelector('#list');
        list.innerHTML = html;
    }
}