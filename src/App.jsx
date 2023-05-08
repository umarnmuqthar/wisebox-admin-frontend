import ScrollToTop from "./utils/ScrollToTop"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import store from './redux'
import { HelmetProvider } from "react-helmet-async"
import { Provider } from 'react-redux'
import AdminRoutes from "./routes/AdminRoutes"
import TeacherRoutes from "./routes/TeacherRoutes"
import NetworkInterceptor from './components/responseToast/NetworkInterceptor'
import Home from './Home'
import Company from "./pages/common/company/Company"

const App = () => {

  return (
    <Router>
      <NetworkInterceptor>
        <HelmetProvider>
          <Provider store={store}>
              <ScrollToTop>
                <Switch>
                  <Route exact path="/" component={Home}/>
                  <Route path="/company/:slug" component={Company}/>
                  {/* Dashboard */}
                  <Route path='/admin' component={AdminRoutes}/>
                  <Route path='/teacher' component={TeacherRoutes}/>
                </Switch>
              </ScrollToTop>
          </Provider>
        </HelmetProvider>
      </NetworkInterceptor>
    </Router>

  )
}

export default App
