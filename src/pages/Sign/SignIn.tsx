import React, { useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";

const SignIn: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const login = async(e:any) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/auth/login', {
                email: email,
                password: password
            });

            const token = response.data.token;
            localStorage.setItem('inSys', token);
            console.log('response.data', response.data)

        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div className="sign">
            <form onSubmit={login}>
                <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>#
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default SignIn;