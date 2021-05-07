import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import DisplayError from "../components/ErrorMessage";
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import styled from "styled-components";
import OrderItemStyles from '../components/styles/OrderItemStyles';
import Link from 'next/link';

const USER_ORDERS_QUERY = gql`
    query {
        allOrders {
            id
            charge
            total
            user {
                id
            }
            items {
                id
                name
                description
                price
                quantity
                photo {
                    image {
                        publicUrlTransformed
                    }
                }
            }
        }
    }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
    return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
    const {data, error, loading} = useQuery(USER_ORDERS_QUERY);

    console.log(data);

    if (loading)
        return <p>...Loading</p>;

    if (error)
        return <DisplayError error={error}/>;

    const {allOrders} = data;

    return (
        <div>
            <Head>
                <title>Your orders ({allOrders.length})</title>
            </Head>
            <h2>You have {allOrders.length} orders!</h2>
            <OrderUl>
                {
                    allOrders.map(order => (
                        <OrderItemStyles>
                            <Link href={`/order/${order.id}`}>
                                <a>
                                    <div className='order-meta'>
                                        <p>
                                            {countItemsInAnOrder(order)}
                                            Item{countItemsInAnOrder(order) > 1 ? 's' : ''}
                                        </p>
                                        <p>
                                            {order.items.length}
                                            Product{order.items.length > 1  ? 's' : ''}
                                        </p>
                                        <p>
                                            {formatMoney(order.total)}
                                        </p>
                                    </div>
                                    <div className='images'>
                                        {order.items.map(item =>
                                            <img
                                                key={item.id}
                                                src={item.photo?.image?.publicUrlTransformed}
                                                alt={item.name}
                                            />
                                        )}
                                    </div>
                                </a>
                            </Link>
                        </OrderItemStyles>
                    ))
                }
            </OrderUl>
        </div>
    )
}
