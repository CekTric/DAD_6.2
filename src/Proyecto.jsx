import React from 'react'
import { ApiPage } from './pages/ApiPage'
import { ContadorPage } from './pages/ContadorPage'
import { ErrorPage } from './pages/ErrorPage'
import { GestorTareaPage } from './pages/GestorTareaPage'
import { LoginPage } from './pages/LoginPage'
import { UserPage } from './pages/UserPage'
import { SuApiPage } from './pages/SuApiPage'
import Chatbot from './components/Chatbot'
import { InformesPage } from './pages/InformesPage'

import { Routes, Route } from 'react-router'
import { MiNavBar } from './components/NavBar'
import { LoginProvider } from './context/LoginProvider'
import InteractiveComponents from './components/InteractiveComponents'

const MiProyecto = () => {
    return (
        <div>
            <MiNavBar></MiNavBar>
            <LoginProvider>
                <div className='container'>
                    <Routes>
                        <Route path='/api' element={<ApiPage></ApiPage>}></Route>
                        <Route path='/api2' element={<SuApiPage></SuApiPage>}></Route>
                        <Route path='/contador' element={<ContadorPage></ContadorPage>}></Route>
                        <Route path='/gestor' element={<GestorTareaPage></GestorTareaPage>}></Route>
                        <Route path='/interactive' element={<InteractiveComponents />} />
                        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
                        <Route path='/user' element={<UserPage></UserPage>}></Route>
                        <Route path='/informes' element={<InformesPage />} />
                        <Route path='/*' element={<ErrorPage></ErrorPage>}></Route>
                    </Routes>
                </div>
            </LoginProvider>
            <Chatbot />
        </div>
    )
}

export default MiProyecto