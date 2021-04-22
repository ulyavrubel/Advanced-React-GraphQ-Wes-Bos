import Link from 'next/link';
import { useMemo } from 'react';
import { useCart } from '../lib/cartState';
import CartCount from './CartCount';
import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';

export default function Nav() {
    const user = useUser();
    const {openCart} = useCart();

    const cartCount = useMemo(
        () => (user?.cart || []).reduce((tally, cartItem) => tally + cartItem.quantity, 0),
        [user]
    );

    return (
        <NavStyles>
            <Link href='/products'>Products</Link>
            {
                user &&
                    <>
                        <Link href='/sell'>Sell</Link>
                        <Link href='/orders'>Orders</Link>
                        <Link href='/account'>Account</Link>
                        <SignOut/>
                        <button onClick={openCart}>
                            My Cart
                            <CartCount count={cartCount}/>
                        </button>
                    </>
            }
            {
                !user &&
                    <Link href='/signin'>Sign In</Link>
            }
        </NavStyles>
    );
}
