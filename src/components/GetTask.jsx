import { useState,useEffect } from "react";
import axios from "axios";

const PostManager = () => {

    const [post, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTask, setNewTask] = useState ({userId, id, title, completed})

    useEffect {() => {
        fetchTasks();
    }, []};

    const fetchTasks = async {} => {
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
            setTask (response.data);
        }catch (err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }
}

export default PostManager;