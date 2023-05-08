import './topbar.scss'
import { useHistory, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutAdmin } from '../../../redux/actions/adminAction'
import { logoutTeacher } from '../../../redux/actions/teacherAction'

const TopBar = ({ authenticated, userName, dispatch, crumbs }) => {
    const history = useHistory()
    const homeUrl = history.location.pathname.split("/")[1] 

    const _logout = () => {
        const admin = homeUrl === "admin"
        admin ? dispatch(logoutAdmin()) : dispatch(logoutTeacher())
        history.push(`/${homeUrl}/signin`)
    }

    return (
        <nav className="topbar navbar" role="navigation" aria-label="main navigation">
            {authenticated && (
                <>
                    <div className="navbar-brand">
                        <ol className="breadcrumb">
                            {crumbs.length > 1 && (
                                crumbs.map(({name, path}, i) => (
                                    i + 1 === crumbs.length ? (
                                        <li className="breadcrumb-item" key={i}>{name}</li>
                                    ) : (
                                        <li className="breadcrumb-item" key={i}><Link to={path}>{name}</Link></li>
                                    )
                                ))
                            )}
                        </ol>
                    </div>
                    <div className="navbar-menu">
                        <p>{userName}</p>
                        <p className="sign-out" onClick={_logout}>Sign Out</p>
                    </div>
                </>
            )}
        </nav>
    )
}

const mapStateToProps = (state, props) => {
    return {
        
    }
}

export default connect(mapStateToProps)(TopBar)
