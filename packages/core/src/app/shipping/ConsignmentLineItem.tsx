import { ConsignmentLineItem } from "@bigcommerce/checkout-sdk";
import classNames from "classnames";
import React, { FunctionComponent, useState } from "react";

import { preventDefault } from "@bigcommerce/checkout/dom-utils";
import { TranslatedString } from '@bigcommerce/checkout/locale';
import { useCheckout , useStyleContext } from "@bigcommerce/checkout/payment-integration-api";


import { IconChevronDown, IconChevronUp } from "../ui/icon";
import { isMobileView as isMobileViewUI } from "../ui/responsive";

import AllocateItemsModal from "./AllocateItemsModal";
import ConsignmentLineItemDetail from "./ConsignmentLineItemDetail";
import { AssignItemFailedError, UnassignItemError } from "./errors";
import { useDeallocateItem } from "./hooks/useDeallocateItem";
import { useMultiShippingConsignmentItems } from "./hooks/useMultishippingConsignmentItems";
import { ItemSplitTooltip } from "./ItemSplitTooltip";
import { MultiShippingConsignmentData, MultiShippingTableItemWithType } from "./MultishippingType";

interface ConsignmentLineItemProps {
    consignmentNumber: number;
    consignment: MultiShippingConsignmentData;
    onUnhandledError(error: Error): void;
    isLoading: boolean;
}

const ConsignmentLineItem: FunctionComponent<ConsignmentLineItemProps> = ({ consignmentNumber, consignment, onUnhandledError, isLoading }: ConsignmentLineItemProps) => {
    const [isOpenAllocateItemsModal, setIsOpenAllocateItemsModal] = useState(false);
    const [showItems, setShowItems] = useState(true);

    const { unassignedItems } = useMultiShippingConsignmentItems();
    const { checkoutService: { assignItemsToAddress: assignItem } } = useCheckout();
    const deleteItem = useDeallocateItem();
    const { newFontStyle } = useStyleContext();

    const toggleAllocateItemsModal = () => {
        setIsOpenAllocateItemsModal(!isOpenAllocateItemsModal);
    }

    const handleAssignItems = async (consignmentLineItems: ConsignmentLineItem[]) => {
        try {
            await assignItem({
                address: consignment.address,
                lineItems: consignmentLineItems,
            });

        } catch (error) {
            if (error instanceof Error) {
                onUnhandledError(new AssignItemFailedError(error));
            }
        } finally {
            toggleAllocateItemsModal();
        }
    }

    const handleUnassignItems = async (itemToDelete: MultiShippingTableItemWithType) => {
        try {
            const consignmentRequest = {
                address: consignment.address,
                shippingAddress: consignment.shippingAddress,
                lineItems: [
                    {
                        quantity: itemToDelete.quantity,
                        itemId: itemToDelete.id,
                    },
                ],
            }

            await deleteItem(consignmentRequest, itemToDelete.id.toString(), consignment);
        } catch (error) {
            if (error instanceof Error) {
                onUnhandledError(new UnassignItemError(error));
            }
        }
    }

    const toggleShowItems = () => {
        setShowItems(!showItems);
    }

    const isMobileView = isMobileViewUI();

    const itemsCount = consignment.shippableItemsCount;

    return (
        <div>
            <AllocateItemsModal
                address={consignment.shippingAddress}
                assignedItems={consignment}
                consignmentNumber={consignmentNumber}
                isLoading={isLoading}
                isOpen={isOpenAllocateItemsModal}
                onAllocateItems={handleAssignItems}
                onRequestClose={toggleAllocateItemsModal}
                onUnassignItem={handleUnassignItems}
                unassignedItems={unassignedItems}
            />
            <div className="consignment-line-item-header">
                <div>
                    <h3 className={newFontStyle ? 'body-bold' : ''}>
                        <TranslatedString data={{ count: itemsCount }} id="shipping.multishipping_item_allocated_message" />
                    </h3>

                    {consignment.hasSplitItems && (
                        <ItemSplitTooltip />
                    )}
                    
                    <a
                        className={classNames('expand-items-button',
                            { 'body-cta': newFontStyle }
                        )}
                        data-test="expand-items-button"
                        href="#"
                        onClick={preventDefault(toggleShowItems)}
                    >
                        {showItems ? (
                            <>
                                {!isMobileView && <TranslatedString id="shipping.multishipping_item_hide_items_message" />}
                                <IconChevronUp />
                            </>
                        ) : (
                            <>
                                {!isMobileView && <TranslatedString id="shipping.multishipping_item_show_items_message" />}
                                <IconChevronDown />
                            </>
                        )}
                    </a>
                </div>
                <a
                    className={newFontStyle ? 'body-cta' : ''}
                    data-test="reallocate-items-button"
                    href="#"
                    onClick={preventDefault(toggleAllocateItemsModal)}
                >
                    <TranslatedString id="shipping.multishipping_item_reallocated_message" />
                </a>
            </div>
            {showItems
                ? <ConsignmentLineItemDetail lineItems={consignment.lineItems} />
                : null
            }       
        </div>
    )
}

export default ConsignmentLineItem;
