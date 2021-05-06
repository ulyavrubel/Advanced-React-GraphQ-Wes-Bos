import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/dist/client/router";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import nProgress from "nprogress";
import styled from "styled-components";
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from "./User";
import { useCart } from "../lib/cartState";

const CheckoutFormStyles = styled.form`
    box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    border-radius: 5px;
    padding: 1rem;
    display: grid;
    grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CREATE_ORDER_MUTATION = gql`
    mutation CREATE_ORDER_MUTATION($token: String!) {
        checkout(token: $token) {
            id
            charge
            total
            items {
                id
                name
            }
        }
    }
`;

function CheckoutForm() {
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const {closeCart} = useCart();
    const [checkout, {error: gqlError}] = useMutation(CREATE_ORDER_MUTATION, {
        refetchQueries: [{query: CURRENT_USER_QUERY}]
    });

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        nProgress.start();

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });

        if (error) {
            setError(error);
            nProgress.done();
            return;
        }

        const order = await checkout({
            variables: {
                token: paymentMethod.id
            }
        });


        closeCart();
        setLoading(false);
        setError(indefined);
        nProgress.done();

        router.push({
            pathname: '/order',
            query: {id: order.data.checkout.id}
        });
    }

    return (
        <CheckoutFormStyles onSubmit={handleSubmit}>
            {
                error && <p style={{fontSize: 12}}>{error?.message}</p>
            }
            {
                gqlError && <p style={{fontSize: 12}}>{gqlError?.message}</p>
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
