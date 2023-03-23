import { useState, useEffect } from 'react';

const API_BASE = 'https://mern-todo-api.herokuapp.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(API_BASE + '/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error:', err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + '/todo/complete/' + id).then((res) =>
      res.json().catch((err) => console.error('Error:', err))
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const deleteTodo = async (id, event) => {
    event.stopPropagation();
    await fetch(API_BASE + '/todo/delete/' + id, {
      method: 'DELETE',
    });

    const updatedTodos = await fetch(API_BASE + '/todos').then((res) =>
      res.json().catch((err) => console.error('Error:', err))
    );

    setTodos(updatedTodos);
  };

  const addTodo = async () => {
    const data = await fetch(API_BASE + '/todo/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    }).then((res) => res.json().catch((err) => console.error('Error:', err)));

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="App">
      <h1>Sé 🔥 Dani</h1>
      <h4>Afazeres</h4>

      <div className="todos">
        {todos.map((todo) => (
          <div
            className={'todo ' + (todo.complete ? 'is-complete' : '')}
            key={todo._id}
            onClick={() => (todo._id ? completeTodo(todo._id) : null)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo.text}</div>
            <span
              className="delete-todo"
              onClick={(event) =>
                todo._id ? deleteTodo(todo._id, event) : null
              }
            >
              x
            </span>
          </div>
        ))}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="close-popup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default App;
