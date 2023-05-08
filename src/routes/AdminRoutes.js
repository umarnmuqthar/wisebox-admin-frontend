import './main.scss'
import { useEffect } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { connect, useDispatch } from 'react-redux'
import axios from '../api'
import jwtDecode from 'jwt-decode'
import { Helmet } from 'react-helmet-async'
//page
import HomePage from "../pages/admin/home"
import TeachersPage from '../pages/admin/teachers'
import BoardPage from '../pages/admin/board'
import SubjectPage from '../pages/admin/classPage'
import ChapterPage from '../pages/admin/subject'
import SlabsPage from '../pages/common/chapter'
import SlabPage from '../pages/admin/slab'
import SignIn from '../components/signIn/SignIn'
//components
import SideBar from "../components/layout/sidebar/SideBar"
// import TopBar from "../components/layout/topbar/TopBar"
//redux
import { getBoards } from '../redux/actions/dataAction'
import { getAdminData, logoutAdmin, refreshToken } from "../redux/actions/adminAction"
import { SET_ADMIN_AUTHENTICATED } from "../redux/actionTypes"
import AuthRoute from '../utils/AuthRoute'

export const routes = [
    { path: '/admin', name: 'Home', Component: HomePage },
    { path: '/admin/teachers', name: 'Teachers', Component: TeachersPage },
    { path: '/admin/:board', name: 'Classes', Component: BoardPage },
    { path: '/admin/:board/:class', name: 'Subjects', Component: SubjectPage },
    { path: '/admin/:board/:class/:subject', name: 'Chapters', Component: ChapterPage },
    { path: '/admin/:board/:class/:subject/:chapter', name: 'Slabs', Component: SlabsPage },
    { path: '/admin/:board/:class/:subject/:chapter/:slab', name: 'Questions', Component: SlabPage },
]

const AdminRoutes = ({ authenticated, dispatch, userName }) => {

    useEffect(() => {
        dispatch(getAdminData());
        dispatch(getBoards())
    }, [dispatch])

    return (
        <div className="row m-0">
            <Helmet>
                <title>Admin</title>
            </Helmet>
            {/* <BrowserRouter> */}
            {authenticated && <SideBar />}
            {/* <div className="col main-container p-0"> */}
            {/* <TopBar authenticated={ authenticated } userName={userName}/> */}
            {/* <div className="left-container"> */}
            <Switch>
                <Route exact path="/admin/signin" component={SignIn} />

                {routes.map(({ path, Component }, key) => (
                    <AuthRoute exact path={path} key={key} userName={userName} authenticated={authenticated} component={Component} />
                ))}
                {/* <AuthRoute exact path="/admin/teachers" authenticated={authenticated} component={TeachersPage}/>
                            <AuthRoute exact path="/admin/:board" authenticated={authenticated} component={BoardPage}/>
                            <AuthRoute exact path="/admin/:board/:class" authenticated={authenticated} component={SubjectPage}/>
                            <AuthRoute exact path="/admin/:board/:class/:subject" authenticated={authenticated} component={ChapterPage}/>
                            <AuthRoute exact path="/admin/:board/:class/:subject/:chapter" authenticated={authenticated} component={SlabsPage}/>
                            <AuthRoute exact path="/admin/:board/:class/:subject/:chapter/:slab" authenticated={authenticated} component={SlabPage}/> */}

                <Route component={() => <Redirect to="/admin" />} />
            </Switch>
            {/* </div> */}
            {/* </div> */}
            {/* </BrowserRouter> */}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.admin.authenticated,
        userName: state.admin?.admin?.name
    }
}

export default connect(mapStateToProps)(AdminRoutes)
