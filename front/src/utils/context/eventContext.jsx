import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [eventLoading, setEventLoading] = useState(true);
    const [token, setToken] = useState()
    const [events, setEvents] = useState();

    useEffect( () => {
        setToken(Cookies.get("token"))
    }, [])

    async function createEvent(event) {
        console.log(event)
        try {
            if (!token)
                return alert("user not authorized")

                
            const response = await axios.post("http://localhost:4001/event/", JSON.stringify(event), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })

            if (response.status === 200) {
                console.log("Successfully created Event", response)

            }

        } catch (error) {
            console.log(error)
        }

    }

    const updateEvent = async (eventId, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:4001/event/${eventId}`, JSON.stringify(updatedData), {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                console.log("Successfully updated Event", response);
            }
        } catch (error) {
            console.error("Error updating Event:", error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const response = await axios.delete(`http://localhost:4001/event/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                console.log("Successfully deleted Event", response);
            }
        } catch (error) {
            console.error("Error deleting Event:", error);
        }
    };

    const getEvents = async () => {
        setEventLoading(true);
        try {
            const response = await axios.get("http://localhost:4001/event/");
            console.log("gett", response)
            if (response.status === 200) {
                console.log("Successfully got all Event", response);
                setEvents(response.data); // Update this line to properly set the array
            }
        } catch (error) {
            console.log(error);
        } finally {
            setEventLoading(false);
        }
    };
    const handleVerify = async (eventId) => {
        try {

            if(!token)
                return
            const response = await axios.put(`http://localhost:4001/event/verify/${eventId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.status === 200) {
                console.log("Successfully verifyed Event", response);
            }
        } catch (error) {
            console.error("Error deleting Event:", error);
        }
    }

    const contextData = useMemo(() => ({
        createEvent, updateEvent, deleteEvent, getEvents, eventLoading, events,eventLoading,handleVerify
    }), [Event, eventLoading]);


    return (
        <EventContext.Provider value={contextData}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => {
    return useContext(EventContext);
};

export default EventContext;