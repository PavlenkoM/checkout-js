import { Cart, StoreConfig } from '@bigcommerce/checkout-sdk';

import { getCart } from '../cart/carts.mock';
import { getCustomItem } from '../cart/lineItem.mock';
import { getStoreConfig } from '../config/config.mock';

import itemsRequireShipping from './itemsRequireShipping';

describe('itemsRequireShipping()', () => {
    let cart: Cart;
    let config: StoreConfig;

    beforeEach(() => {
        cart = getCart();
        config = getStoreConfig();
    });

    it('returns false if there are no physical items or custom items', () => {
        cart.lineItems.physicalItems = [];
        cart.lineItems.customItems = [];

        expect(itemsRequireShipping(cart, config)).toBe(false);
    });

    it('returns false if there is no cart', () => {
        expect(itemsRequireShipping(undefined, config)).toBe(false);
    });

    it('returns true if there are physical items', () => {
        expect(itemsRequireShipping(cart, config)).toBe(true);
    });

    it('returns true if there are only custom items', () => {
        cart.lineItems.physicalItems = [];
        cart.lineItems.customItems = [getCustomItem()];

        expect(itemsRequireShipping(cart, config)).toBe(true);
    });
});
