import "./signIn.scss"
import { useState } from 'react'
import { connect } from "react-redux"
import { useHistory, Redirect, useLocation } from 'react-router-dom'
import { loginAdmin } from '../../redux/actions/adminAction'
import { loginTeacher } from "../../redux/actions/teacherAction"

const SignIn = ({ dispatch, authenticated, admin, loading }) => {
    // const [ loading, setloading ] = useState(false)
    const [ isPasswordVisible, setPasswordVisible ] = useState(false)
    const [ state, setState ] = useState({ email: "", password: "" })
    const history = useHistory()  
    const location = useLocation()  

    const _onSubmit = (e) => {
        e.preventDefault()
        // setloading(true)
        //validate data
        const data = {
            ...state,
            history
        }

        const admin = location.pathname.split("/")[1] === "admin"
        admin ? dispatch(loginAdmin(data)) : dispatch(loginTeacher(data))

        // setloading(false)
    }

    const _onChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    if (authenticated) return <Redirect to={{
        pathname: location?.state?.from?.pathname ?? (admin ? "/admin" : "/teacher"),
        state: location?.state?.from?.state
    }}/>
    
    return (
        <div className="login-container">
            <div className="shadow-lg login-card">
                <div className="header border-bottom">
                    <h6>Sign In</h6>
                </div>
                <div className="form-section">
                    <form onSubmit={_onSubmit}>
                        <div className="form-floating mb-3">
                            <input type="email" 
                                name="email"
                                className="form-control" 
                                id="floatingInput" 
                                placeholder="name@example.com"
                                onChange={_onChange} 
                                value={state.email}
                            />
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="input-group">   
                            <div className="form-floating flex-grow-1">
                                <input type={isPasswordVisible ? "text" : "password"}
                                    className="form-control" 
                                    name="password"
                                    id="floatingPassword" 
                                    placeholder="Password"
                                    onChange={_onChange} 
                                    value={state.password}
                                />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <span className="input-group-text" 
                                onClick={() => setPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible
                                    ? <i className="bi bi-eye-slash-fill" title="hide"></i>
                                    : <i className="bi bi-eye-fill" title="show"></i>
                                }       
                            </span>
                        </div>
                        <div className="mt-3 col bottom-row">
                            <button type="submit" className="btn btn-primary mb-1 col-6">
                                {loading
                                    ? (
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    )
                                    : "Sign In"
                                }
                            </button>
                            {/* <p className="m-0 col-6">Forgot password?</p> */}
                        </div>
                        <div className="row bottom-row">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => {
    const admin = props.location.pathname.split("/")[1] === "admin"
    return {
        authenticated: admin ? state.admin.authenticated : state.teacher.authenticated,
        loading: admin ? state.admin.loading : state.teacher.loading,
        admin
    }
}

export default connect(mapStateToProps)(SignIn)
