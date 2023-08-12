import React, { useRef, useState } from 'react'
import "./register.css";
import axios from 'axios';

function Register({setshowRegister}) {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [close,setClose] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {

            await axios.post("/api/users/register", newUser);
            setError(false)
            setSuccess(true)
        } catch (err) {
            setError(true)
            console.log(err)
        }
    }
   
    
    return (
        <>
        {close &&
        <div className='registerContainer'>
            <div className='logo'></div>
            <span  onClick={()=> setshowRegister(false)}style={{marginLeft:"280px",cursor:"pointer"}}>❌</span>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='username' ref={nameRef}></input>
                <input type='email' placeholder='email' ref={emailRef}></input>
                <input type="password" placeholder='password' ref={passwordRef}></input>
                <button>Register</button>
                {success &&
                    <span className='success'>Sucessful.You can login now</span>
                }
                {error &&
                    <span className='fail'>Something went wrong.</span>
                }
            </form>
        </div>
}
        </>
    )
}

export default Register