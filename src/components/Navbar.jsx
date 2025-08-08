import React from 'react'
import {useNavigate} from 'react-router-dom'

export const Navbar = () => {
    const navigate = useNavigate();
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <p className="btn btn-ghost text-xl" onClick={() => navigate('/')}>CodePair</p>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li className='p-4 cursor-pointer hover:bg-gray-200 hover:text-gray-900' onClick={() => navigate('/')}>Home</li>
                    <li className='p-4 cursor-pointer hover:bg-gray-200 hover:text-gray-900' onClick={() => navigate('/liveshare')}>Liveshare</li>
                </ul>
            </div>
        </div>
    )
}
