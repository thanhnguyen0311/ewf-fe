import React, {useEffect, useRef, useState} from "react";
import {LPNEditRequestProp} from "../../../interfaces/LPN";
import {useErrorHandler} from "../../../hooks/useErrorHandler";
import {useNotification} from "../../../context/NotificationContext";
import {ComponentInboundProp} from "../../../interfaces/Component";
import {getComponentInbound} from "../../../api/ComponentApiService";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import {handlePrintLabel} from "../../../utils/labelGenerator";
import Button from "../../../components/ui/button/Button";
import {editLpn} from "../../../api/LpnApiService";


interface EditLPNModalProps {
    onCancel: () => void;
    lpnProp: LPNEditRequestProp;
    setLoading: (e: boolean) => void;
}

export const EditLPN: React.FC<EditLPNModalProps> = ({onCancel, lpnProp, setLoading}) => {

    const handleError = useErrorHandler();
    const {sendNotification} = useNotification();
    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing

    const [componentInboundData, setComponentInboundData] = useState<ComponentInboundProp[]>([]);
    const [filteredComponents, setFilteredComponents] = useState<ComponentInboundProp[]>([]);

    const [lpnRequest, setLpnRequest] = useState<LPNEditRequestProp>(lpnProp);



    const handleInputSKUChange = (value: string) => {
        setLpnRequest((prevState) => ({
            ...prevState,
            sku: value,
        }));

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current); // Clear previous timer
        }

        // Delay the filtering for better performance
        debounceTimer.current = setTimeout(() => {
            filterComponents(value);
        }, 300); // Debounce time (e.g., 300ms)

        const exactMatch = componentInboundData.find(
            (component) =>
                component.sku.toLowerCase() === value.toLowerCase() || component.upc === value
        );

        if (exactMatch) {
            setLpnRequest((prevState) => ({
                ...prevState,
                sku: exactMatch.sku,
            }));
        }

    }

    const filterComponents = (value: string) => {
        if (value.trim() === "") {
            setFilteredComponents([]); // Reset filtered results if input is empty
            return;
        }

        const results = componentInboundData.filter((component) =>
            component.sku.toLowerCase().includes(value.toLowerCase()) || component.upc.includes(value)
        );

        // Check for an exact match
        const exactMatch = componentInboundData.find(
            (component) =>
                component.sku.toLowerCase() === value.toLowerCase() || component.upc === value
        );


        if (exactMatch) {

            // If there's an exact match, preselect it
            setLpnRequest((prevState) => ({
                ...prevState,
                sku: exactMatch.sku, // Automatically set the SKU in state
            }));

            setFilteredComponents([]); // Clear the filteredComponents list since we autoselected

        } else {
            // Otherwise, set the filtered results normally
            setFilteredComponents(results);
        }
    };

    const handleComponentSelect = (component: ComponentInboundProp) => {

        setLpnRequest((prevState) => ({
            ...prevState,
            sku: component.sku, // Replace "newSkuValue" with the desired value
            quantity: component.palletCapacity || 12,
        }));

        setFilteredComponents([]);
    };


    const handleSubmit = async () => {
        setLoading(true);
        // const lpnRequest = mapLPNToEditRequest(lpnProp)
        try {
            await editLpn(lpnRequest)
            // Notify user of success
            sendNotification(
                "success",
                "Success",
                "LPN has been created successfully",
                {
                    showLink: false,
                    autoHideDuration: 4000, // Optional: 4 seconds timeout
                }
            );

        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true)

        const fetchComponentInboundData = async () => {
            try {
                const data = await getComponentInbound();
                setComponentInboundData(data); // Save the fetched data
            } catch (error) {
                console.error("Failed to fetch component inbound data:", error);
                setLoading(false);
            }
        };

        setTimeout(() => {
            setLoading(false);
        }, 1000);

        fetchComponentInboundData();
    }, [setLoading]);

    return (
        <>
            <div className="flex mb-8 flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        {lpnProp.tagID}
                    </h4>

                    <div className="grid mt-4 grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <Label className="ml-1 font-semibold">SKU</Label>
                            <Input
                                type="text"
                                value={lpnRequest.sku}
                                placeholder="Enter or scan"
                                className={`mt-1 block w-full bg-white border-gray-300`}
                                onChange={(e) => handleInputSKUChange(e.target.value.trim())}
                                onFocus={() => {
                                    setLpnRequest((prevState) => ({
                                        ...prevState,
                                        sku: "",
                                    }));
                                }}
                            />

                            {/* Dropdown List */}
                            {filteredComponents.length > 0 && (
                                <ul className="absolute z-10 w-full text-theme-xm bg-white dark:bg-white border rounded shadow max-h-48 overflow-y-auto">
                                    {filteredComponents.map((component) => (
                                        <li
                                            key={component.sku} // Or a unique identifier
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleComponentSelect(component)}
                                        >
                                            <p className="text-sm">{component.sku} ({component.upc})</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        <div>
                            <Label className="ml-1 font-semibold">Quantity</Label>
                            <div className=" flex w-full max-w-xl">
                                <Input
                                    type="number"
                                    value={lpnRequest.quantity}
                                    placeholder="Enter number of items"
                                    className={`w-full text-theme-sm bg-white font-semibold text-center border-gray-300`}
                                    onChange={(e) =>
                                        setLpnRequest((prev) => ({
                                            ...prev,
                                            quantity: parseInt(e.target.value.trim()) || 0,
                                        }))
                                    }
                                />
                            </div>
                        </div>


                        <div>
                            <Label className="ml-1 font-semibold">Bay Location</Label>
                            <div className="w-full max-w-xl">
                                <Input
                                    type="text"
                                    value={lpnRequest.bayCode}
                                    placeholder="Enter or scan"
                                    className={`mt-1 block bg-white w-full border-gray-500`}
                                    onChange={(e) =>
                                        setLpnRequest((prev) => ({
                                            ...prev,
                                            bayCode: e.target.value.trim(),
                                        }))
                                }
                                />

                            </div>
                        </div>


                        <div>
                            <Label className="ml-1 font-semibold">Container Number</Label>
                            <div className="relative w-full bg-white max-w-xl">
                                <Input
                                    type="text"
                                    value={lpnRequest.containerNumber}
                                    placeholder=""
                                    className="w-full pr-20 px-4 border-gray-300 py-2 border rounded"
                                    onChange={(e) => setLpnRequest((prev) => ({
                                        ...prev,
                                        containerNumber: e.target.value.trim(),
                                    }))
                                    }
                                />

                            </div>
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
                    Save
                </Button>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                        const component = componentInboundData.find((item) => item.sku === lpnRequest.sku);
                        const upc = component ? component.upc : "";
                        handlePrintLabel(lpnRequest, upc)
                    }}
                    className={"mr-5 flex items-center"}
                >
                    Print
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
    )
}