"use client";

import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./core/Button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import { useUserContext } from "../context/UserContext";


export const Appbar = () => {
    const route = usePathname();
    const router = useRouter();

    const [modalType, setModalType] = useState<"deposit" | "withdraw" | null>(null);

    return <div className="text-white border-b border-slate-800">
        <div className="flex justify-between items-center p-2">
            <div className="flex">
                <div className={`text-xl pl-4 flex flex-col justify-center cursor-pointer text-white`} onClick={() => router.push('/')}>
                    Exchange
                </div>
                <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${route.startsWith('/markets') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/markets')}>
                    Markets
                </div>
                <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer ${route.startsWith('/trade') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/trade/SOL_USDC')}>
                    Trade
                </div>
            </div>
            <div className="flex">
                <div className="p-2 mr-2">
                    <SuccessButton onClick={() => setModalType("deposit")}>Deposit</SuccessButton>
                    <PrimaryButton onClick={() => setModalType("withdraw")}>Withdraw</PrimaryButton>
                </div>
            </div>
        </div>
        {modalType && (
            <Modal isOpen={!!modalType} onClose={() => setModalType(null)} type={modalType} />
        )}
    </div>
}