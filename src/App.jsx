import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Home } from './page/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Code } from './page/Code'
import { Footer } from './components/Footer'
import { Liveshare } from './page/Liveshare'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/code/:id' Component={Code} />
          <Route path='/liveshare' Component={Liveshare} />
          <Route path='/sign' Component={Signup} />
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
    </>
  )
}

export default App
