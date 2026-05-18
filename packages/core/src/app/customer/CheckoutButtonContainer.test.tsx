import {
    type CheckoutService,
    createCheckoutService,
    type Customer,
    type PaymentMethod,
    type StoreConfig,
} from '@bigcommerce/checkout-sdk';
import React, { type FunctionComponent } from 'react';

import {
    CheckoutProvider,
    LocaleContext,
    type LocaleContextType,
} from '@bigcommerce/checkout/contexts';
import { createLocaleContext } from '@bigcommerce/checkout/locale';
import { getGuestCustomer } from '@bigcommerce/checkout/test-mocks';
import { render, screen } from '@bigcommerce/checkout/test-utils';

import { getStoreConfig } from '../config/config.mock';

import CheckoutButtonContainer from './CheckoutButtonContainer';

jest.mock('./resolveCheckoutButton', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const React = require('react');

    return {
        __esModule: true,
        default: ({ id }: { id: string }) => () =>
            React.createElement('div', { 'data-test': `${id}CheckoutButton` }),
    };
});

describe('CheckoutButtonContainer', () => {
    let checkoutService: CheckoutService;
    let localeContext: LocaleContextType;
    let config: StoreConfig;
    let CheckoutButtonContainerTest: FunctionComponent<Partial<TestProps>>;

    interface TestProps {
        isPaymentStepActive: boolean;
        checkEmbeddedSupport: jest.Mock;
        onUnhandledError: jest.Mock;
        onWalletButtonClick: jest.Mock;
    }

    const setupCheckoutState = ({
        providers = [],
        paymentMethods = [],
        customer = getGuestCustomer(),
        isPaymentDataRequired = true,
    }: {
        providers?: string[];
        paymentMethods?: PaymentMethod[];
        customer?: Customer | undefined;
        isPaymentDataRequired?: boolean;
    } = {}) => {
        jest.spyOn(checkoutService.getState().data, 'getConfig').mockReturnValue({
            ...config,
            checkoutSettings: {
                ...config.checkoutSettings,
                remoteCheckoutProviders: providers,
            },
        });
        jest.spyOn(checkoutService.getState().data, 'getPaymentMethods').mockReturnValue(
            paymentMethods,
        );
        jest.spyOn(checkoutService.getState().data, 'getCustomer').mockReturnValue(customer);
        jest.spyOn(checkoutService.getState().data, 'isPaymentDataRequired').mockReturnValue(
            isPaymentDataRequired,
        );
    };

    beforeEach(() => {
        checkoutService = createCheckoutService();
        localeContext = createLocaleContext(getStoreConfig());
        config = getStoreConfig();

        CheckoutButtonContainerTest = (props) => (
            <CheckoutProvider checkoutService={checkoutService}>
                <LocaleContext.Provider value={localeContext}>
                    <CheckoutButtonContainer
                        checkEmbeddedSupport={jest.fn()}
                        isPaymentStepActive={false}
                        onUnhandledError={jest.fn()}
                        onWalletButtonClick={jest.fn()}
                        {...props}
                    />
                </LocaleContext.Provider>
            </CheckoutProvider>
        );
    });

    it('renders every supported wallet button when no payment method is hidden', () => {
        setupCheckoutState({
            providers: ['googlepaystripeocs', 'braintreevisacheckout'],
        });

        render(<CheckoutButtonContainerTest />);

        expect(screen.getByTestId('googlepaystripeocsCheckoutButton')).toBeInTheDocument();
        expect(screen.getByTestId('braintreevisacheckoutCheckoutButton')).toBeInTheDocument();
    });

    it('filters out a wallet button when its payment method has initializationData.isHidden = true', () => {
        setupCheckoutState({
            providers: ['googlepaystripeocs', 'braintreevisacheckout'],
            paymentMethods: [
                {
                    id: 'googlepaystripeocs',
                    initializationData: { isHidden: true },
                } as PaymentMethod,
            ],
        });

        render(<CheckoutButtonContainerTest />);

        expect(screen.queryByTestId('googlepaystripeocsCheckoutButton')).not.toBeInTheDocument();
        expect(screen.getByTestId('braintreevisacheckoutCheckoutButton')).toBeInTheDocument();
    });

    it('keeps a wallet button when initializationData.isHidden is false', () => {
        setupCheckoutState({
            providers: ['googlepaystripeocs'],
            paymentMethods: [
                {
                    id: 'googlepaystripeocs',
                    initializationData: { isHidden: false },
                } as PaymentMethod,
            ],
        });

        render(<CheckoutButtonContainerTest />);

        expect(screen.getByTestId('googlepaystripeocsCheckoutButton')).toBeInTheDocument();
    });

    it('keeps a wallet button when initializationData is missing', () => {
        setupCheckoutState({
            providers: ['googlepaystripeocs'],
            paymentMethods: [
                {
                    id: 'googlepaystripeocs',
                } as PaymentMethod,
            ],
        });

        render(<CheckoutButtonContainerTest />);

        expect(screen.getByTestId('googlepaystripeocsCheckoutButton')).toBeInTheDocument();
    });

    it('keeps a wallet button when no matching payment method exists', () => {
        setupCheckoutState({
            providers: ['googlepaystripeocs'],
            paymentMethods: [
                {
                    id: 'braintreevisacheckout',
                    initializationData: { isHidden: true },
                } as PaymentMethod,
            ],
        });

        render(<CheckoutButtonContainerTest />);

        expect(screen.getByTestId('googlepaystripeocsCheckoutButton')).toBeInTheDocument();
    });

    it('renders nothing when every supported method is hidden', () => {
        setupCheckoutState({
            providers: ['googlepaystripeocs'],
            paymentMethods: [
                {
                    id: 'googlepaystripeocs',
                    initializationData: { isHidden: true },
                } as PaymentMethod,
            ],
        });

        render(<CheckoutButtonContainerTest />);

        expect(screen.queryByTestId('googlepaystripeocsCheckoutButton')).not.toBeInTheDocument();
    });

    it('falls back to an empty payment method list when getPaymentMethods returns undefined', () => {
        jest.spyOn(checkoutService.getState().data, 'getConfig').mockReturnValue({
            ...config,
            checkoutSettings: {
                ...config.checkoutSettings,
                remoteCheckoutProviders: ['googlepaystripeocs'],
            },
        });
        jest.spyOn(checkoutService.getState().data, 'getPaymentMethods').mockReturnValue(undefined);
        jest.spyOn(checkoutService.getState().data, 'getCustomer').mockReturnValue(
            getGuestCustomer(),
        );
        jest.spyOn(checkoutService.getState().data, 'isPaymentDataRequired').mockReturnValue(true);

        render(<CheckoutButtonContainerTest />);

        expect(screen.getByTestId('googlepaystripeocsCheckoutButton')).toBeInTheDocument();
    });
});
