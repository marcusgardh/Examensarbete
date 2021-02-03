import React from 'react';
import axios from 'axios';

export interface ILogout {
    validate(): void  
}

export default function Login(props: ILogout) {
    // sends a call to the backend and tells it to destroy users cookie
    axios.get('/api/logout').then(
        () => {
            props.validate();
        }
    );

    return (<></>)
}