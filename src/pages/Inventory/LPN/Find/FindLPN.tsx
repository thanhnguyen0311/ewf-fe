import React, {useEffect, useRef, useState} from "react";
import Button from "../../../../components/ui/button/Button";
import {LPNEditRequestProp, LPNProp, mapLPNToEditRequest} from "../../../../interfaces/LPN";
import Loader from "../../../UiElements/Loader/Loader";
import {useNotification} from "../../../../context/NotificationContext";
import {getAllLpn} from "../../../../api/LpnApiService";
import PutAwayLPN from "../PutAway/PutAwayLPN";
import BreakDownLPN from "../Breakdown/BreakDownLPN";


interface FindLPNModalProps {
    onCancel: () => void;
    mode: 'putaway' | 'edit' | 'breakdown' | "";
}

const FindLPN: React.FC<FindLPNModalProps> = ({onCancel, mode}) => {
    const [tagID, setTagID] = React.useState<string>("");
    const [lpnProps, setLpns] = useState<LPNProp[] | []>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const {sendNotification} = useNotification();
    const [lpnRequest, setLpnRequest] = useState<LPNEditRequestProp | null>(null);

    useEffect(() => {
        if (mode === "") {
            return;
        }
        setLoading(true);
        const fetchData = async () => {
            try {
                const data = await getAllLpn(); // Call API to fetch LPN data
                setLpns(data); // Set table row data
            } catch (error) {
                console.error("Error fetching LPN data: ", error);
                sendNotification(
                    "error",
                    "Error fetching LPN data",
                    error instanceof Error ? error.message : String(error)
                );
            } finally {
                setLoading(false); // Hide loader
                inputRef.current?.focus();
            }
        };

        fetchData();
    }, [mode]); // Empty dependency array ensures this runs once on mount

    // Don't render the modal if it's not visible
    if (mode === "") {
        return null;
    }

    const handleClose = () => {
        setTagID("");
        setLpnRequest(null);
        setError(false)
        onCancel();
    }


    const handleTagIDNext = () => {
        // Check for an exact match
        const exactMatch = lpnProps.find(
            (lpn) =>
                lpn.tagID.toLowerCase() === tagID.toLowerCase()
        );

        if (exactMatch) {
            setLpnRequest(mapLPNToEditRequest(exactMatch));
            setError(false);
        } else {
            setError(true);
            sendNotification(
                "error",
                "Error",
                "Can't find LPN with this tag ID. Please check your tag ID and try again. !",
                {
                    showLink: false,
                    autoHideDuration: 3000, // Optional: 4 seconds timeout
                }
            );
        }
    }


    return (
        <>
            {


                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={handleClose}
                >
                    <Loader isLoading={loading} className={"max-w-xl w-full"}>
                        <div
                            className="relative bg-white rounded-lg w-full shadow-lg"
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to the overlay
                        >
                            <div className="p-8 ">
                                {!lpnRequest && (
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
                                        {error && (
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
                                                Search
                                            </Button>
                                        </div>
                                    </>
                                )}
                                {
                                    lpnRequest && (mode === "putaway") && (
                                        <>
                                            <PutAwayLPN onCancel={handleClose} lpnProp={lpnRequest} setLoading={setLoading}/>
                                        </>
                                    )
                                }

                                {
                                    lpnRequest && (mode === "breakdown") && (
                                        <>
                                            <BreakDownLPN onCancel={handleClose} lpnProp={lpnRequest} setLoading={setLoading}/>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </Loader>
                </div>
            }
        </>
    )
}
export default FindLPN;