import React, {useEffect, useState} from "react";
import {LPNProp} from "../../../interfaces/LPN";
import {useErrorHandler} from "../../../hooks/useErrorHandler";
import {useNotification} from "../../../context/NotificationContext";
import Loader from "../../UiElements/Loader/Loader";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import {ComponentInboundProp} from "../../../interfaces/Component";
import {getComponentInbound} from "../../../api/ComponentApiService";
import Button from "../../../components/ui/button/Button";


interface EditLPNModalProps {
    onCancel: () => void;
    lpn: LPNProp
}

export const EditLPN: React.FC<EditLPNModalProps> = ({onCancel, lpn}) => {
    const [loading, setLoading] = useState<boolean>(false);

    // const {isMobile} = useSidebar();
    const handleError = useErrorHandler();
    const {sendNotification} = useNotification();

    const [componentInboundData, setComponentInboundData] = useState<ComponentInboundProp[]>([]);

    const [lpnProp, setLpnProp] = useState<LPNProp>(lpn);


    const handleClose = () => {
        onCancel();
    }

    const handleInputSKUChange = (value: string) => {
        setLpnProp((prevState) => ({
            ...prevState,
            sku: value,
        }));


        const exactMatch = componentInboundData.find(
            (component) =>
                component.sku.toLowerCase() === value.toLowerCase() || component.upc === value
        );

        if (exactMatch) {
            setLpnProp((prevState) => ({
                ...prevState,
                sku: exactMatch.sku,
            }));
        }

    }

    const handleSubmit = async () => {
        setLoading(true);
        // const lpnRequest = mapLPNToEditRequest(lpnProp)
        try {


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
    }, []);


    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                onClick={handleClose}
            >
                <Loader isLoading={loading} className={"max-w-xl w-full"}>
                    <div
                        className="relative bg-white rounded-lg w-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 ">
                            <div className="flex flex-col gap-6 lg:flex-row mb-8 lg:items-start lg:justify-between">
                                <div className="w-full p-4">
                                    <h4 className="text-lg font-semibold mb-5 text-gray-800 dark:text-white/90 lg:mb-6">
                                        Edit LPN
                                    </h4>
                                    <div>
                                        <Label className="ml-1 font-semibold">RFID Tag ID</Label>
                                        <div className="relative w-full max-w-xl ">
                                            <Input
                                                type="text"
                                                value={lpnProp.tagID}
                                                placeholder="Enter or scan"
                                                className={`mt-3 block w-full bg-white border-gray-300`}
                                                onChange={(e) => {
                                                    setLpnProp((prevState) => ({
                                                        ...prevState,
                                                        tagID: e.target.value.trim(),
                                                    }));
                                                }}
                                                onFocus={() => {
                                                    setLpnProp((prevState) => ({
                                                        ...prevState,
                                                        tagID: "",
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="ml-1 mt-5 font-semibold">SKU</Label>
                                        <div className="relative w-full max-w-xl ">
                                            <Input
                                                type="text"
                                                value={lpnProp.sku}
                                                placeholder="Enter or scan"
                                                className={`mt-3 block w-full bg-white border-gray-300`}
                                                onFocus={() => {
                                                    setLpnProp((prevState) => ({
                                                        ...prevState,
                                                        sku: "",
                                                    }));
                                                }}
                                                onChange={(e) => handleInputSKUChange(e.target.value.trim())}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="ml-1 mt-5 font-semibold">Quantity</Label>
                                        <div className=" flex w-full max-w-xl">
                                            <Input
                                                type="number"
                                                value={lpnProp.quantity}
                                                placeholder="Enter number of items"
                                                className={` mt-3 w-full text-theme-sm bg-white font-semibold text-center border-gray-300`}
                                                onChange={(e) =>
                                                    setLpnProp((prev) => ({
                                                        ...prev,
                                                        quantity: parseInt(e.target.value.trim()) || 0,
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <Label className="ml-1 mt-5 font-semibold">Bay Location</Label>
                                        <div className=" flex w-full max-w-xl">
                                            <Input
                                                type="text"
                                                value={lpnProp.bayCode}
                                                placeholder=""
                                                className={` mt-3 w-full text-theme-sm bg-white font-semibold text-center border-gray-300`}
                                                onChange={(e) =>
                                                    setLpnProp((prev) => ({
                                                        ...prev,
                                                        bayCode: e.target.value.trim(),
                                                    }))
                                                }
                                            />
                                        </div>
                                    </div>


                                    <div
                                        className={`mt-5`}
                                    >
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            onClick={handleSubmit}
                                            className={"mr-10"}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="normal"
                                            onClick={onCancel}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Loader>
            </div>
        </>
    )
}