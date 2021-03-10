import {PAGINATION_QUERY} from '../components/Pagination';

export default function paginationField() {
    return {
        keyArgs: false,//tells to Apollo we will take care of everything
        read(existingItems = [], {args, cache}) {
            const {skip, first} = args;

            //read the number of items on the page from cache
            const data = cache.readQuery({ query: PAGINATION_QUERY});
            const count = data?._allProductsMeta?.count;
            const page = skip / first + 1;
            const pages = Math.ceil(count / first);

            //check if we have existing items, return the items if they are already in the cache, or return false (that will make a network request)
            const items = existingItems.slice(skip, skip + first).filter(x => x);

            //if there are items and there aren't enough items and we are on the last page than  send it
            if (items.length && items.length != first && page == pages)
                return items;

            if (items.length != first)
                return false;

            if (items.length) {
                console.log(`there are ${items.length} items in the cache`);
                return items;
            }

            return false;

        },

        merge(existingItems, incomingItems, {args}) {
            //this runs when the Apollo client comes back from the network with products
            //(how do we want to put them in cache)
            const {skip, first} = args;

            const merged = existingItems
                ? existingItems.slice(0)
                : [];

            for (let i = skip; i < skip + incomingItems.length; ++i) {
                merged[i] = incomingItems[i - skip];
            }

            return merged;
        }
    }
}
