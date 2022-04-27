import { useRef, useState, useEffect } from "react";
import { signup, login, logout, useAuth, db } from "./firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import "./App.css"

export default function App() {
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");
  const [forum, setForum] = useState([]);
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [link, setLink] = useState("");
  const [author, setAuthor] = useState("");
  const forumColletionRef = collection(db, "forum");

  const [day, setDay] = useState("");
  const [workout, setWorkout] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const workoutColletionRef = collection(db, "workout");

  async function addWorkout() {
    setLoading(true);
    await addDoc(workoutColletionRef, {workout: workout, day: day});
    setLoading(false);
  };
  const getWorkout = async () => {
    const data = await getDocs (workoutColletionRef);
    setWorkoutPlan(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  getWorkout();


  async function createPlan() {
    setLoading(true);
    await addDoc(forumColletionRef, {author: author, title:title, contents: contents, link:link, vote: 0});
    setLoading(false);
  };
  const deletePost = async (id) => {
    const userDoc = doc (db, "forum", id);
    await deleteDoc(userDoc);
  }
  const addVote = async (id, vote) => {
    const userDoc = doc (db, "forum", id);
    const newFields = {vote: vote + 1}
    await updateDoc(userDoc, newFields);
  }
  const subtractVote = async (id, vote) => {
    const userDoc = doc (db, "forum", id);
    const newFields = {vote: vote - 1}
    await updateDoc(userDoc, newFields);
  }
  const getForum = async () => {
    const data = await getDocs (forumColletionRef);
    setForum(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  getForum();

  async function createUser() {
    setLoading(true);
    await addDoc(usersCollectionRef, {name: newName, age: Number(newAge)});
    setLoading(false);
  };
  const deleteUser = async (id) => {
    const userDoc = doc (db, "users", id);
    await deleteDoc(userDoc);
  }

  const getUsers = async () => {
    const data = await getDocs (usersCollectionRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }
  getUsers();

  async function handleSignup() {
    setLoading(true);
    await signup(emailRef.current.value, passwordRef.current.value);
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    try {
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      alert("Error!");
    }
    setLoading(false);
  }

  const Line = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1
        }}
    />
  );

  return (
    <div className="App">
      {currentUser? "" : 
      <div id="center_login">
        <div id="login">
          <div>
            <div id="title">sign up or login!</div> {" "}
              <div id="fields">
                <div>
                  <input ref={emailRef} placeholder="Email" />
                </div>
                <div>
                  <input ref={passwordRef} type="password" placeholder="Password" />
                </div>
              </div>
              <button onClick={handleSignup}>
                Sign Up
              </button>
              <button onClick={handleLogin}>
                Log In
              </button>
          </div>  
        </div>
      </div>
      }
      {currentUser? 
      <div>
        <div id="todo">
          <div id="title">Hi, { currentUser?.email } </div>
          <button id="logout_button" onClick={handleLogout}>
            Log Out
        </button>
          <div>
            Goals
          </div>
            <input placeholder="Workout" onChange= {(event) => {
              setNewName(event.target.value);
              }}
            />
            <input type="number" placeholder="Reps" onChange= {(event) => {
              setNewAge(event.target.value);
              }}
            />
            <button onClick ={createUser}> Create </button>
            {users.map((user) =>{
              return(
                <div>
                  <input type="checkbox"/>
                  Workout: {user.name},
                  Reps: {user.age} {" "}
                  <button onClick = {() => {deleteUser(user.id)}}>Delete</button>
                  {" "}
                </div>  
              );
            })}
            {" "}
            <div>
              <h3>Workout Plan</h3>
              <select placeholder="day"  onChange= {(event) => {
                setDay(event.target.value);
              }}>
                <option id="monday"> Monday</option>
                <option id="tuesday">Tuesday</option>
                <option id="wednesday"> Wednesday</option>
                <option id="thursday">Thursday</option>
                <option id="friday">Friday</option>
                <option id="saturday"> Saturday</option>
                <option id="sunday">Sunday</option> 
              </select>
              <input placeholder="workday" onChange= {(event) => {
                setWorkout(event.target.value);
                }}
              />
              <button onClick ={addWorkout}> Add </button>
              <table>
                <thead>
                <tr>
                  <th>Sunday</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                  <th>Saturday</th>
                </tr>
                <tr>
                  <td id="sunday">
                    {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Sunday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                  <td id="monday">
                  {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Monday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                  <td id="tuesday">
                  {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Tuesday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                  <td id="wednesday">
                  {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Wednesday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                  <td id="thursday">
                  {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Thursday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                  <td id="friday">
                  {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Friday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                  <td id="saturday">
                  {workoutPlan.map((user) =>{
                      var day = user.day;
                      if (day=="Saturday"){
                        return(
                          <div>
                            {user.workout}
                          </div>
                        );
                      }
                    })}
                  </td>
                </tr>
                </thead>
              </table>
            </div>
        </div>
        </div>
      : " " }
      <div id="forum">
          {currentUser? 
          <div>
            <h3>Workout Forum</h3>
            <input placeholder="Author Name" onChange= {(event) => {
              setAuthor(event.target.value);
              }}
            />
            <input placeholder="Title" onChange= {(event) => {
              setTitle(event.target.value);
              }}
            />
            <div>
              <input placeholder="Contents" onChange= {(event) => {
                setContents(event.target.value);
                }}
              />
              <input placeholder="Link" onChange= {(event) => {
                setLink(event.target.value);
                }}
              />
            </div>
              <button onClick ={createPlan}> Post </button>
            {forum.map((user) =>{
              return(
                <div>
                  <div>
                    Author: {user.author} {" "}
                  </div>
                  <div>
                    Title: {user.title} {" "}
                  </div>
                  <div>
                    Contents: {user.contents} {" "}
                  </div>
                  <div>
                    Link: <a href={ 'https://' + user.link }>{user.link}</a> {" "}
                  </div>
                  <div>
                    Vote: 
                    <button onClick = {() => {
                    subtractVote(user.id, user.vote);
                    }}
                    > 
                    &#8595;
                    </button>
                    {user.vote}
                    <button onClick = {() => {
                    addVote(user.id, user.vote);
                    }}
                    > 
                    &#8593;
                    </button>
                   {" "}
                  </div>
                  <button onClick = {() => {deletePost(user.id)}}>Delete Post </button>
                  {" "}
                </div>  
              );}
            )}
            </div>
            : " "}
            {" "}
        </div>
    </div>
  );
}