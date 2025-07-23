import React, {useRef, useState} from "react";
import Button from "../../../components/ui/button/Button";
import {LPNEditRequestProp, mapLPNToEditRequest} from "../../../interfaces/LPN";
import Loader from "../../UiElements/Loader/Loader";
import PutAwayLPN from "./PutAwayLPN";
import BreakDownLPN from "./BreakDownLPN";
import {findLpn, removeLpn} from "../../../api/LpnApiService";
import {useErrorHandler} from "../../../hooks/useErrorHandler";
import {useNotification} from "../../../context/NotificationContext";


interface FindLPNModalProps {
    onCancel: () => void;
    mode: 'find' | 'putaway' | 'edit' | 'breakdown' | "";
    setMode: (mode: 'find' | 'putaway' | 'edit' | 'breakdown' | "") => void;
}

const FindLPN: React.FC<FindLPNModalProps> = ({onCancel, mode, setMode}) => {
    const [tagID, setTagID] = React.useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const handleError = useErrorHandler();
    const [lpnRequest, setLpnRequest] = useState<LPNEditRequestProp | null>(null);
    const {sendNotification} = useNotification();


    if (mode === "") {
        return null;
    }

    const handleClose = () => {
        setTagID("");
        setLpnRequest(null);
        setError(false)
        onCancel();
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await findLpn(tagID); // Call API to fetch LPN data
            setLpnRequest(mapLPNToEditRequest(data))
            setError(false)
        } catch (error) {
            handleError(error);
            setError(true)
        } finally {
            setLoading(false); // Hide loader
        }
    };


    const handleDelete = async () => {
        setLoading(true);
        try {
            await removeLpn(tagID);
            sendNotification(
                "success",
                "Success",
                "LPN has been removed successfully.",
                {
                    showLink: false,
                    autoHideDuration: 3000, // Optional: 4 seconds timeout
                }
            );
            onCancel()
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false); // Hide loader
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
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 ">
                                {(mode === "find") && ( !lpnRequest ? (
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
                                                    fetchData();
                                                }
                                            }}
                                            className={`
                                            w-full mt-4 px-3 py-2 border  rounded mb-4 focus:outline-none focus:ring-2 
                                            focus:ring-orange-400
                                            ${error ? "border-red-500" : "border-gray-300"}
                                            `}
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
                                                onClick={() => fetchData()}
                                            >
                                                Search
                                            </Button>
                                        </div>
                                    </>
                                ) :
                                        <div className="flex flex-col justify-start space-y-4 mb-4">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => setMode("putaway")}
                                                className="w-full flex items-center justify-center"
                                            >
                                                Put away
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => setMode("breakdown")}
                                                className="w-full flex items-center justify-center"
                                            >
                                                Breakdown
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger" // Assuming 'danger' is a predefined variant for red buttons
                                                onClick={handleDelete} // Replace with your delete functionality
                                                className="w-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600"
                                            >
                                                Remove
                                            </Button>

                                        </div>
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