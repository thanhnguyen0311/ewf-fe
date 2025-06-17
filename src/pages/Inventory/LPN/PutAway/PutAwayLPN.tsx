import React, {useEffect, useRef, useState} from "react";
import Button from "../../../../components/ui/button/Button";
import {LPNEditRequestProp, LPNProp, mapLPNToEditRequest} from "../../../../interfaces/LPN";
import {BayLocationProp} from "../../../../interfaces/BayLocation";
import {getBayLocations} from "../../../../api/BayLocationApiService";
import Loader from "../../../UiElements/Loader/Loader";
import { editLpn} from "../../../../api/LpnApiService";
import {useNotification} from "../../../../context/NotificationContext";
import {useErrorHandler} from "../../../../hooks/useErrorHandler";


interface PutAwayModalProps {
    visible: boolean; // Controls modal visibility
    onCancel: () => void; // Function triggered on Cancel button click
    lpnProps: LPNProp[]
}

const PutAwayLPN: React.FC<PutAwayModalProps> = ({ visible, onCancel, lpnProps }) => {
    const [tagID, setTagID] = React.useState<string>("");
    const [bayCode, setBayCode] = React.useState<string>("");

    const [bayLocationData, setBayLocationData] = useState<BayLocationProp[]>([]);
    const [filteredBayLocation, setFilteredBayLocation] = useState<BayLocationProp[]>([]);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing

    const [step, setStep] = useState<"tag" | "location">("tag");
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({
        tagID: false,
        bayCode: false
    });
    const [lpnRequest, setLpnRequest] = useState<LPNEditRequestProp | null>(null);

    const {sendNotification} = useNotification();
    const handleError = useErrorHandler();

    useEffect(() => {
        if (!visible) {
            return;
        }

        setLoading(true);

        const fetchBayLocationData = async () => {
            try {
                const data = await getBayLocations();
                setBayLocationData(data); // Save the fetched data
            } catch (error) {
                console.error("Failed to fetch bay location data:", error);
                setLoading(false);
            }
        };

        fetchBayLocationData();
        inputRef.current?.focus();

        setTimeout(() => {
            setLoading(false);
        }, 1000);

    }, [visible]);

    // Don't render the modal if it's not visible
    if (!visible) {
        return null;
    }

    const handleClose = () => {
        setTagID("");
        setBayCode("");
        setFilteredBayLocation([]);
        setStep("tag");
        setLpnRequest(null);
        setErrors({
            tagID: false,
            bayCode: false})
        onCancel();
    }

    const filterBayLocation = (value: string) => {
        setErrors({ ...errors, bayCode: false });
        if (value.trim() === "") {
            setFilteredBayLocation([]); // Reset filtered results if input is empty
            return;
        }

        const results = bayLocationData.filter((bay) =>
            bay.bayCode.toLowerCase().includes(value.toLowerCase())
        );


        // Check for an exact match
        const exactMatch = bayLocationData.find(
            (bay) =>
                bay.bayCode.toLowerCase() === value.toLowerCase()
        );


        if (exactMatch) {
            setBayCode(exactMatch.bayCode)
            setFilteredBayLocation([]); // Clear the filteredComponents list since we autoselected
        } else {
            setErrors({ ...errors, bayCode: true });
            setFilteredBayLocation(results);
        }
    };




    const handleTagIDNext = () => {
        // Check for an exact match

        const exactMatch = lpnProps.find(
            (lpn) =>
                lpn.tagID.toLowerCase() === tagID.toLowerCase()
        );
        if (exactMatch) {
            setLpnRequest(mapLPNToEditRequest(exactMatch));
            setErrors({ ...errors, tagID: false });
            setStep("location");

        } else setErrors({ ...errors, tagID: true });

    }


    const handleBayLocationSelect = (bay: BayLocationProp) => {
        setBayCode(bay.bayCode)

        setFilteredBayLocation([]);
    };

    const handleInputBayLocationChange = (value: string) => {
        setErrors({ ...errors, bayCode: true });

        setBayCode(value);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current); // Clear previous timer
        }

        // Delay the filtering for better performance
        debounceTimer.current = setTimeout(() => {
            filterBayLocation(value);
        }, 300); // Debounce time (e.g., 300ms)

        if (value.trim() !== "") {
            const exactMatch = bayLocationData.find(
                (bay) =>
                    bay.bayCode.toLowerCase() === value.toLowerCase()
            );

            if (!exactMatch) {
                // Clear validation error immediately after fixing the field
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    bayCode: true,
                }));
            }
        }
    };


    const handleSubmit = async () => {
        setLoading(true);

        const lpn = lpnRequest;

        try {
            if (lpn) {
                lpn.bayCode = bayCode;
                console.log(lpn);
                await editLpn(lpn);
            } else {
                sendNotification(
                    "error",
                    "Error",
                    "Failed to save LPN Request !",
                    {
                        showLink: false,
                        autoHideDuration: 3000, // Optional: 4 seconds timeout
                    }
                );
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
            }, 1000); // Debounce time (e.g., 300ms)
            // Notify user of success




        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
            handleClose()

        }


    }


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={handleClose}
        >
            <Loader isLoading={loading} className={"max-w-xl w-full"}>
                <div
                    className="relative bg-white rounded-lg w-full shadow-lg"
                     onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to the overlay
                >
                    <div className="p-8 text-center">

                        {step === "tag" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter Tag ID"
                                    value={tagID}
                                    ref={inputRef}
                                    onFocus={() => {
                                        setTagID("");
                                    }}
                                    onChange={(e) => setTagID(e.target.value.trim())}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleTagIDNext(); // Trigger "Next" logic on Enter key press
                                        }
                                    }}

                                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                                {errors.tagID && (
                                    <p className="text-sm text-red-500 mt-1 mb-2">
                                        Can't find LPN with this tag ID.
                                    </p>
                                )}
                                <div className="flex justify-center">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={handleTagIDNext}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}
                        {step === "location" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter bay code"
                                    value={bayCode}
                                    onChange={(e) => handleInputBayLocationChange(e.target.value.trim())}

                                    onFocus={() => {
                                        setBayCode("");
                                    }}
                                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />


                                {errors.bayCode && (
                                    <p className="text-sm text-red-500 mt-1 mb-2">
                                        Bay location is not valid.
                                    </p>
                                )}

                                {/* Dropdown List */}
                                {filteredBayLocation.length > 0 && (
                                    <ul className="absolute z-10 w-full text-theme-xm bg-white border rounded shadow max-h-48 overflow-y-auto">
                                        {filteredBayLocation.map((bay) => {
                                                const available = Math.max(0, bay.maxPallets - bay.capacity);
                                                const availabilityPercentage = (available / bay.maxPallets) * 100; // Calculate percentage

                                                // Determine color based on availability
                                                const availabilityColor =
                                                    availabilityPercentage > 50
                                                        ? "text-green-600"
                                                        : availabilityPercentage > 0
                                                            ? "text-yellow-600"
                                                            : "text-red-600";


                                                return (
                                                    <li
                                                        key={bay.bayCode} // Or a unique identifier
                                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                        onClick={() => handleBayLocationSelect(bay)}
                                                    >
                                                        <div
                                                            className="flex flex-wrap text-sm items-center gap-4 text-gray-600">
                                                        <span>Bay: <span
                                                            className="font-semibold text-gray-800">{bay.bayCode}</span></span>
                                                            <span>Max Pallets: <span
                                                                className="font-semibold text-gray-800">{bay.maxPallets}</span></span>
                                                            <span>Available: <span
                                                                className={`font-semibold text-gray-800 ${availabilityColor}`}>{available}</span></span>
                                                        </div>
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                )}

                                <div className="flex justify-center">
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </Loader>
        </div>

    );
};

export default PutAwayLPN;