import React, { useState } from "react";
import { offRamp, onRamp } from "../utils/httpClient";
import { useUserContext } from "../context/UserContext";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "deposit" | "withdraw";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, type }) => {
    const [amount,setAmount] = useState(0);
    const {userId, updateBalance} = useUserContext();
    const handleTransaction = async () => {
        if(type=== "deposit") {
            await  onRamp(userId,amount);
        } else {
            await offRamp(userId,amount);
        }
        onClose();
        await updateBalance();
    }

    return isOpen ? (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex justify-center items-center">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-slate-900 p-6 rounded-lg shadow-lg w-96">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg text-white">
                            {type === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✖
                        </button>
                    </div>

                    <form>
                        <label className="text-white block mb-2">Amount</label>
                        <input
                            type="number"
                            className="w-full p-2 bg-slate-800 text-white rounded [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            placeholder="Enter amount in INR" onChange={e=> setAmount(Number(e.target.value))}
                        />

                        <button type="button" onClick={handleTransaction}
                            className={`mt-4 p-2 w-full rounded text-white ${type === "deposit" ? "bg-green-500" : "bg-blue-500"
                                }`} 
                        >
                            {type === "deposit" ? "Confirm Deposit" : "Confirm Withdraw"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    ) : <></>
};

export default Modal;
