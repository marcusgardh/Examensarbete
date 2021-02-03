import React, { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordValidation, setPasswordValidation] = useState('');
    const [callback, setCallback] = useState(<p></p>);

    // function that sets user-written email
    function updateEmail(e: ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    // function that sets user-written password
    function updatePassword(e: ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    // function that sets user-written password for validation
    function updatePasswordValidation(e: ChangeEvent<HTMLInputElement>) {
        setPasswordValidation(e.target.value);
    }
    
    // function that checks if user-written password is same as validation,
    // if true try to post the user information to backend and if error,
    // return information to help guide user
    function signup(e: FormEvent) {
        e.preventDefault();
        if (password === passwordValidation) {
                
            axios.post('/api/signup', {email: email, password: password}).then(
                () => {
                    setCallback(<p>Grattis, du finns nu i vårt system, du kanske vill <Link to='/login'>logga in</Link></p>)
                }
            ).catch(
                error => {
                    if (error.response.status === 401) {
                        setCallback(<p>Mailen finns redan i vårt system, prova en annan mail eller <Link to='/login'>logga in</Link></p>)
                    }
                }
            );
        }

        else {
            setCallback(<p>Lösenorden matchar inte</p>)
        }
    }

    return (
        <div>
            <form onSubmit={signup}>
                <input type='email' placeholder='Mail' autoComplete='username' value={email} onChange={updateEmail} />
                <input type='password' placeholder='Lösenord' autoComplete='current-password' value={password} onChange={updatePassword} />
                <input type='password' placeholder='Upprepa lösenord' autoComplete='current-password' value={passwordValidation} onChange={updatePasswordValidation} />
                <button type="submit">Skapa konto</button>
            </form>
            {callback}
        </div>
    );
}