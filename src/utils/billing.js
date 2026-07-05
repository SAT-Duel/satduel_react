import api from '../components/api';

export function billingErrorMessage(error, fallback = 'Billing is not available yet.') {
    const data = error.response?.data;
    if (data?.error === 'stripe_not_configured') {
        return 'Billing is being configured. Please try again soon.';
    }
    return data?.detail || data?.error || fallback;
}

async function redirectFromBillingEndpoint(path) {
    const response = await api.post(path);
    if (!response.data?.url) {
        throw new Error('Stripe did not return a redirect URL.');
    }
    window.location.assign(response.data.url);
}

export function startPremiumCheckout() {
    return redirectFromBillingEndpoint('api/billing/create_checkout_session/');
}

export function openBillingPortal() {
    return redirectFromBillingEndpoint('api/billing/create_portal_session/');
}
