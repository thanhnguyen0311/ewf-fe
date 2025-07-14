import React, {useEffect, useRef, useState} from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {LPNProp} from "../../interfaces/LPN";
import {findLpnFromTagIDs} from "../../api/CountApiService";
import {useErrorHandler} from "../../hooks/useErrorHandler";
import {useSidebar} from "../../context/SidebarContext";
import {getComponentInbound} from "../../api/ComponentApiService";
import {ComponentInboundProp} from "../../interfaces/Component";
import Input from "../../components/form/input/InputField";
import Loader from "../UiElements/Loader/Loader";

export interface CountBySKUProp {
    tagIDs: string;
    sku: string;
}

export default function SearchBySKU() {
    const [isScanning, setIsScanning] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [isIdle, setIsIdle] = useState(false);
    const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null);
    const [lpnList, setLpnList] = useState<LPNProp[]>([]);
    const handleError = useErrorHandler();
    const {isMobile} = useSidebar();

    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing
    const [loading, setLoading] = useState<boolean>(true);
    const [componentInboundData, setComponentInboundData] = useState<ComponentInboundProp[]>([]);
    const [filteredComponents, setFilteredComponents] = useState<ComponentInboundProp[]>([]);

    const [request, setRequest] = useState<CountBySKUProp>({
        tagIDs: "",
        sku: ""
    });

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

    // Start listening for keyboard events when scanning starts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (isScanning) {
                setIsIdle(false);

                // If the "Enter" key is pressed, add a comma
                if (event.key === "Enter") {
                    event.preventDefault();
                    setTypedText((prev) => prev + ",");
                } else {
                    setTypedText((prev) => prev + event.key);
                }

                // Reset the timer every time a key is pressed
                if (typingTimer) {
                    clearTimeout(typingTimer);
                }
                setTypingTimer(
                    setTimeout(() => {
                        setIsIdle(true);
                        console.log("User stopped typing for 2 seconds");
                    }, 1000) // 1-second delay
                );
            }
        };

        // Add event listener on keydown
        window.addEventListener("keydown", handleKeyPress);

        // Cleanup listener and timer on unmount or when scanning stops
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
            if (typingTimer) {
                clearTimeout(typingTimer);
            }
        };
    }, [isScanning, typingTimer]);


    // Call API when the user becomes idle
    useEffect(() => {
        const fetchLPNData = async () => {
            if (isIdle && typedText) {
                try {
                    const uniqueItemsArray = Array.from(new Set(typedText.split(",").map((item) => item.trim())));
                    const processedText = uniqueItemsArray.filter((item) => item).join(",");

                    setRequest((prevState) => ({
                        ...prevState,
                        tagIDs: processedText
                    }));
                    const data = await findLpnFromTagIDs(request);
                    setLpnList(data);
                } catch (error) {
                    handleError(error);
                }
            }
        };

        fetchLPNData();
    }, [handleError, isIdle, request, typedText]);


    const handleStartScan = () => {
        setIsScanning(true); // Enable scanning
        setTypedText(""); // Clear previously typed text
        setIsIdle(false); // Reset idle state

        console.log("Scan Started");
    };

    const handleStopScan = () => {
        setIsScanning(false); // Disable scanning
        setIsIdle(false); // Reset idle state
        console.log("Scan Stopped");
    };

    const handleInputSKUChange = (value: string) => {
        setRequest((prevState) => ({
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

            // If there's an exact match, preselect it
            setRequest((prevState) => ({
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

        setRequest((prevState) => ({
            ...prevState,
            sku: component.sku,
        }));

        setFilteredComponents([]);
    };


    return (
        <>
            <PageMeta
                title="Count & Search | TailAdmin - Next.js Admin Dashboard Template"
                description=""
            />
            <PageBreadcrumb pageTitle="Count by SKU"/>
            {/* Buttons Section */}
            <Loader isLoading={loading}>
                <div className="flex flex-col items-center mt-8 space-y-4">
                    {/* Input Field */}
                    <div className=" ">
                        <div className="relative">
                            <Input
                                type="text"
                                value={request.sku}
                                placeholder="Enter or scan"
                                className={`mt-1 block w-full px-4 py-2 text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                                onFocus={() => {
                                    setRequest((prevState) => ({
                                        ...prevState,
                                        sku: "",
                                    }));
                                }}
                                onChange={(e) => handleInputSKUChange(e.target.value.trim())}
                                disabled={isScanning}
                            />

                            {/* Dropdown List */}
                            {filteredComponents.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    {filteredComponents.map((component) => (
                                        <li
                                            key={component.sku} // Or a unique identifier
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
                                            onClick={() => handleComponentSelect(component)}
                                        >
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {component.sku} ({component.upc})
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleStartScan}
                        disabled={isScanning} // Disable if already scanning
                        className={`px-6 py-3 text-white font-semibold rounded-lg ${
                            isScanning
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        Start Scan
                    </button>

                    {/* Stop Button */}
                    <button
                        onClick={handleStopScan}
                        disabled={!isScanning} // Disable if not currently scanning
                        className={`px-6 py-3 text-white font-semibold rounded-lg ${
                            !isScanning
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                    >
                        Stop
                    </button>

                    {/* Display Typed Text */}
                    <div className="mt-4 text-lg font-medium">
                        {/*{typedText && (*/}
                        {/*    <p>Typed Text: <span className="text-blue-500">{typedText}</span></p>*/}
                        {/*)}*/}

                        {/* Display LPN List */}
                        {lpnList.length > 0 && (
                            <div className="mt-8 w-full">
                                {/* Total Quantity */}
                                <p className="font-semibold text-lg text-center mb-4">
                                    Total Quantity:{" "}
                                    <span className="text-blue-600">
                                  {lpnList.reduce((sum, lpn) => sum + (lpn.quantity || 0), 0)}
                                </span>
                                </p>

                                {!isMobile ? (
                                    // Desktop Table View
                                    <table className="table-auto w-full border-collapse border border-gray-200">
                                        <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2"></th>
                                            <th className="border border-gray-300 px-4 py-2">SKU</th>
                                            <th className="border border-gray-300 px-4 py-2">Qty</th>
                                            <th className="border border-gray-300 px-4 py-2">Bay</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {lpnList.map((lpn, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border border-gray-300 px-4 py-2">{lpn.tagID}</td>
                                                <td className="border border-gray-300 px-4 py-2">{lpn.sku}</td>
                                                <td className="border border-gray-300 px-4 py-2">{lpn.quantity}</td>
                                                <td className="border border-gray-300 px-4 py-2">{lpn.bayCode}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    // Mobile View (Responsive Cards)
                                    <div className="space-y-4">
                                        {lpnList.map((lpn, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-100 shadow-md p-4 rounded-lg border border-gray-200 text-sm"
                                            >
                                                <p>
                                                    <strong>TagID:</strong> {lpn.tagID}
                                                </p>
                                                <p>
                                                    <strong>SKU:</strong> {lpn.sku}
                                                </p>
                                                <p>
                                                    <strong>Qty:</strong> {lpn.quantity}
                                                </p>
                                                <p>
                                                    <strong>Bay:</strong> {lpn.bayCode}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    <span
                                                        className={`font-bold ${
                                                            lpn.status === "active" ? "text-green-500" : "text-red-500"
                                                        }`}
                                                    >
                                                    {lpn.status}
                                                </span>
                                                </p>

                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Loader>


        </>
    );
}
