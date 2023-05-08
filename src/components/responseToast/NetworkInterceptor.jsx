import { useState } from 'react'
import axios from '../../api'
import { Toast } from 'react-bootstrap'
import store from '../../redux'
import { logoutAdmin, refreshToken } from '../../redux/actions/adminAction'
import { refreshToken as trRefreshToken} from '../../redux/actions/teacherAction'
import { useLocation } from 'react-router-dom'

const NetworkInterceptor = (props) => {
    const [ error, setError ] = useState()
    const [ show, setShow ] = useState(false)
    const location = useLocation()
    const isAdmin = location?.pathname.split("/")[1] === "teacher" ? false : true

    axios.interceptors.request.use((request) => {
            const token = isAdmin ? localStorage.getItem('AdminToken')
                         : localStorage.getItem('TeacherToken')
            request.headers.common['Authorization'] = `Bearer ${token}`
            return request
        }, error => {
            return Promise.reject(error)
    })

    axios.interceptors.response.use((response) => {
            return response
        },error => {
            //TODO: handle error here other than network error (API error)
            // setError(error.response?.data.error)
            // setShow(true)
            // return Promise.reject(error)
            
            const requestObject = error.config
            // // const isAdmin = requestObject.url.includes('/admin')

            // // console.log(requestObject)
            if (error.response.status === 401 && 
                    (requestObject.url === "/admin/auth/refresh-token" 
                        || requestObject.url === "/teacher/auth/refresh-token"
                    )
            ) {
                /* logout */
                store.dispatch(logoutAdmin())
                window.location.href = `/${isAdmin ? 'admin' : 'teacher'}/signin`;
                return Promise.reject(error)
            }

            if (
                typeof error.response !== 'undefined' &&
                error.response?.status === 401 &&
                (error.response?.data.error.message === "jwt expired" || error.response?.data.error.message === "Unauthorized") &&
                !requestObject._retry
            ) {
                requestObject._retry = true

                const refTokenAction = isAdmin ? refreshToken : trRefreshToken
                
                return refTokenAction()
                        .then((token) => {
                            requestObject.headers['Authorization'] = `Bearer ${token}`
                            return axios(requestObject)
                        })
                        .catch((err) => {
                            return Promise.reject(err)
                        })

            }
            if (
                typeof error.message !== 'undefined' &&
                error.message == 'Network Error'
            ) {
                console.log(`Network Error`);
            }

            if(error.response?.status !== 401) {
                setError(error.response?.data.error)
                setShow(true)
            }
            return Promise.reject(error);
    })

    return (
        <>
            {props.children}
            <div className="position-fixed bottom-0 start-0 p-3 text-white" style={{ zIndex: 1100 }}>
                <Toast onClose={() => setShow(false)} className="bg-danger bg-gradient" 
                animation={false} show={show} delay={3000} autohide>
                    <Toast.Header closeButton={false}>
                        <strong className="me-auto">ERROR</strong>
                    </Toast.Header>
                    <Toast.Body><b>{error?.message ?? 'Something Went Wrong!'}</b></Toast.Body>
                </Toast>
            </div>
        </>
    )
}

export default NetworkInterceptor
