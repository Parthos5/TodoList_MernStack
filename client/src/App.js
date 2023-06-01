import { useEffect, useState } from 'react';
const api_base = 'http://localhost:3001';

function App() {
	const [todos, setTodos] = useState([]);
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState("");

    useEffect(()=>{
        GetTodos();
        console.log(todos);
    },[])

    const GetTodos = () => {
        fetch(api_base+'/todos')
              .then((res) => res.json())
              .then((data)=>
              {
                setTodos(data)
                console.log(todos)
              })
              .catch(err => console.error("Error: " + err))
    }

    async function completeTodo(id){
        let data = await fetch(api_base+'/todos/complete/' + id,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // Additional headers if needed
            },
        })    
                           .then(res=>res.json())
        
        setTodos(todos=>todos.map((todo)=>{
            if(todo._id === data._id){
                todo.complete = data.complete
            }
            GetTodos();

            return todo
        }))
    }

    async function deleteTodo(id){
        let data  = await fetch("http://localhost:3001/todos/delete/" + id,{
                method: "DELETE"
        }).then(res=>res.json)

        setTodos(todos=>todos.filter(todo => todo._id !== data._id))
        GetTodos();
    }

    async function addTodo(){
        const data = await fetch(api_base+"/todos/new",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                text:newTodo
            }) 
        }).then(res=>res.json())
        console.log(data);
        GetTodos();

        setTodos([...todos,data]);
        setPopupActive(false);
        setNewTodo("")
    }

	return(
        <div className="App">
			<h1>Welcome,Parth</h1>
			<h4>Your tasks</h4>

			<div className="todos">
				{todos.length > 0 ? todos.map(todo => (
					<div className={
						"todo" + (todo.complete ? " is-complete" : "")
					} key={todo._id} onClick={()=>completeTodo(todo._id)}>
						<div className="checkbox"></div>

						<div className="text">{todo.text}</div>

						<div className="delete-todo" onClick={()=>{deleteTodo(todo._id)}}>x</div>
					</div>
				)) : (
					<p>You currently have no tasks</p>
				)}
			</div>

			<div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

			{popupActive ? (
				<div className="popup">
					<div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
					<div className="content">
						<h3>Add Task</h3>
						<input type="text" className="add-todo-input" onChange={e => setNewTodo(e.target.value)} value={newTodo} />
						<div className="button" onClick = {addTodo}>Create Task</div>
					</div>
				</div>
			) : ''}
		</div>
	);
}

export default App;