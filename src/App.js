import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import {useEffect} from 'react';

const tele = window.Telegram.WebApp;

function App() {

  useEffect(() => {
    tele.ready();
  }, [])
  
  return (
    <div className="App">
         <Routes>
            <Route
              path="/"
              element={
                <MainPage tele={tele}/>
              }
            />
          </Routes>
    </div>
  );
}

export default App;
