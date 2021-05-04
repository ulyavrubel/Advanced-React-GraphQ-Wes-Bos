import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import nProgress, { set } from "nprogress";
import { useState } from "react";
import styled from "styled-components";
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
    box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 5px;
    padding: 1rem;
    display: grid;
    grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const stripe = useStripe();
    const elements = useElements();

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        console.log('sick checkout')

        nProgress.start();

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });

        error && setError(error);

        console.log(error, paymentMethod);

        setLoading(false);
        // setError(indefined);
        nProgress.done();
    }

    return (
        <CheckoutFormStyles onSubmit={handleSubmit}>
            {
                error && <p style={{fontSize: 12}}>{error.message}</p>
            }
            <CardElement/>
            <SickButton>
                Check Out Now
            </SickButton>
        </CheckoutFormStyles>
    )
}

export default function Checkout() {
    return (
        <Elements stripe={stripeLib}>
            <CheckoutForm/>
        </Elements>
    )
}
