import { Route, Redirect } from 'react-router-dom';
import TopBar from '../components/layout/topbar/TopBar';
import { routes as adminRoutes } from '../routes/AdminRoutes';
import { routes as teacherRoutes } from '../routes/TeacherRoutes'

const AuthRoute = ( { component: Component, authenticated, userName, ...rest}) => {
    const role = rest.path.split("/")[1]

    return (
        <Route {...rest}
            render={(props) => {
                    const crumbRoutes = role === "admin" ? adminRoutes : teacherRoutes
                    const crumbs = crumbRoutes
                        .filter(({ path }) => props.match.path.includes(path))
                        .map(({ path, ...rest }) => ({
                            path: Object.keys(props.match.params).length
                                ? Object.keys(props.match.params).reduce(
                                (path, param) => path.replace(
                                    `:${param}`, props.match.params[param]
                                ), path
                                )
                                : path,
                            ...rest
                        }));
                    // console.log(`Generated crumbs for ${props.match.path}`);
                    // crumbs.map(({ name, path }) => console.log({ name, path }));

                    return (
                        authenticated === true 
                        ? (
                            <div className="col main-container p-0">
                                <TopBar authenticated={ authenticated } userName={userName} crumbs={crumbs}/>
                                <div className="left-container">
                                    <Component {...props}/> 
                                </div>
                            </div>
                        )
                        : <Redirect to={{
                            pathname: `/${role}/signin`,
                            state: { from: props.location }
                        }}/> 
                    )
                }
            }
        /> 
    )
}

export default AuthRoute;