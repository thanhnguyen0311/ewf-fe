import React, {useEffect, useRef, useState} from "react";
import Button from "../../../../components/ui/button/Button";
import {LPNEditRequestProp} from "../../../../interfaces/LPN";
import {BayLocationProp} from "../../../../interfaces/BayLocation";
import {getBayLocations} from "../../../../api/BayLocationApiService";
import {putAwayLpn} from "../../../../api/LpnApiService";
import {useNotification} from "../../../../context/NotificationContext";
import {useErrorHandler} from "../../../../hooks/useErrorHandler";


interface PutAwayModalProps {
    onCancel: () => void;
    lpnProp: LPNEditRequestProp;
    setLoading: (e: boolean) => void;
}

const PutAwayLPN: React.FC<PutAwayModalProps> = ({onCancel, lpnProp, setLoading}) => {
    const [bayLocationData, setBayLocationData] = useState<BayLocationProp[]>([]);
    const [filteredBayLocation, setFilteredBayLocation] = useState<BayLocationProp[]>([]);
    const [bayCode, setBayCode] = useState<string>("");

    const inputRef = useRef<HTMLInputElement | null>(null);

    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing

    const [error, setError] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>("Bay location is not valid.");
    const [lpnRequest, setLpnRequest] = useState<LPNEditRequestProp>(lpnProp);

    const {sendNotification} = useNotification();
    const handleError = useErrorHandler();

    useEffect(() => {
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
        setTimeout(() => {
            setLoading(false);
            inputRef.current?.focus();
        }, 1000);

    }, [setLoading]);


    const filterBayLocation = (value: string) => {
        setError(false)
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
            setFilteredBayLocation([]);
        } else {
            setFilteredBayLocation(results);
        }
    };


    const handleBayLocationSelect = (bay: BayLocationProp) => {
        setBayCode(bay.bayCode)
        setFilteredBayLocation([]);
    };

    const handleInputBayLocationChange = (value: string) => {
        setError(false)

        setBayCode(value)

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current); // Clear previous timer
        }

        // Delay the filtering for better performance
        debounceTimer.current = setTimeout(() => {
            filterBayLocation(value);
        }, 300); // Debounce time (e.g., 300ms)


    };


    const handleSubmit = async () => {
        setLoading(true);

        try {
            if (lpnRequest) {
                lpnRequest.bayCode = bayCode
                await putAwayLpn(lpnRequest);
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
            const response = handleError(error)
            setErrorMsg(response.message)
            setError(true)
        } finally {
            setLoading(false);
        }
    }


    return (

        <>
            <div className="flex flex-col gap-6 lg:flex-row mb-8 lg:items-start lg:justify-between">
                <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                        Putaway
                    </h4>

                    <div className="grid mt-4 grid-cols-2 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Tag ID
                            </p>
                            <p className="text-sm font-normal text-gray-800 dark:text-white/90">
                                {lpnRequest.tagID}
                            </p>
                        </div>

                        <div></div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                SKU
                            </p>
                            <p className="text-md font-semibold text-gray-800 dark:text-white/90">
                                {lpnRequest.sku}
                            </p>
                        </div>
                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Qty
                            </p>
                            <p className="text-md font-semibold text-gray-800 dark:text-white/90">
                                {lpnRequest.quantity}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Current Location
                            </p>
                            <p className="text-md font-semibold text-gray-800 dark:text-white/90">
                                {lpnRequest.bayCode}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Status
                            </p>
                            <p className={
                                `text-sm font-semibold text-gray-800 dark:text-white/90 
                                ${lpnRequest.status === "active" ? "text-green-600" : "text-red-600"}
                            `}>
                                {lpnRequest.status}
                            </p>
                        </div>

                    </div>


                </div>
            </div>

            <input
                type="text"
                placeholder="Enter new location"
                value={bayCode}
                onChange={(e) => handleInputBayLocationChange(e.target.value.trim())}
                ref={inputRef}
                onFocus={() => setBayCode("")}
                className="w-full px-3 py-2 border  border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />


            {error && (
                <p className="text-sm text-red-500 mt-1 mb-2">
                    {errorMsg}
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

            <div className="flex justify-center mt-5">
                <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSubmit}
                    className={"mr-5 flex items-center"}
                >
                    Submit
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

export default PutAwayLPN;