import './main.scss'
import { useEffect } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import jwtDecode from 'jwt-decode'
import axios from '../api'
import { Helmet } from 'react-helmet-async'
//pages
import TeacherPage from "../pages/teacher/home"
import TeacherClassesPage from "../pages/teacher/classPage"
import TeacherChaptersPage from '../pages/teacher/subject'
import TeacherSlabsPage from "../pages/common/chapter"
import TeacherSlabPage from "../pages/teacher/slab"
import SignIn from '../components/signIn/SignIn'
//components
import SideBar from "../components/layout/sidebar/SideBar"
// import TopBar from "../components/layout/topbar/TopBar"

import { connect } from 'react-redux'
import { getBoards } from '../redux/actions/dataAction'
import { getTeacherData, logoutTeacher, refreshToken } from '../redux/actions/teacherAction'
import { SET_TEACHER_AUTHENTICATED } from '../redux/actionTypes'
import AuthRoute from '../utils/AuthRoute'

export const routes = [
    { path: '/teacher', name: 'Home', Component: TeacherPage},
    { path: '/teacher/:board/:class', name: 'Subjects', Component: TeacherClassesPage},
    { path: '/teacher/:board/:class/:subject', name: 'Chapters', Component: TeacherChaptersPage},
    { path: '/teacher/:board/:class/:subject/:chapter', name: 'Slabs', Component: TeacherSlabsPage},
    { path: '/teacher/:board/:class/:subject/:chapter/:slab', name: 'Questions', Component: TeacherSlabPage},
]

const Routes = ({ dispatch, authenticated, userName }) => {

    useEffect(() => {
        dispatch(getTeacherData());
        dispatch(getBoards())
      }, [dispatch])

    return (
        <>
        
        <div className="row m-0">
            <Helmet>
                <title>Teacher</title>
            </Helmet>
            { authenticated && <SideBar/> }
            {/* <div className="col main-container p-0"> */}
                {/* <TopBar authenticated={ authenticated } userName={userName}/> */}
                {/* <div className="left-container"> */}
                    <Switch>
                        <Route exact path="/teacher/signin" component={SignIn}/>

                        {routes.map(({path, Component}, key) => (
                            <AuthRoute exact path={path} key={key} authenticated={authenticated} userName={userName} component={Component}/>
                        ))}

                        {/* <AuthRoute exact path="/teacher" authenticated={authenticated} component={TeacherPage}/>
                        <AuthRoute exact path="/teacher/:board/:class" authenticated={authenticated} component={TeacherClassesPage}/>
                        <AuthRoute exact path="/teacher/:board/:class/:subject/" authenticated={authenticated} component={TeacherChaptersPage}/>
                        <AuthRoute exact path="/teacher/:board/:class/:subject/:chapter" authenticated={authenticated} component={TeacherSlabsPage}/>
                        <AuthRoute exact path="/teacher/:board/:class/:subject/:chapter/:slab" authenticated={authenticated} component={TeacherSlabPage}/> */}
                        
                        <Route component={() => <Redirect to="/teacher"/>}/>
                    </Switch>
                {/* </div> */}
            {/* </div> */}
        </div>
    </>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticated: state.teacher.authenticated,
        userName: state.teacher?.teacher?.name
    }
}

export default connect(mapStateToProps)(Routes)
