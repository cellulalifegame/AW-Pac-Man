import { useEffect, useState } from "react";
import {getSrc} from "../../utils/utils";
import "./index.scss"
import { SelectionLife } from "./selectionLife"
import { EditSelectionStrategy } from "./selectionStrategy"
import { useNavigate, useParams } from 'react-router-dom';
import Button from "../../components/Button";
import { useAccount } from 'wagmi';
import { User } from '../../api';
export function Edit() {
    const navigate = useNavigate()
    const { address } = useAccount()
    const [userLifeList, setUserLifeList] = useState([] as any)
    const backgroundImages = ['life','strategy']
    const [step, setStep] = useState(1)
    const [activeIndex, setActiveIndex] = useState(0)
    const { level } = useParams()
    useEffect(() => {
        User.getMyLifes(address).then((res: any) => {
            setUserLifeList(res.data)
        })
    }, [address]);
    const setActiveIndexFun = (index: number) => {
        setActiveIndex(index)
    }
    const switchStatus = () => {
        if (step === 1) {
            setStep(2)
        } else {
            setStep(1)
        }
    }
    const backFun = () => {
        if (step === 1) {
            navigate('/home')
        } else {
            switchStatus()
        }
    }
    const [coins, setCoins] = useState(0)
    const getUserCoins = () => {
        User.getUserCoins(address).then((res: any) => {
            setCoins(res.data)
        })
        User.getMyLifes(address).then((res: any) => {
            setUserLifeList(res.data)
        })
    }
    useEffect(() => {
        if (address) {
            getUserCoins()
        }
    }, [address])
    return (
        <div className={"edit-container"} style={{backgroundImage: `url(${getSrc(`setout/selection-${backgroundImages[step-1]}-background.png`)})`}}>
            <div className={"navigation-container"}>
                <div className={"nav-box"}>
                    <img onClick={backFun} className={"arrow"} src={ getSrc('setout/arrow-left.png') } alt=""/>
                    {
                        step === 1 ? <div className={"nav-item"}>Life list</div> : <div className={"nav-item"}>{step === 1 ? '' : `TokenId: ${userLifeList[activeIndex].tokenId}`}</div>
                    }
                </div>
                <div className={"point-box"}>
                    {coins}
                </div>
            </div>
            {userLifeList.length ?
                <div className={"setout-main"}>
                    {step === 1 ? <SelectionLife userLifeList={userLifeList} activeIndex={activeIndex} nextStep={switchStatus} setActiveIndexFun={setActiveIndexFun} /> : <EditSelectionStrategy nextStep={switchStatus} lifeDetail={userLifeList[activeIndex]} refreshCoins={getUserCoins} />}
                </div>
                :
                ''
            }
        </div>
    )
}