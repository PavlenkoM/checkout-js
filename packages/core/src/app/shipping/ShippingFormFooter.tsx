import { ExtensionRegion } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent } from 'react';

import { Extension } from '@bigcommerce/checkout/checkout-extension';
import { TranslatedString } from '@bigcommerce/checkout/locale';
import { useStyleContext } from '@bigcommerce/checkout/payment-integration-api';

import { OrderComments } from '../orderComments';
import { Alert, AlertType } from '../ui/alert';
import { Button, ButtonVariant } from '../ui/button';
import { Fieldset, Legend } from '../ui/form';

import { ShippingOptions } from './shippingOption';

export interface ShippingFormFooterProps {
    cartHasChanged: boolean;
    isMultiShippingMode: boolean;
    shouldShowOrderComments: boolean;
    shouldShowShippingOptions?: boolean;
    shouldDisableSubmit: boolean;
    isInitialValueLoaded: boolean;
    isLoading: boolean;
    shippingFormRenderTimestamp?: number;
}

const ShippingFormFooter: FunctionComponent<ShippingFormFooterProps> = ({
    cartHasChanged,
    isMultiShippingMode,
    shouldShowOrderComments,
    shouldShowShippingOptions = true,
    shouldDisableSubmit,
    isInitialValueLoaded,
    isLoading,
    shippingFormRenderTimestamp,
}) => {
    const { newFontStyle } = useStyleContext();

    return (
        <>
            <Extension region={ExtensionRegion.ShippingShippingAddressFormAfter} />
            <Fieldset
                id="checkout-shipping-options"
                legend={
                    <>
                        <Legend newFontStyle={newFontStyle}>
                            <TranslatedString id="shipping.shipping_method_label" />
                        </Legend>

                        {cartHasChanged && (
                            <Alert type={AlertType.Error}>
                                <strong>
                                    <TranslatedString id="shipping.cart_change_error" />
                                </strong>
                            </Alert>
                        )}
                    </>
                }
            >
                <ShippingOptions
                    isInitialValueLoaded={isInitialValueLoaded}
                    isMultiShippingMode={isMultiShippingMode}
                    isUpdatingAddress={isLoading}
                    shippingFormRenderTimestamp={shippingFormRenderTimestamp}
                    shouldShowShippingOptions={shouldShowShippingOptions}
                />
            </Fieldset>

            {shouldShowOrderComments && <OrderComments />}

            <div className="form-actions">
                <Button
                    className={newFontStyle ? 'body-bold' : ''}
                    disabled={shouldDisableSubmit}
                    id="checkout-shipping-continue"
                    isLoading={isLoading}
                    type="submit"
                    variant={ButtonVariant.Primary}
                >
                    <TranslatedString id="common.continue_action" />
                </Button>
            </div>
        </>
    );
};

export default ShippingFormFooter;
