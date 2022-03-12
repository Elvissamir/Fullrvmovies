import { useContext } from "react"
import { UserContext } from "./context/userContext"
import { NavLink } from "react-router-dom"

function Nav () {
    const { currentUser, logoutUser } = useContext(UserContext)
    const menuLinks = [
        { name: 'Movies', url: '/movies' },
        { name: 'Rentals', url: '/rentals' },
        { name: 'Customers', url: '/customers' }
    ]

    const renderAuth = () => {
        const items = [
            { name: 'Login', url: '/login'},
            { name: 'Register', url: '/register'},
        ]

        return (
            items.map(item =>      
                <li className="flex" key={ item.name }>
                    <NavLink 
                        className="menu-link" 
                        to={ item.url }>
                            { item.name }
                    </NavLink>
                </li>
            )
        )
    }

    const renderUserDetails = () => {
        return (
            <li className="flex items-center ml-4">
                <div className="h-8 w-8 rounded-full bg-green-400"></div>
                <div className="flex ml-2">{ currentUser.first_name }</div>
                <button onClick={ logoutUser } className="ml-4 button action-button">Logout</button>
            </li>
        )
    }

    return (
        <nav className="nav">
            <div className="nav-content">
                <div className="font-black">V MOVIES</div>
                <div className="menu-wrapper">
                    <ul className="menu">
                        {  menuLinks.map(link => 
                            <li className="flex" key={ link.name }>
                                <NavLink 
                                    className="menu-link" 
                                    to={ link.url }>
                                        { link.name }
                                </NavLink>
                            </li>) }
                            { currentUser? renderUserDetails():renderAuth() }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav