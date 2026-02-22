import classNames from 'classnames';
import { isNumber } from 'lodash';
import React, { type FunctionComponent, memo, type ReactNode, useRef } from 'react';

import { useCheckout } from '@bigcommerce/checkout/contexts';
import { TranslatedString } from '@bigcommerce/checkout/locale';
import { CollapseCSSTransition } from '@bigcommerce/checkout/ui';

import { ShopperCurrency } from '../currency';

export interface OrderSummaryItemProps {
    id: string | number;
    amount: number;
    quantity: number;
    name: string;
    amountAfterDiscount?: number;
    image?: ReactNode;
    description?: ReactNode;
    productOptions?: OrderSummaryItemOption[];
    quantityBackordered?: number;
    quantityOnHand?: number;
    backorderMessage?: string;
}

interface Props {
    orderItem: OrderSummaryItemProps;
    shouldExapandBackorderDetails: boolean;
}

export interface OrderSummaryItemOption {
    testId: string;
    content: ReactNode;
}

const OrderSummaryItemBackorderDetails = ({ item, isExpanded }: { item: OrderSummaryItemProps; isExpanded: boolean }) => {
    const backorderDetailsRef = useRef<HTMLDivElement>(null);
    const { checkoutState } = useCheckout();
    const config = checkoutState.data.getConfig();

    if (!config?.inventorySettings?.shouldDisplayBackorderMessagesOnStorefront) {
        return null;
    }

    if (!config?.inventorySettings?.showQuantityOnBackorder && !config?.inventorySettings?.showBackorderMessage) {
        return null;
    }

    const { quantityBackordered, quantityOnHand, backorderMessage } = item;

    return (
        <CollapseCSSTransition isVisible={isExpanded} nodeRef={backorderDetailsRef}>
            <div className="product-backorder-details-container" ref={backorderDetailsRef}>
                {!!config?.inventorySettings?.showQuantityOnBackorder &&!!quantityOnHand && (
                    <div className="sub-text" data-test="cart-item-onhand-qty">
                        <TranslatedString
                            data={{ count: quantityOnHand }}
                            id="cart.ready_to_ship_count_text"
                        />
                    </div>
                )}
                {!!config?.inventorySettings?.showQuantityOnBackorder &&!!quantityBackordered && (
                    <div className="sub-text" data-test="cart-item-backorder-qty">
                        <TranslatedString
                            data={{ count: quantityBackordered }}
                            id="cart.backorder_count_text"
                        />
                    </div>
                )}
                {!!config?.inventorySettings?.showBackorderMessage && !!backorderMessage && (
                    <div className="sub-text" data-test="cart-item-backorder-message">
                        {backorderMessage}
                    </div>
                )}
            </div>
        </CollapseCSSTransition>
    );
};

const OrderSummaryItem: FunctionComponent<Props> = ({
    orderItem,
    shouldExapandBackorderDetails,
}) => {
    const {
        amount,
        amountAfterDiscount,
        image,
        name,
        productOptions,
        quantity,
        description,
    } = orderItem;

    return (
        <div className="product" data-test="cart-item">
            <figure className="product-column product-figure">{image}</figure>

            <div className="product-column product-body">
                <h4
                    className="product-title optimizedCheckout-contentPrimary body-medium"
                    data-test="cart-item-product-title"
                >
                    <span className="body-bold">
                        {`${quantity} x `}
                    </span>
                    {name}
                </h4>
                {productOptions && productOptions.length > 0 && (
                    <ul
                        className="product-options optimizedCheckout-contentSecondary sub-text-medium"
                        data-test="cart-item-product-options"
                    >
                        {productOptions.map((option, index) => (
                            <li className="product-option" data-test={option.testId} key={index}>
                                {option.content}
                            </li>
                        ))}
                    </ul>
                )}
                {description && (
                    <div
                        className="product-description optimizedCheckout-contentSecondary"
                        data-test="cart-item-product-description"
                    >
                        {description}
                    </div>
                )}
                <OrderSummaryItemBackorderDetails isExpanded={shouldExapandBackorderDetails} item={orderItem} />
            </div>

            <div className="product-column product-actions">
                {isNumber(amountAfterDiscount) && amountAfterDiscount !== amount && (
                    <div className="product-price body-medium" data-test="cart-item-product-price--afterDiscount">
                        <ShopperCurrency amount={amountAfterDiscount} />
                    </div>
                )}

                <div
                    className={classNames('product-price', 'optimizedCheckout-contentPrimary', {
                        'product-price--beforeDiscount':
                            isNumber(amountAfterDiscount) && amountAfterDiscount !== amount,
                        'body-medium': isNumber(amountAfterDiscount) && amountAfterDiscount === amount,
                        'body-regular': isNumber(amountAfterDiscount) && amountAfterDiscount !== amount,
                    })}
                    data-test="cart-item-product-price"
                >
                    <ShopperCurrency amount={amount} />
                </div>
            </div>
        </div>
    );
}

export default memo(OrderSummaryItem);
