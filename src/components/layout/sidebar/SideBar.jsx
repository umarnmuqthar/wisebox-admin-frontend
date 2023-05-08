import './sidebar.scss'
import CollapseLink from '../../collapseLink/CollapseLink'
import { connect } from 'react-redux'
import { useHistory, withRouter, NavLink } from 'react-router-dom'
//img
import wiseboxLogo from '../../../assets/images/wisebox-logo.png'


const SideBar = ({ navLinks, homeUrl, loading, dashboardTitle, admin }) => {
    const history = useHistory()

    return (
        <div className="sidebar col-2">
            <div className="logo pb-3">
                {/* <h1 onClick={() => history.push(`/${homeUrl}`)}>wisebox</h1> */}
                <div className="wisebox_logo" onClick={() => history.push(`/${homeUrl}`)}>
                    <img src={wiseboxLogo} alt="wisebox-logo" />
                </div>
                <p>{dashboardTitle} Panel</p>
            </div>
            { (loading && !navLinks.length)
            ? (
                <div className="spinner-grow text-light my-5" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ) : ( 
                <div className="navlinks">
                    {navLinks?.map((links, idx) => (
                        <CollapseLink links={links} key={idx}/>
                    ))}
                </div>
            )
            }

            {/*TODO: Teacher's manage section for admin */}

            {admin && (
                <>
                    <div className="logo py-3">
                        <p>Other</p>
                    </div>
                    <div className="navlinks">
                        <NavLink to={`/admin/teachers`} activeClassName="is-active">{/* <i className="bi bi-arrow-right-short"/>  */}Teachers</NavLink>

                        {/* <CollapseLink links={links} key={idx}/>
                        <CollapseLink links={links} key={idx}/> */}
                    </div>
                </>
            )}
        </div>
    )
}

const mapStateToProps = (state, {location}) => {
    return {
        // navLinks: location.pathname.split("/")[1] === "teacher" ? [] : state.admin.sidebarData,
        navLinks: state.data.boards,
        homeUrl:  location.pathname.split("/")[1],
        dashboardTitle: location.pathname.split("/")[1] === "teacher" 
                        ? "Teacher's" 
                        : "Admin's",
        admin: location.pathname.split("/")[1] === "teacher" ? false : true,
        loading: state.data.loading
    }
}

export default withRouter(connect(mapStateToProps)(SideBar))
