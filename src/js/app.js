'use strict';

import {Question} from './modules/question';
import {isValid, createModal} from './modules/utils';
import {getAuthForm, authWithEmailAndPassword} from './modules/authorization';
import '../css/index.css';

window.addEventListener('load', () => {
    Question.renderList();
    
    const form = document.querySelector('#question-form');
    const input = form.querySelector('#question-input');
    const submitBtn = form.querySelector('#submit');
    const modalBtn = document.querySelector('#modal-btn');

    const renderModalAfterAuth = (content) => {
        if (typeof content === 'string') {
            createModal('Error!', content);
        } else {
            createModal('Questions List', Question.listToHTML(content));
        }
    };

    const submitFormHandler = (event) => {
        event.preventDefault();

        if (isValid(input.value)) {
            const question = {
                text: input.value.trim(),
                date: new Date().toJSON()
            };

            submitBtn.disabled = true;

            Question.create(question).then(() => {
                input.value = '';
                input.className = '';
                submitBtn.disabled = false;
            });
        }
    };

    const authFormHandler = (event) => {
        event.preventDefault();

        const singInBtn = event.target.querySelector('button');
        const email  = event.target.querySelector('#email').value;
        const password  = event.target.querySelector('#password').value;

        singInBtn.disabled = true;
        authWithEmailAndPassword(email, password)
          .then(Question.fetch)
          .then(renderModalAfterAuth)
          .then(() => singInBtn.disabled = false);
    };

    const openModal = () => {
        createModal('Authorization', getAuthForm());

        document.querySelector('#auth-form').addEventListener('submit', authFormHandler, {once: true});
    };

    input.addEventListener('input', () => {
        submitBtn.disabled = !isValid(input.value);
    });
    form.addEventListener('submit', submitFormHandler);
    modalBtn.addEventListener('click', openModal);
});