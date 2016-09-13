'use strict';

document.addEventListener('DOMContentLoaded', e => {
  // Get todo list
  fetch('/api/todos')
    .then(r => r.json() )
    .then(r => {
      updateTodoList(r);
    })
    .catch(e => {
      alert('Failed fetching TODOs!');
      console.log('Fetch failed: ', e);
    });

  // Set up interactions
  document.querySelector('main > ol').addEventListener('click', e => {
    let emt = e.target;

    let done = 1-parseInt(emt.dataset.done, 10);
    emt.dataset.done = done;
    emt.classList.toggle('is-done', done);

    let data = {
      id: [ parseInt(emt.dataset.id, 10) ],
      done: !!done
    };

    fetch('/api/todos', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then(r => {
        if (r.err) throw r;

        console.log('Record #'+data.id+' updated.', r);
      })
      .catch(e => {
        alert('Failed updating TODOs!');
        console.log('Fetch failed: ', e);
      });
  });

});

function updateTodoList(data) {
  let root = document.querySelector('main > ol');

  data.forEach(i => {
    let emt = document.createElement('li');
    emt.textContent = i.todo;
    emt.dataset.id = i.id;
    emt.dataset.deadline = i.deadline || '';

    emt.dataset.done = i.done|0;
    emt.classList.toggle('is-done', i.done);

    root.appendChild(emt);
  });
}
