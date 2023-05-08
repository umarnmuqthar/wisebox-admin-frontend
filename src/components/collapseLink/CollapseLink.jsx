import "./collapseLink.scss"
import { useState } from 'react'
import { NavLink, useLocation } from "react-router-dom"

const CollapseLink = ({links}) => {
    const [isOpen, setOpen] = useState(false)
    const location = useLocation()
    const homeUrl = location.pathname.split("/")[1]

    return (
        <div className="link-item">
            <div className="list-title" onClick={() => setOpen(!isOpen)}>
                <p className={`${isOpen ? "is-title-active" : ""}`}>
                    {links?.name} 
                    {isOpen 
                        ? <i className="bi bi-caret-down-fill"/> 
                        : <i className="bi bi-caret-right-fill"/>
                    }
                </p>
            </div>
            <div className={`list-items ${!isOpen ? "d-none" : ""}`}>
                {links?.classes && links?.classes.map((data, idx) => (
                    <NavLink key={idx} to={`/${homeUrl}/${links.slug}/${data.slug}`} activeClassName="is-active"><i className="bi bi-arrow-right-short"/> {data.name}</NavLink>
                ))}
            </div>
        </div>
    )
}

export default CollapseLink
