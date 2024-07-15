import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginButton = () => {
  const handleLoginSuccess = (credentialResponse) => {
    axios.post('/auth/google/', {
      access_token: credentialResponse.credential
    }).then(res => {
      // Handle successful login
      console.log(res.data);
      // You might want to store the token and redirect the user
    }).catch(err => {
      console.error(err);
    });
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  return (
    <GoogleOAuthProvider clientId="959022396676-290ob5dbbj40o0d0rmbcods62acq4fp1.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap
        auto_select
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
