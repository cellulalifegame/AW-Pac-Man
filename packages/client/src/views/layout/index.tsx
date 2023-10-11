import { Outlet } from "react-router-dom";
import "./index.scss"
import { getSrc } from "../../utils/utils";
import { Profile } from "./Connent"
import { Web3Button } from '@web3modal/react'
import { useNavigate } from 'react-router-dom';
import { useNetwork, useSwitchNetwork, useAccount} from 'wagmi';
import { useEffect, useState } from 'react';

export function Layout() {
    const navigate = useNavigate();
    const { switchNetwork }: any = useSwitchNetwork()
    const { chain }: any = useNetwork()
    const { address } = useAccount()
    const goToHome = () => {
        navigate('/home')
    }
    const handleScroll = (() => {
        const state = {
            scrollTop: 0
        }
        state.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        const element: any = document.getElementById('header-container')
        if (state.scrollTop > 0) {
            element.style.backdropFilter = 'blur(10px)'
        } else {
            element.style.backdropFilter = 'none'
        }
    })
    const [isNetwork, setIsNetwork] = useState(true)
    window.addEventListener('scroll', handleScroll, true)
    useEffect(() => {
        if (chain?.id !== 420) {
            setIsNetwork(false)
        } else {
            setIsNetwork(true)
        }
    }, [chain]);
    return (
        <section>
            <section>
                <header id={"header-container"}>
                    <div className={"logo"} onClick={goToHome}>

                    </div>
                    {/*<Profile></Profile>*/}
                    <div className={"wallet-right"}>
                        {
                            isNetwork ? '' : <div onClick={() => switchNetwork(420)} className={"network-wrong"}>
                                Wrong NetWork
                            </div>
                        }
                        <Web3Button></Web3Button>
                    </div>
                </header>
                <main>
                    <Outlet></Outlet>
                </main>
            </section>
        </section>
    )
}