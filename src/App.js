
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';


const auth = getAuth(app);

function App() {

  const [validated, setValidated] = useState(false)
  const [registered, setResgistered] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }

  const handleNameBlur = event => {
    setName(event.target.value)
  }

  const handlePasswordBlur = event => {
    setPassword(event.target.value);
  }

  const handleRegisteredChange = event => {
    setResgistered(event.target.checked);
  }

  const handelFormSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!/(?=.*[a-zA-Z >>!#$%&? "<<])[a-zA-Z0-9 >>!#$%&?<< ]/.test(password)) {
      setError('please enter at least one special character!!')
      return;
    }

    setValidated(true);
    setError('')

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error)
          setError(error.message)
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;

          setEmail('');
          setPassword('');
          verifyEmail()
          setUserName()
          console.log(user);
        })
        .catch(error => {
          console.error(error);
          setError(error.message)
        })
    }


    console.log('form submitted', email, password);
    event.preventDefault()
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password is resent');
      })
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
      .then(() => {
        console.log('your name working');
      })
      .catch(error => {
        setError(error.message)
      })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('Email varification sent');
      })
  }

  return (
    <div>
      <div className="registration w-50 mx-auto mt-5">
        <h2 className='text-primary'>Please {registered ? 'Log in' : 'Register'} !!</h2>
        <Form noValidate validated={validated} onSubmit={handelFormSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">

            {!registered && <Form.Group className="mb-3">
              <Form.Label>Your faltu name</Form.Label>
              <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Your Name" required />
              <Form.Control.Feedback type="invalid">
                Please provide your name.
              </Form.Control.Feedback>
            </Form.Group>}

            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>



          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Registered ?" />
          </Form.Group>
          <p className='text-danger'>{error}</p>
          <p className='text-danger'>{error}</p>
          <Button onClick={handlePasswordReset} variant="link">Forget Password ?</Button>
          <br />
          <Button variant="primary" type="submit">
            {registered ? 'LOGIN' : 'REGISTER'}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
