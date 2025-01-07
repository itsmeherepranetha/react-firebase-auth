import { useRef, useState } from "react"
import { Card,Form,Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function EditProfile()
{
    const emailRef=useRef();
    const currentPasswordRef=useRef();
    const newPasswordRef=useRef();
    const newPasswordConfirmRef=useRef();
    const {currentUser,updateUserEmail,updateUserPassword,reauthenticateUser}=useAuth();
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    function handleSubmit(e)
    {
        e.preventDefault();

        const promises=[];
        setLoading(true);
        setError("");
        promises.push(reauthenticateUser(currentPasswordRef.current.value));
        if(emailRef.current.value!==currentUser.email)
        {
            promises.push(updateUserEmail(emailRef.current.value).then(()=>{
                alert("A verification email has been sent to your new email. Please verify to complete the update.");
            }))
        }
        if(newPasswordConfirmRef.current.value!==newPasswordRef.current.value)
        {
            setLoading(false);
            return setError("passwords do not match");
        }
        if(newPasswordConfirmRef.current.value!==currentPasswordRef.current.value)promises.push(updateUserPassword(newPasswordRef.current.value));

        Promise.all(promises).then(()=>{ // if all the promises in the promises array are fulfilled
            return currentUser.reload();
        }).then(()=>{
            navigate('/');
        }).catch((e)=>{
            setError("Failed to update your account");
            console.log(e);
        }).finally(()=>setLoading(false))
    }
    
    return(
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Edit Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id='email' className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email}/>
                        </Form.Group>
                        <Form.Group id='current-password' className="mb-2">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" ref={currentPasswordRef} required/>
                        </Form.Group>
                        <Form.Group id='new-password' className="mb-2">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" ref={newPasswordRef} required/>
                        </Form.Group>
                        <Form.Group id='new-password-confirm' className="mb-2">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control type="password" ref={newPasswordConfirmRef} required/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Update Profile</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Cancel</Link>
            </div>
        </>
    )
}