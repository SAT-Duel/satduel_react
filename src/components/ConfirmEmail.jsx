import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Spinner} from './ui';
import {notify} from '../utils/notify';
import SEO from './SEO';

function ConfirmEmail() {
    const {key} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL;
                await axios.post(`${baseUrl}/auth/registration/verify-email/`, {key});
                notify.success('Email confirmed successfully!');
                navigate('/login');
            } catch {
                notify.error('Email confirmation failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [key, navigate]);

    return (
        <div className="flex min-h-[50vh] items-center justify-center">
            <SEO
                title="Confirm Your SAT Duel Email"
                description="Confirm your SAT Duel account email."
                path="/confirm-email"
                noindex
            />
            {loading && (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-600">
                    <Spinner/> Confirming email…
                </div>
            )}
        </div>
    );
}

export default ConfirmEmail;
