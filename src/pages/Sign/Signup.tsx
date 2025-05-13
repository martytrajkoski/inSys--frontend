import React from "react";

const Signup: React.FC = () => {
    return(
        <div className="sign">
            <h1 className="app-name">App Name</h1>
            <div className="sign-container">
                <div className="sign-info">
                    <h2>Create an account</h2>
                    <p>Enter your email to sign up for this app</p>
                </div>
                <form>
                    <input type="text" placeholder="email@domain.com"/>
                    <select>
                        <option value="" disabled selected>Choose your role</option>
                        <option value="hurr">Технички секретар</option>
                    </select>
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Signup;