import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase.js";
import { EmailAuthProvider,reauthenticateWithCredential,updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext=createContext();

export function useAuth()
{
    return useContext(AuthContext);
}

export function AuthProvider({children})
{
    const [currentUser,setCurrentUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const navigate=useNavigate(); 

    async function signup(email,password){return await auth.createUserWithEmailAndPassword(email,password);}
    
    async function login(email,password){return await auth.signInWithEmailAndPassword(email,password);}

    async function logout(){return await auth.signOut();}

    async function resetPassword(email){return await auth.sendPasswordResetEmail(email);}

    function reauthenticateUser(currentPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email,currentPassword);
        return reauthenticateWithCredential(currentUser,credential);
    }

    function updateUserEmail(newEmail){return verifyBeforeUpdateEmail(currentUser,newEmail);}
    
    function updateUserPassword(newPassword){return updatePassword(currentUser,newPassword);}

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
            navigate('/login')
            setLoading(false);
        });
        return unsubscribe;
    }, []);
    
    const value={
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateUserEmail,
        updateUserPassword,
        reauthenticateUser
    }
    
    return(
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

