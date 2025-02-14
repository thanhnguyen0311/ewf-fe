import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import './App.css';
import {Helmet} from "react-helmet";

function App() {

  return (
      <BrowserRouter>
          <Helmet>
              <title>East West Furniture</title>
          </Helmet>
          <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
  );
}

export default App;