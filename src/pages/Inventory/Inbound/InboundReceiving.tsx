import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import React, {useEffect, useRef, useState} from 'react';
import Form from "../../../components/form/Form";
import ComponentCard from "../../../components/common/ComponentCard";
import Label from "../../../components/form/Label";
import Input from "../../../components/form/input/InputField";
import {Html5QrcodeScanner} from 'html5-qrcode';
import {ComponentInboundProp} from "../../../interfaces/Component";
import {getComponentInbound} from "../../../api/ComponentApiService";
import {LPNRequestProp} from "../../../interfaces/LPN";
import LabelPreview from "../../../components/label/LabelPreview";
import {CalenderIcon} from "../../../icons";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Button from "../../../components/ui/button/Button";
import {bg} from "@fullcalendar/core/internal-common";
import {useNotification} from "../../../context/NotificationContext";
import Loader from "../../UiElements/Loader/Loader";
import {BayLocationProp} from "../../../interfaces/BayLocation";
import {getBayLocations} from "../../../api/BayLocationApiService";


const defaultLpnRequest: LPNRequestProp = {
    tagID: "",
    sku: "",
    containerNumber: "",
    quantity: 12, // Quantity should remain as a number
    bayCode: "",
    date: new Date().toISOString(),
};


export default function InboundReceiving() {
    const [lpnRequest, setLpnResquest] = useState<LPNRequestProp>(defaultLpnRequest);
    const [containerNumber, setContainerNumber] = useState(""); // To display captured result

    const [isScanning, setIsScanning] = useState(false); // To toggle camera
    const [scanTarget, setScanTarget] = useState("")

    const [componentInboundData, setComponentInboundData] = useState<ComponentInboundProp[]>([]);
    const [filteredComponents, setFilteredComponents] = useState<ComponentInboundProp[]>([]);

    const [bayLocationData, setBayLocationData] = useState<BayLocationProp[]>([]);
    const [filteredBayLocation, setFilteredBayLocation] = useState<BayLocationProp[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null); // For debouncing


    const [showCalendar, setShowCalendar] = useState(false); // State to toggle calendar visibility

    const {sendNotification} = useNotification();

    const [scanResult, setScanResult] = useState('');
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const [errors, setErrors] = useState<{ [key: string]: boolean }>({
        tagID: false,
        sku: false,
        quantity: false,
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


    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            // Initialize scanner
            scannerRef.current = new Html5QrcodeScanner(
                "qr-reader", // ID of element to render scanner
                {
                    fps: 10,    // Frames per second
                    qrbox: {
                        width: 150,
                        height: 150
                    }
                },
                false // Verbose logging disabled
            );

            // Scanner success callback
            const onScanSuccess = (decodedText: string, decodedResult: any) => {
                setScanResult(decodedText); // Save scanned text
                setIsScanning(false); // Stop scanning

                switch (scanTarget) {
                    case "sku":
                        const matchedComponent = componentInboundData.find(
                            (component) => component.upc === decodedText // Match the UPC
                        );
                        if (matchedComponent && decodedText.length > 0) {
                            setLpnResquest((prevState) => ({
                                ...prevState,
                                sku: matchedComponent.sku,
                            }));
                        }

                        break;
                    case "containerNumber":
                        setContainerNumber(decodedText);
                        break;
                    case "tagID":
                        setLpnResquest((prevState) => ({
                            ...prevState,
                            tagID: decodedText, // Update quantity
                        }));
                        break;
                    case "bayCode":
                        setLpnResquest((prevState) => ({
                            ...prevState,
                            bayCode: decodedText, // Update quantity
                        }));
                        break;
                    default:
                        break;
                }

            };

            // Error callback
            const onScanError = (errorMessage: string) => {
                console.error("Scan error:", errorMessage);
            };

            // Render scanner
            scannerRef.current.render(onScanSuccess, onScanError);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear(); // Destroy scanner on unmount
                scannerRef.current = null; // Clean up reference
            }
        };
    }, [isScanning]);




    const handleInputQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, ""); // Removes any non-numeric characters
        setLpnResquest((prevState) => ({
            ...prevState,
            quantity: numericValue === "" ? 0 : parseInt(numericValue, 10), // Update quantity
        }));

        // Clear validation error immediately after fixing the field
        setErrors((prevErrors) => ({
            ...prevErrors,
            quantity: false,
        }));

    };

    const handleInputSKUChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLpnResquest((prevState) => ({
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

        setFilteredComponents(results); // Save matched results
    };

    const handleComponentSelect = (component: ComponentInboundProp) => {
        setLpnResquest((prevState) => ({
            ...prevState,
            sku: component.sku, // Replace "newSkuValue" with the desired value
        }));

        setFilteredComponents([]);
    };


    const handleInputBayLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLpnResquest((prevState) => ({
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

        // Clear validation error immediately after fixing the field
        setErrors((prevErrors) => ({
            ...prevErrors,
            bayCode: false,
        }));
    };

    const filterBayLocation = (value: string) => {
        if (value.trim() === "") {
            setFilteredComponents([]); // Reset filtered results if input is empty
            return;
        }

        const results = componentInboundData.filter((component) =>
            component.sku.toLowerCase().includes(value.toLowerCase()) || component.upc.includes(value)
        );

        setFilteredComponents(results); // Save matched results
    };


    // Format date as "YYYY-MM-DD" for an input type="date"
    const formatDateForInput = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toISOString().split("T")[0]; // Extract "YYYY-MM-DD"
    };

    const handleScan = (type: string) => {
        setIsScanning(true)
        setScanTarget(type)
    }

    const handleSubmit = () => {
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

        setTimeout(() => {
            setLoading(false);

            sendNotification(
                "success",
                "Success",
                "LPN Request has been saved successfully",
                {
                    showLink: false,
                    autoHideDuration: 4000, // Optional: 4 seconds timeout
                }
            );
        }, 1000);

    };

    return (
        <>
            <PageMeta
                title="Inbound Receiving | East West Furniture"
                description=""
            />
            <PageBreadcrumb pageTitle="Inbound Receiving"/>

            <ComponentCard title="Create a new LPN">
                <Loader isLoading={loading}>
                    <Form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-6">
                            <div>
                                <Label>RFID Tag ID</Label>
                                <div className="relative w-full max-w-xl">
                                    <Input
                                        type="text"
                                        value={lpnRequest.tagID}
                                        placeholder="Enter or scan"
                                        className={`mt-1 block w-full ${
                                            errors.tagID ? "border-red-500" : "border-gray-300"
                                        }`}
                                        onChange={(e) => {
                                            const {value} = e.target; // Extract value for better readability

                                            setLpnResquest((prevState) => ({
                                                ...prevState,
                                                tagID: value, // Set the tagID field
                                            }));

                                            setErrors((prevErrors) => ({
                                                ...prevErrors,
                                                tagID: false, // Ensure `field` is defined in the scope
                                            }));
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleScan("tagID")}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-transparent text-black rounded"
                                    >
                                        <img src={"/images/icons/qr-code.png"} className="w-6" alt="QR Code"/>
                                    </button>
                                </div>
                                {errors.tagID && (
                                    <p className="text-sm text-red-500 mt-1">Tag ID is required</p>
                                )}

                            </div>

                            <div>
                                <Label>SKU</Label>
                                <div className="relative w-full max-w-xl">
                                    <Input
                                        type="text"
                                        value={lpnRequest.sku}
                                        placeholder="Enter or scan"
                                        className={`mt-1 block w-full ${
                                            errors.sku ? "border-red-500" : "border-gray-300"
                                        }`}
                                        onChange={handleInputSKUChange}
                                    />
                                    {/* Dropdown List */}
                                    {filteredComponents.length > 0 && (
                                        <ul className="absolute z-10 w-full text-theme-xm bg-white border rounded shadow max-h-48 overflow-y-auto">
                                            {filteredComponents.map((component) => (
                                                <li
                                                    key={component.sku} // Or a unique identifier
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                    onClick={() => handleComponentSelect(component)}
                                                >
                                                    {component.sku} ({component.upc})
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleScan("sku")}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-transparent text-black rounded"
                                    >
                                        <img src={"/images/icons/qr-code.png"} className="w-6" alt="QR Code"/>
                                    </button>
                                </div>

                                {errors.sku && (
                                    <p className="text-sm text-red-500 mt-1">SKU is required</p>
                                )}

                            </div>
                            <div>
                                <Label>Quantity</Label>
                                <div className="relative w-24">
                                    <Input
                                        type="number"
                                        value={lpnRequest.quantity}
                                        placeholder="Enter number of items"
                                        className={`mt-1 block w-full ${
                                            errors.quantity ? "border-red-500" : "border-gray-300"
                                        }`}
                                        onChange={handleInputQuantityChange}
                                    />
                                </div>
                                {errors.quantity && (
                                    <p className="text-sm text-red-500 mt-1">
                                        Quantity must be greater than 0
                                    </p>
                                )}

                            </div>
                            <div>
                                <Label>Container Number</Label>
                                <div className="relative w-full max-w-xl">
                                    <Input
                                        type="text"
                                        value={containerNumber}
                                        placeholder="Enter or scan"
                                        className="w-full pr-20 px-4 py-2 border rounded"
                                        onChange={(e) => setContainerNumber(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleScan("containerNumber")}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-transparent text-black rounded"
                                    >
                                        <img src={"/images/icons/qr-code.png"} className="w-6" alt="QR Code"/>
                                    </button>
                                </div>
                            </div>

                        </div>

                        {/* Modal for QR Reader */}
                        {isScanning && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md">
                                    {/* Modal Header */}
                                    <div className="flex justify-between items-center p-4 border-b">
                                        <h5 className="text-lg font-bold">Scan SKU</h5>
                                        <button
                                            onClick={() => setIsScanning(false)}
                                            className="text-gray-500 hover:text-gray-800"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Modal Body: QR Scanner */}
                                    <div className="p-4">
                                        <div id="qr-reader" style={{width: '100%'}}></div>
                                    </div>

                                    {/* Modal Footer (optional) */}
                                    <div className="flex justify-end p-4 border-t">
                                        <button
                                            onClick={() => setIsScanning(false)}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div>
                            <Label>Bay Location</Label>
                            <div className="relative w-full max-w-xl">
                                <Input
                                    type="text"
                                    value={lpnRequest.bayCode}
                                    placeholder="Enter or scan bay code"
                                    className="w-full pr-20 px-4 py-2 border rounded"
                                    onChange={(e) =>
                                        setLpnResquest((prevState) => ({
                                            ...prevState,
                                            bayCode: e.target.value, // Replace "newSkuValue" with the desired value
                                        }))}/>
                                <button
                                    type="button"
                                    onClick={() => handleScan("bayCode")}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 bg-transparent text-black rounded"
                                >
                                    <img src={"/images/icons/qr-code.png"} className="w-6" alt="QR Code"/>
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="datePicker">Date</Label>
                            <div className="relative w-full max-w-xl"
                            >
                                <Input
                                    type="date"
                                    id="datePicker"
                                    name="datePicker"
                                    value={formatDateForInput(lpnRequest.date)}
                                    onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        setLpnResquest({...lpnRequest, date: newDate.toISOString()});
                                    }}
                                />
                                <span
                                    className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 dark:text-gray-400"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                >
                                    <CalenderIcon/>
                                </span>

                            </div>

                            {showCalendar && (
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
                                            setLpnResquest({...lpnRequest, date: newDate});
                                            setShowCalendar(false); // Hide calendar after selection
                                        }}
                                    />
                                </div>
                            )}
                        </div>


                        <Button size="sm"
                                variant="outline"
                                onClick={handleSubmit}>
                            Save
                        </Button>
                    </Form>
                </Loader>
            </ComponentCard>
        </>
    )
}