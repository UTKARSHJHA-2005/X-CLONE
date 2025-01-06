import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/auth/Signup/SignupPage";
import LoginPage from "./pages/auth/Login/LoginPage";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../src/components/common/LoadingSpinner"

function App() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await fetch("api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if (!res.ok) throw new error(data.error)
        return data;
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    },
    retry:false
  })
  if (isLoading) {
    <div><LoadingSpinner size="lg"/></div>
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  );
}

export default App;
