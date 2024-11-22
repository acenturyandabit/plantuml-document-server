import { createRoot } from "react-dom/client";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import EditorPage  from "~EditorPage";
import DocListPage from "~DocListPage";


/*
Create a react frontend that sends the text inside a textarea to a remote URL after every change. The remote url will return a PNG image which is to be rendered in a div
- Set the remote url
*/

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<DocListPage />} />
      <Route path="doc/:id" element={<EditorPage />} /> 
    </Routes>
  </Router>
);

createRoot(document.getElementById("root")!).render(<App />);
