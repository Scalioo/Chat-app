import './App.css'
import UserContext from './Context'
import Views from './Views'
function App() {


  return (
    <UserContext>
      <Views />
    </UserContext>
  )
}

export default App
