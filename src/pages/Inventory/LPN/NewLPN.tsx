import React, {useEffect, useRef, useState} from 'react';
import Form from "../../../components/form/Form";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import {ComponentInboundProp} from "../../../interfaces/Component";
import {getComponentInbound} from "../../../api/ComponentApiService";
import {LPNRequestProp} from "../../../interfaces/LPN";
import {CalenderIcon} from "../../../icons";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Button from "../../../components/ui/button/Button";
import {useNotification} from "../../../context/NotificationContext";
import Loader from "../../UiElements/Loader/Loader";
import {BayLocationProp} from "../../../interfaces/BayLocation";
import {getBayLocations} from "../../../api/BayLocationApiService";
import VirtualKeyboard from "../../UiElements/VirtualKeyBoard/VirtualKeyboard";
import {createNewLpn} from "../../../api/LpnApiService";

import {useSidebar} from "../../../context/SidebarContext";
import useGoBack from "../../../hooks/useGoBack";
import {generateZplLpnLabel, generateZplSkuLabel} from "../../../utils/labelGenerator";


const defaultLpnRequest: LPNRequestProp = {
    tagID: "",
    sku: "",
    containerNumber: "",
    quantity: 12, // Quantity should remain as a number
    bayCode: "",
    date: new Date().toISOString(),
};


export default function NewLPN() {

    const {isMobile} = useSidebar();
    const goBack = useGoBack();

    const [lpnRequest, setLpnRequest] = useState<LPNRequestProp>(defaultLpnRequest);

    const [componentInboundData, setComponentInboundData] = useState<ComponentInboundProp[]>([]);
    const [filteredComponents, setFilteredComponents] = useState<ComponentInboundProp[]>([]);

    const [bayLocationData, setBayLocationData] = useState<BayLocationProp[]>([]);
    const [filteredBayLocation, setFilteredBayLocation] = useState<BayLocationProp[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing

    const [showKeyboard, setShowKeyboard] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [showCalendar, setShowCalendar] = useState(false); // State to toggle calendar visibility

    const {sendNotification} = useNotification();

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({
        tagID: false,
        sku: false,
        quantity: false,
        bayCode: false,
    });

    // A debounce hook to limit state updates
    const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
        const debounceRef = useRef<NodeJS.Timeout | null>(null);

        return (...args: any[]) => {
            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    };

    const handleKeyboardChange = useDebounce((input: string, type: string) => {
        if (type === "tagID") handleInputTagIDChange(input)
        if (type === "sku") handleInputSKUChange(input)
        if (type === "containerNumber") {
            setLpnRequest((prevState) => ({
                ...prevState,
                containerNumber: input,
            }));
        }
        if (type === "bayCode") handleInputBayLocationChange(input)
    }, 200);

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

        const fetchBayLocationData = async () => {
            try {
                const data = await getBayLocations();
                setBayLocationData(data); // Save the fetched data
            } catch (error) {
                console.error("Failed to fetch bay location data:", error);
                setLoading(false);
            }
        }
        setTimeout(() => {
            setLoading(false);
        }, 1000);

        fetchBayLocationData()
        fetchComponentInboundData();
    }, []);


    const handleInputTagIDChange = (input: string) => {
        setLpnRequest((prevState) => ({
            ...prevState,
            tagID: input,
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            tagID: false,
        }));
    }


    const handleInputSKUChange = (value: string) => {
        setLpnRequest((prevState) => ({
            ...prevState,
            sku: value, // Replace "newSkuValue" with the desired value
        }));

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current); // Clear previous timer
        }

        // Delay the filtering for better performance
        debounceTimer.current = setTimeout(() => {
            filterComponents(value);
        }, 300); // Debounce time (e.g., 300ms)

        // Clear validation error immediately after fixing the field
        setErrors((prevErrors) => ({
            ...prevErrors,
            sku: false,
        }));
    };


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
            // Find the matching bay location based on the `defaultSku`
            const matchingBayLocation = bayLocationData.find(
                (location) => location.defaultSku === exactMatch.sku
            );

            // If there's an exact match, preselect it
            setLpnRequest((prevState) => ({
                ...prevState,
                sku: exactMatch.sku, // Automatically set the SKU in state
                quantity: exactMatch.palletCapacity || 12,
            }));

            setFilteredComponents([]); // Clear the filteredComponents list since we autoselected
        } else {
            // Otherwise, set the filtered results normally
            setFilteredComponents(results);
        }
    };


    const handleComponentSelect = (component: ComponentInboundProp) => {
        // Find the matching bay location based on the `defaultSku`
        const matchingBayLocation = bayLocationData.find(
            (location) => location.defaultSku === component.sku
        );


        setLpnRequest((prevState) => ({
            ...prevState,
            sku: component.sku, // Replace "newSkuValue" with the desired value
            quantity: component.palletCapacity || 12,
        }));

        setFilteredComponents([]);
    };


    const handleInputBayLocationChange = (value: string) => {
        // Clear validation error immediately after fixing the field
        setErrors((prevErrors) => ({
            ...prevErrors,
            bayCode: false,
        }));

        setLpnRequest((prevState) => ({
            ...prevState,
            bayCode: value, // Replace "newSkuValue" with the desired value
        }));

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current); // Clear previous timer
        }

        // Delay the filtering for better performance
        debounceTimer.current = setTimeout(() => {
            filterBayLocation(value);
        }, 300); // Debounce time (e.g., 300ms)
        // Check for an exact match
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

    const filterBayLocation = (value: string) => {
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
            // If there's an exact match, preselect it
            setLpnRequest((prevState) => ({
                ...prevState,
                bayCode: exactMatch.bayCode, // Automatically set the SKU in state
            }));

            setFilteredBayLocation([]); // Clear the filteredComponents list since we autoselected
        } else {
            // Otherwise, set the filtered results normally
            setFilteredBayLocation(results);
        }
    };


    const handleBayLocationSelect = (bay: BayLocationProp) => {
        setLpnRequest((prevState) => ({
            ...prevState,
            bayCode: bay.bayCode, // Replace "newSkuValue" with the desired value
        }));

        setFilteredBayLocation([]);
    };


    // Format date as "YYYY-MM-DD" for an input type="date"
    const formatDateForInput = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
    };


    const handleSubmit = async () => {

        const newErrors: { [key: string]: boolean } = {
            tagID: !lpnRequest.tagID || lpnRequest.tagID.trim() === "",
            sku: !lpnRequest.sku || lpnRequest.sku.trim() === "",
            quantity: !lpnRequest.quantity || lpnRequest.quantity <= 0,
        };

        setErrors(newErrors);

        // Check if there are any errors
        const hasErrors = Object.values(newErrors).some((error) => error);

        if (hasErrors) {
            sendNotification(
                "error",
                "Validation Error",
                "Please fill all required fields before submitting."
            );
            console.error("Validation error:", newErrors);
            return;
        }

        setLoading(true);

        try {
            await createNewLpn(lpnRequest);

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
            setIsSubmitted(true);

        } catch (error) {
            // Handle API request error
            console.error("Error creating new LPN:", error);
            sendNotification(
                "error",
                "Submission Failed",
                "Failed to save the LPN Request. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };


    const handlePrintLabel = () => {
        const component = componentInboundData.find((item) => item.sku === lpnRequest.sku);
        const upc = component ? component.upc : "";
        const zpl = generateZplLpnLabel(lpnRequest, upc);

        // Create a Blob object with the ZPL data
        const blob = new Blob([zpl], {type: "application/octet-stream"});

        // If the browser is Safari, use a different approach
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
            // Create a file URL and open it in a new tab
            const reader = new FileReader();
            reader.onloadend = function () {
                const link = document.createElement("a");
                link.href = reader.result as string;
                link.download = "label.zpl";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.readAsDataURL(blob);
        } else {
            // For other browsers, use the usual method
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "label.zpl";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handlePrintSKULabel = () => {
        if (!lpnRequest.sku) {
            return;
        }
        const component = componentInboundData.find((item) => item.sku === lpnRequest.sku);
        const upc = component ? component.upc : "";
        const zpl = generateZplSkuLabel(upc, lpnRequest.sku);

        const blob = new Blob([zpl], {type: "application/octet-stream"});

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if (isSafari) {
            // Create a file URL and open it in a new tab
            const reader = new FileReader();
            reader.onloadend = function () {
                const link = document.createElement("a");
                link.href = reader.result as string;
                link.download = `${lpnRequest.sku}.zpl`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            };
            reader.readAsDataURL(blob);
        } else {
            // For other browsers, use the usual method
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${lpnRequest.sku}.zpl`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <>
            <Loader isLoading={loading}>
                <Form
                    onSubmit={() => {
                }}
                    className={`space-y-4 ${isMobile && "min-h-screen"}`}>
                    <div>
                        <Label className="ml-1 font-semibold">RFID Tag ID</Label>
                        <div className="relative w-full max-w-xl ">
                            <Input
                                type="text"
                                value={lpnRequest.tagID}
                                placeholder="Enter or scan"
                                className={`mt-1 block w-full bg-white pr-12 ${
                                    errors.tagID ? "border-red-500" : "border-gray-300"
                                }`}
                                onChange={(e) => {
                                    handleInputTagIDChange(e.target.value)
                                }}
                                onFocus={() => {
                                    setLpnRequest((prevState) => ({
                                        ...prevState,
                                        tagID: "",
                                    }));
                                }}

                                disabled={isSubmitted}
                            />

                            {/*{!isSubmitted && <button*/}
                            {/*    type="button"*/}
                            {/*    onClick={() => setShowKeyboard("bayCode")}*/}
                            {/*    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-transparent text-black rounded hover:bg-gray-100 transition-colors"*/}
                            {/*>*/}
                            {/*    <img src={"/images/icons/keyboard.png"} className="w-6 h-6" alt="keyboard"/>*/}
                            {/*</button>}*/}


                        </div>
                        {errors.tagID && (
                            <p className="text-sm text-red-500 mt-1">
                                Tag ID is required
                            </p>
                        )}

                    </div>

                    <div>
                        <Label className="ml-1 font-semibold">SKU</Label>
                        <div className=" flex w-full max-w-xl">
                            <div className="relative">
                                <Input
                                    type="text"
                                    value={lpnRequest.sku}
                                    placeholder="Enter or scan"
                                    className={`mt-1 block w-full bg-white ${
                                        errors.sku ? "border-red-500" : "border-gray-300"
                                    }`}
                                    onFocus={() => {
                                        setLpnRequest((prevState) => ({
                                            ...prevState,
                                            sku: "",
                                        }));
                                    }}
                                    onChange={(e) => handleInputSKUChange(e.target.value)}
                                    disabled={isSubmitted}
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
                            <div className="p-2">
                                <Button
                                    size="xs"
                                    variant="primary"
                                    className="mx-2.5"
                                    onClick={handlePrintSKULabel} // Print Label handler
                                >
                                    Print
                                </Button>
                            </div>

                        </div>

                        {errors.sku && (
                            <p className="text-sm text-red-500 mt-1">SKU is required</p>
                        )}

                    </div>


                    <div>
                        <Label className="ml-1 font-semibold">Quantity</Label>
                        <div className=" flex w-full max-w-xl">
                            <Input
                                type="number"
                                value={lpnRequest.quantity}
                                placeholder="Enter number of items"
                                className={`w-full text-theme-sm bg-white font-semibold text-center ${
                                    errors.quantity ? "border-red-500" : "border-gray-300"
                                }`}
                                onChange={(e) =>
                                    setLpnRequest((prev) => ({
                                        ...prev,
                                        quantity: parseInt(e.target.value) || 0,
                                    }))
                                }
                                disabled={isSubmitted}
                            />
                        </div>

                        {errors.quantity && (
                            <p className="text-sm text-red-500 mt-1">
                                Quantity must be greater than 0
                            </p>
                        )}
                    </div>


                    <div>
                        <Label className="ml-1 font-semibold">Container Number</Label>
                        <div className="relative w-full bg-white max-w-xl">
                            <Input
                                type="text"
                                value={lpnRequest.containerNumber}
                                placeholder="Enter or scan"
                                className="w-full pr-20 px-4 border-gray-300 py-2 border rounded"
                                onChange={(e) => setLpnRequest((prev) => ({
                                    ...prev,
                                    containerNumber: e.target.value,
                                }))
                                }
                                onFocus={() => {
                                    setLpnRequest((prevState) => ({
                                        ...prevState,
                                        containerNumber: "",
                                    }));
                                }}

                                disabled={isSubmitted}
                            />

                        </div>
                    </div>

                    <div>
                        <Label className="ml-1 font-semibold">Bay Location</Label>
                        <div className="relative w-full max-w-xl">
                            <Input
                                type="text"
                                value={lpnRequest.bayCode}
                                placeholder="Enter or scan"
                                disabled={isSubmitted}
                                className={`mt-1 block bg-white w-full ${
                                    errors.bayCode ? "border-red-500" : "border-gray-300"
                                }`}
                                onFocus={() => {
                                    setLpnRequest((prevState) => ({
                                        ...prevState,
                                        bayCode: "",
                                    }));
                                }}

                                onChange={(e) => handleInputBayLocationChange(e.target.value)}
                            />



                            {errors.bayCode && (
                                <p className="text-red-500 text-sm mt-1">
                                    Invalid Bay Code. Please select a valid Bay Code from the dropdown.
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

                        </div>
                    </div>

                    <div>
                        <Label htmlFor="datePicker" className="ml-1 font-semibold">Date</Label>
                        <div className="relative w-full bg-white max-w-xl"
                        >
                            <Input
                                type="date"
                                id="datePicker"
                                disabled={isSubmitted}
                                name="datePicker"
                                className="w-full pr-20 px-4 border-gray-300 py-2 border rounded"
                                value={formatDateForInput(lpnRequest.date)}
                                onChange={(e) => {
                                    const newDate = new Date(e.target.value);
                                    setLpnRequest({...lpnRequest, date: newDate.toISOString()});
                                }}
                            />
                            <span
                                className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 dark:text-gray-400"
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                        <CalenderIcon/>
                                    </span>
                        </div>

                        {showCalendar && !isSubmitted && (
                            <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                                <Flatpickr
                                    className="p-2"
                                    options={{
                                        enableTime: false,
                                        dateFormat: "Y-m-d",
                                        defaultDate: lpnRequest.date,
                                        clickOpens: true

                                    }}
                                    value={lpnRequest.date}
                                    onChange={(selectedDates) => {
                                        const newDate = selectedDates[0]?.toISOString() || "";
                                        setLpnRequest({...lpnRequest, date: newDate});
                                        setShowCalendar(false); // Hide calendar after selection
                                    }}
                                />
                            </div>
                        )}

                        {showKeyboard && (
                            <div className="keyboard-overlay">
                                <VirtualKeyboard
                                    input={lpnRequest.tagID}
                                    onChange={(input) => {
                                        if (showKeyboard) handleKeyboardChange(input, showKeyboard)
                                    }}
                                    onClose={() => setShowKeyboard("")} // Close keyboard modal
                                />
                            </div>
                        )}
                    </div>
                    <div
                        className={`mt-4 ${
                            isMobile
                                ? "fixed bottom-0 left-0 right-0 mt-20 w-full p-4  shadow-lg"
                                : "flex space-x-4"
                        }`}
                    >
                        {!isSubmitted ? (
                            <>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className={isMobile ? "w-full" : ""} // Add full-width style when not in mobileOpen mode
                                    onClick={handleSubmit}
                                >
                                    Save
                                </Button>
                                <Button
                                    size="sm"
                                    variant="normal"
                                    className={isMobile ? "w-full mt-2" : ""} // Full-width and spacing on mobile
                                    onClick={goBack}
                                >
                                    Back
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className={isMobile ? "w-full" : ""} // Full-width style for mobile
                                    onClick={handlePrintLabel} // Print Label handler
                                >
                                    Print
                                </Button>
                                <Button
                                    size="sm"
                                    variant="normal"
                                    className={isMobile ? "w-full mt-2" : ""} // Full-width with spacing on mobile
                                    onClick={goBack}
                                >
                                    Close
                                </Button>
                            </>
                        )}
                    </div>
                </Form>
            </Loader>
        </>
    )
}