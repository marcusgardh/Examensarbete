import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export interface ILogin {
    validate(): void;
}

export default function Login(props: ILogin) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [callback, setCallback] = useState(<p></p>)

    // function that updates the user-written mail
    function updateEmail(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    // function that updates user-written password
    function updatePassword(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }
    
    // function that tries to send the info to backend and see if user exists and if password is correct and then logs in user,
    // or gives information on what went wrong
    function login(e: FormEvent) {
        e.preventDefault();

        axios.post('/api/login', {email: email, password: password}).then(
            () => {
                props.validate();
                setCallback(<p>Välkommen!</p>);
            }
        ).catch(
            error => {
                console.log(error.response.status)
                if (error.response.status === 404) {
                    setCallback(<p>Mailen finns inte i vårt system, vill du <Link to='/signup'>skapa ett konto</Link></p>);
                }

                if (error.response.status === 401) {
                    setCallback(<p>Lösenordet är fel</p>)
                }
            }
        );
    }

    return (
        <div>
            <form onSubmit={login}>
                <input type='email' placeholder='Mail' autoComplete='username' value={email} onChange={updateEmail} />
                <input type='password' placeholder='Lösenord' autoComplete='current-password' value={password} onChange={updatePassword} />
                <button type="submit">Logga in</button>
            </form>
            {callback}
        </div>
    );
}