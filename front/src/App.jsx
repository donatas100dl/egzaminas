import { useEffect, useState } from 'react'
import './App.css'
import { useAuth } from './utils/context/authContext'
import LoginPage from "./componnents/LoginPage"
import { useNavigate } from 'react-router-dom'
import { useEvent } from './utils/context/eventContext'
import Navbar from './componnents/navbar'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function App() {
  const { user, loading, handleLogout, hnadleBanUser } = useAuth()
  const { createEvent, updateEvent, deleteEvent, getEvents, eventLoading, events, handleVerify } = useEvent()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false);
  const [currenteventId, setCurrenteventId] = useState(null);
  var category = ["Festivalis", "Seminaras", "Vakarelis", "Sportas"]
  const [event, setEvent] = useState({
    name: '',
    place: '',
    category: "Festivalis",
    date: new Date(),
  })

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);


  useEffect(() => {
    if (user) {
      getEvents()
    }
  }, [user]);


  useEffect(() => {
   console.log(isEditing)
  }, [isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from the event target
    setEvent((prevevent) => ({
      ...prevevent,
      [name]: value, // Dynamically update the state based on input name
    }));
    console.log(event)
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("test sumbit")
    if (isEditing) {
      await updateEvent(currenteventId, event);
      getEvents()
    } else {
      if (event.name == "" || event.place == "" || event.category == "") {
        alert("reikia uzpyldyti visa informacija")
        return
      }
      let newobj = {
        name: event.name,
        place: event.place,
        date: event.date,
        category: event.category
      }
      await createEvent(newobj);
      getEvents()
    }
    setEvent({
      name: '',
      place: '',
      category: "",
      date: new Date(),
    });
    setIsEditing(false);
    setCurrenteventId(null);
  };

  const handleEdit = (eventToEdit) => {
    setIsEditing(true);
    setEvent({
      name: eventToEdit.name,
      place: eventToEdit.place,
      category: eventToEdit.category,
      date: eventToEdit.date,
    });
    setCurrenteventId(eventToEdit._id); // Set the ID of the event being edited
  };

  const handleDelete = async (eventTodelete) => {
    await deleteEvent(eventTodelete)
    getEvents()
  }

  const handleRadioSelect = (value) => {
    setEvent((prevevent) => ({
      ...prevevent,
      ["category"]: value, // Dynamically update the state based on input name
    }));

  }
  const handleDateChange = (date) => {
    setEvent((prevevent) => ({
      ...prevevent,
      ["date"]: date, // Dynamically update the state based on input name
    }));
  }
  return (
    <>
      <Navbar></Navbar>
      {user ? (
        <div>
          Welcome {user.admin ? `admin ${user.name} ` : user.name}
          {user && !loading? <button onClick={handleLogout}>Logout</button> : <></> }
          <br />
          <br />
          <br />
          <h1>Mieste vykstantys renginai</h1> 

          {eventLoading ? (
            <p>Gaunami ranginiai...</p>
          ) : (
            <ul>
              {events && events.length > 0 ? events.map((eventItem) => (
                <>
                  {
                    eventItem.verified ? <>
                      <li key={eventItem._id}>
                        <h3>{eventItem.name}</h3>
                        <p>Place: {eventItem.place}</p>
                        <p>Category: {eventItem.category}</p>
                        <p>votes: {eventItem.votes}</p>
                        <p>Author: {eventItem.author}</p>
                        <button onClick={eventItem.votes++}>Vote *</button>
                      </li>
                    </> : <div>Renginiu nerasta</div>

                  }
                </>
              )) : <div>Renginiu nerasta</div>}
            </ul>
          )}


          <h1>Tavo renginai</h1>
          {eventLoading ? (
            <p>Gaunami ranginiai...</p>
          ) : (
            <ul>
              {events && events.length > 0 ? events.map((eventItem) => (
                <>
                  {
                    user._id === eventItem.user_id ? <>
                      <li key={eventItem._id}>
                        <h3>{eventItem.name}</h3>
                        <p>Place: {eventItem.place}</p>
                        <p>Category: {eventItem.category}</p>
                        <p>votes: {eventItem.votes}</p>
                        <p>Author: {eventItem.author}</p>
                        <button onClick={() => handleEdit(eventItem)}>Edit</button>
                        <button onClick={() => { handleDelete(eventItem._id) }}>Delete</button>
                      </li>
                    </> : <div>Renginiu nerasta</div>

                  }
                </>
              )) : <div>Renginiu nerasta</div>}
            </ul>
          )}

          {user.admin ? <>
            <h1>Admin Section</h1>
                      {eventLoading ? (
                        <p>Gaunami ranginiai...</p>
                      ) : (
                        <ul>
                          {events && events.length > 0 ? events.map((eventItem) => (
                            <>   
                                  <li key={eventItem._id}>
                                    <h3>{eventItem.name}</h3>
                                    <p>Place: {eventItem.place}</p>
                                    <p>Category: {eventItem.category}</p>
                                    <p>votes: {eventItem.votes}</p>
                                    <p>Author: {eventItem.author}</p>
                                    <button onClick={() => { handleEdit(eventItem)}}>Edit</button>
                                    <button onClick={() => { handleDelete(eventItem._id) }}>Delete</button>
                                    <button onClick={() => handleVerify(eventItem._id)}>Verify</button>
                                    <button onClick={() => { hnadleBanUser(eventItem.user_id) }}>Ban</button>
                                  </li>
                            </>
                          )) : <div>Renginiu nerasta</div>}
                        </ul>
                      )}
          </> : <></>}
      <br />
      <br />
      <br />
      <h1>{isEditing ? 'Edit event' : 'Create Event'}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            name="name" // Set name attribute for identifying the input
            placeholder="event Name"
            value={event.name}
            onChange={handleChange} // Use the generic change handler
          />
        </div>
        <div>
          <input
            type="text"
            name="place"
            placeholder="Place"
            value={event.place}
            onChange={handleChange}
          />
        </div>
        <div>
          <form action="/category">
            {category.map((e) => (
              <>
                {event.category == e ? <input id={e} type='radio' name='category' onClick={() => handleRadioSelect(e)} checked />
                  : <input id={e} type='radio' name='category' onClick={() => handleRadioSelect(e)} />}
                <label for={e}>{e}</label>
              </>
            ))}
          </form>
        </div>
        <div>
          <DatePicker selected={event.date} onChange={(date) => handleDateChange(date)} />
        </div>
        <button type="submit">{isEditing ? 'Update event' : 'Add event'}</button>
        {isEditing ? <button onClick={setIsEditing(false)}>Cancel</button> : <></>}
      </form>
    </div >
      ) : (
    <div>Loading...</div>
  )
}
    </>
  )
}

export default App
