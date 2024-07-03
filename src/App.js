import React, {useState} from 'react';
import Config from "./components/Config";
import Router from "./components/Router";
import './App.css';
function App() {
    const [RoomId, setRoomId] = useState(null)
    return (
        <div className="App">
            <Config/>
            <Router RoomId={RoomId} setRoomId={setRoomId}/>
        </div>

    );
}

export default App;
