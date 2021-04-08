import { createContext, useContext, useState } from 'react';

const LocalSateContext = createContext();

const LocalStateProvider = LocalSateContext.Provider;

function CartStateProvider({children}) {
    const [cartOpen, setCartOpen] = useState(false);

    function toggleCart() {
        setCartOpen(!cartOpen);
    }

    function closeCart() {
        setCartOpen(false)
    }

    function openCart() {
        setCartOpen(true)
    }

    return (
        <LocalStateProvider value={{
            cartOpen,
            setCartOpen,
            toggleCart,
            closeCart,
            openCart
        }}>
            {children}
        </LocalStateProvider>
    );
}

function useCart() {
    //useContext is a consumer
    const all = useContext(LocalSateContext);
    return all;
}

export {CartStateProvider, useCart};
