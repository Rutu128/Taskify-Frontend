import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import DashboardPage from "./pages/DashboardPage";
import NavbarLayout from "./layout/NavbarLayout";
import TaskProvider from "./contexts/TaskContext";
import DashboardProvider from "./contexts/DashboardContext";

const App = () => {
  return (
    <>
      <DashboardProvider>
        <TaskProvider>
          <Routes>
            <Route path="/" element={<NavbarLayout />}>
              <Route path="" element={<HomePage />} />
              <Route path="/tasks" element={<TaskPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
        </TaskProvider>
      </DashboardProvider>
    </>
  )
}

export default App