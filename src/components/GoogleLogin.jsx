import React from 'react';
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {notify} from '../utils/notify';
import {rememberPostLoginRedirect, safeRedirectPath} from '../utils/authRedirect';

const CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '161107240389-9q9viaqdig0vmehe3gahnkqte3s4d3c5.apps.googleusercontent.com';

/**
 * "Sign in with Google" button.
 *
 * Uses Google Identity Services: the button hands us a signed `credential`
 * (id_token), which we post to the backend. The backend verifies it, links or
 * creates the account by verified email, and returns our own JWTs.
 */
const GoogleLoginButton = ({redirectTo}) => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const nextPath = safeRedirectPath(redirectTo, '/trainer');

    const handleSuccess = async (credentialResponse) => {
        try {
            const baseUrl = import.meta.env.VITE_API_URL;
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const {data} = await axios.post(`${baseUrl}/api/auth/google/`, {
                credential: credentialResponse.credential,
                timezone: userTimezone,
            });

            await login(data.user, data.access, data.refresh);

            if (data.user.is_new_user) {
                if (redirectTo) rememberPostLoginRedirect(nextPath);
                navigate('/complete_profile');
            } else if (data.user.is_first_login) {
                if (redirectTo) rememberPostLoginRedirect(nextPath);
                navigate('/goal_setting');
            } else {
                navigate(nextPath);
            }
        } catch (error) {
            const msg = error.response?.data?.error || 'Google sign-in failed. Please try again.';
            notify.error(msg);
        }
    };

    const handleError = () => {
        notify.error('Google sign-in was cancelled or failed.');
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    useOneTap={false}
                    width="300"
                />
            </div>
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;
