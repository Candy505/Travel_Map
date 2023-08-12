import React, { useRef, useState } from 'react'
import "./login.css";
import axios from 'axios';

function Login({setshowLogin,mystorage,currentUser}) {

    const [error, setError] = useState(false);
    const nameRef = useRef();
    
    const passwordRef = useRef();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: nameRef.current.value,
            password: passwordRef.current.value,
        };

        try {

          const res =  await axios.post("/api/users/login", user);
            mystorage.setItem("user",res.data.username);
            currentUser(res.data.username);
            setshowLogin(false)
            setError(false)
          
        } catch (err) {
            setError(true)
            console.log(err)
        }
    }
   
    
    return (
        <>
        {close &&
        <div className='loginContainer'>
            <div className='logo'></div>
            <span  onClick={()=> setshowLogin(false)}style={{marginLeft:"280px"}}>❌</span>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='username' ref={nameRef}></input>
                <input type="password" placeholder='password' ref={passwordRef}></input>
                <button>Login</button>
              
                {error &&
                    <span className='fail'>Something went wrong.</span>
                }
            </form>
        </div>
}
        </>
    )
}

export default Login