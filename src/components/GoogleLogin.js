import React from 'react';
import {GoogleOAuthProvider, GoogleLogin, useGoogleLogin} from '@react-oauth/google';
import api from './api'
import {Button} from "antd";
import {useAuth} from "../context/AuthContext";

const GoogleLoginButton = () => {
    const {login} = useAuth();
    const googleLogin = useGoogleLogin({
        onSuccess: async ({code}) => {
            console.log(code);
            api.post('auth/convert-token/', {
                token: code,
                backend: 'google-oauth2',
                grant_type: 'convert_token',
                client_id: process.env.REACT_APP_CLIENT_ID,
                client_secret: process.env.REACT_APP_CLIENT_SECRET,
            })
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error('Error logging in with Google', error);
                })
        },
        onError: () => {
            console.error('Login Failed');
        },
    });
    const handleGoogleLogin = (response) => {
        console.log(response);
        api
            .post(`auth/convert-token/`, {
                token: response.credential,
                backend: "google-oauth2",
                grant_type: "convert_token",
                client_id: process.env.REACT_APP_CLIENT_ID,
                client_secret: process.env.REACT_APP_CLIENT_SECRET,
            })
            .then((res) => {
                const {access_token, refresh_token} = res.data;
                console.log({access_token, refresh_token});
                login(access_token, refresh_token);
            })
            .catch((err) => {
                console.log("Error Google login", err);
            });
    };

    return (
        // <GoogleLogin
        //     onSuccess={handleLoginSuccess}
        //     onError={() => console.log('Google login failed')}
        // />
        // <Button onClick={()=>googleLogin()}>
        //     Login With Google
        // </Button>
        <GoogleLogin
            clientId="161107240389-9q9viaqdig0vmehe3gahnkqte3s4d3c5.apps.googleusercontent.com"
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={(response) => handleGoogleLogin(response)}
            render={(renderProps) => (
                <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    type="button"
                >
                    Sign in with Google
                </button>
            )}
            onFailure={(err) => console.log("Google Login failed", err)}
        />
    );
};

export default GoogleLoginButton;
