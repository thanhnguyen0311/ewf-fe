import React, {useEffect, useRef, useState} from "react";
import Button from "../../../components/ui/button/Button";
import {LPNEditRequestProp} from "../../../interfaces/LPN";
import {breakDownLpn} from "../../../api/LpnApiService";
import {useNotification} from "../../../context/NotificationContext";
import {useErrorHandler} from "../../../hooks/useErrorHandler";
import {getLooseInventory} from "../../../api/InventoryApiService";


interface PutAwayModalProps {
    onCancel: () => void;
    lpnProp: LPNEditRequestProp;
    setLoading: (e: boolean) => void;
}

const BreakDownLPN: React.FC<PutAwayModalProps> = ({onCancel, lpnProp, setLoading}) => {
    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing
    const [looseQty, setLooseQty] = useState<number>(0)

    const {sendNotification} = useNotification();
    const handleError = useErrorHandler();

    useEffect(() => {
        const fetchLooseInventory = async () => {
            setLoading(true);
            const getLoose = await getLooseInventory(lpnProp.tagID);
            setLooseQty(getLoose);
            setLoading(false)

        };
        fetchLooseInventory();

    }, [lpnProp.tagID, setLoading]);

    const handleSubmit = async () => {
        setLoading(true);

        try {
            if (lpnProp) {
                lpnProp.status = "inactive"
                await breakDownLpn(lpnProp);
            }
            // Delay the filtering for better performance
            debounceTimer.current = setTimeout(() => {
                sendNotification(
                    "success",
                    "Success",
                    "LPN has been saved successfully",
                    {
                        showLink: false,
                        autoHideDuration: 4000, // Optional: 4 seconds timeout
                    }
                );
                onCancel()

            }, 300); // Debounce time (e.g., 300ms)
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
        }
    }


    return (

        <>
            <div className="flex mb-8 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Breakdown Pallet
                    </h4>

                    <div className="grid mt-4 grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Tag ID
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {lpnProp.tagID}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                #Container
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {lpnProp.containerNumber}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                SKU
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {lpnProp.sku}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Quantity
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {lpnProp.quantity}
                            </p>
                        </div>


                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Loose Qty
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {looseQty}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Location
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                {lpnProp.bayCode}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Status
                            </p>
                            <p className={
                                `text-sm font-semibold text-gray-800 dark:text-white/90 
                                ${lpnProp.status === "active" ? "text-green-600" : "text-red-600"}
                            `}>
                                {lpnProp.status}
                            </p>
                        </div>

                    </div>


                </div>
            </div>


            <div className="flex justify-center mt-5">
                <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSubmit}
                    className={"mr-5 flex items-center"}
                >
                    Breakdown
                </Button>
                <Button
                    size="sm"
                    variant="normal"
                    onClick={onCancel}
                    className={"mr-5 flex items-center"}
                >
                    Cancel
                </Button>
            </div>
        </>
    );
};

export default BreakDownLPN;