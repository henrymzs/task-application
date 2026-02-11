import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TaskProvider } from "@/contexts/TaskContext";
import { Toaster } from "@/components/ui/sonner"
import Home from "./pages/Home"
import AddTask from "./pages/AddTask"
import EditTask from "./pages/EditTask";

function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adicionar" element={<AddTask />} />
          <Route path="/editar/:id" element={<EditTask />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </TaskProvider>
  );
};

export default App
