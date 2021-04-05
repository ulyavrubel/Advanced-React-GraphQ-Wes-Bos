import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import CartItem from './CartItem';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import { useUser } from './User';

export default function Cart() {
    const me = useUser();

    if (!me)
        return null;

    return (
        <CartStyles open>
            <header>
                <Supreme>{me.name}'s Cart</Supreme>
            </header>
            <ul>
                {me.cart.map(cartItem => <CartItem key={cartItem} cartItem={cartItem}/>)}
            </ul>
            <footer>
                <p>{formatMoney(calcTotalPrice(me.cart))}</p>
            </footer>
        </CartStyles>
    )
}
