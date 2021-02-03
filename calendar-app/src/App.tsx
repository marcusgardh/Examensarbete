import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import {
    Navbar,
    Nav
} from'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import './styles.scss';

import Calendar from './components/calendar/Calendar';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Logout from './components/logout/Logout';
import CustomizeCalendar from './components/customize-calendar/CustomizeCalendar';
import About from './components/about/About';

function App() {
    const [token, setToken] = useState(false);

    // function that runs to see if user token exists, 
    // otherwise removes logged in-privileges from user
    async function validate() {
        await axios.get('/api/validate').then(
        response => {
            setToken(response.data.isToken);
        }
    ).catch(
        error => {
            setToken(error.response.data.isToken)
        }
    )}

    useEffect(() => {
        validate();
    }, [])

    return (
        <div className='App'>
            <Router>
                <Navbar bg='dark' variant='dark' expand='lg'>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        {token
                        ?
                        <Nav className='navbar-nav mr-auto'>
                            <Nav.Item onClick={validate}>
                                <Link to='/'>Kalender</Link>
                            </Nav.Item>
                            <Nav.Item onClick={validate}>
                                <Link to='/customize'>Skräddarsy</Link>
                            </Nav.Item>
                            <Nav.Item onClick={validate}>
                                <Link to='/about'>Om sidan</Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to='/logout'>Logga ut</Link>
                            </Nav.Item>
                        </Nav>
                        :
                        <Nav className='navbar-nav mr-auto'>
                            <Nav.Item><Link to='/'>Kalender</Link></Nav.Item>
                            <Nav.Item><Link to='/login'>Logga in</Link></Nav.Item>
                            <Nav.Item><Link to='/signup'>Skapa konto</Link></Nav.Item>
                            <Nav.Item><Link to='/about'>Om sidan</Link></Nav.Item>
                        </Nav>
                        }
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route exact path='/'>
                        <Calendar token={token} validate={validate} />
                    </Route>
                    <Route path='/signup'>
                        { token ? <Redirect to='/' /> : <Signup /> }
                    </Route>
                    <Route path='/login'>
                        { token ? <Redirect to='/' /> : <Login validate={validate}/> } 
                    </Route>
                    <Route path='/logout'>
                        { token ? <Logout validate={validate} /> : <Redirect to='/' /> } 
                    </Route>
                    <Route path='/customize'>
                        { token ?  <CustomizeCalendar token={token} /> : <Redirect to='/login' /> }              
                    </Route>
                    <Route path='/about'>
                        <About />
                    </Route>
                    <Route path='*'>
                        <Redirect to='/' />
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default App;