'use strict';

document.addEventListener('DOMContentLoaded', e => {
  let pg = document.body.id || 'main';

  // Get todo list
  if (pg === 'main') fetch('/api/todos')
    .then(r => r.json() )
    .then(r => {
      updateTodoList(r);
    })
    .catch(e => {
      setTimeout(function() {
        alert('Failed fetching TODOs!');
      }, 1000);
      console.log('Fetch failed: ', e);
    });

  if (pg === 'notes') fetch('/api/notes')
    .then(r => r.json() )
    .then(r => {
      updateNotes(r);
    })
    .catch(e => {
      setTimeout(function() {
        alert('Failed fetching NOTEs!');
      }, 1000);
      console.log('Fetch failed: ', e);
    });

  // Set up interactions
  let todoInteractions = document.querySelector('main > ol');
  if (todoInteractions) todoInteractions.addEventListener('click', e => {
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

  let noteInteractions = document.querySelector('button#search');
  if (noteInteractions) noteInteractions.addEventListener('click', e => {
    let query = prompt('Search notes...');
    let root = document.querySelector('main > ul');

    root.innerHTML = '';
    fetch('/api/notes/search?q='+encodeURIComponent(query))
      .then(r => r.json() )
      .then(r => {
        updateNotes(r);
      })
      .catch(e => {
        setTimeout(function() {
          alert('Failed searching NOTEs!');
        }, 1000);
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

function updateNotes(data) {
  let root = document.querySelector('main > ul');

  root.innerHTML = '';
  data.forEach(i => {
    let emt = document.createElement('li');
    emt.innerHTML = '<strong>'+i.title+'</strong><p>'+i.contents.replace(/\n/g, '<br>')+'</p>';
    emt.dataset.id = i.id;

    root.appendChild(emt);
  });
}
