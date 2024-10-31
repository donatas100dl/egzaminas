import { useEffect, useState } from 'react'
import { useAuth } from '../utils/context/authContext'
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const { user, loading, handleLogout } = useAuth()
    const navigate = useNavigate();
    return (
        <div className='navbar'>
        <ul>

        </ul>
        </div>
    )
}

export default Navbar