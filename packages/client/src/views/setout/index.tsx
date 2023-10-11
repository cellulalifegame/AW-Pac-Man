import { useEffect, useState } from "react";
import {getSrc} from "../../utils/utils";
import "./index.scss"
import { SelectionLife } from "./selectionLife"
import { SelectionStrategy } from "./selectionStrategy"
import { useNavigate, useParams } from 'react-router-dom';
import Button from "../../components/Button";
import { useAccount } from 'wagmi';
import { User } from '../../api';
export function Setout() {
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
    return (
        <div className={"setout-container"} style={{backgroundImage: `url(${getSrc(`setout/selection-${backgroundImages[step-1]}-background.png`)})`}}>
            <div className={"navigation-container"}>
                <img onClick={backFun} className={"arrow"} src={ getSrc('setout/arrow-left.png') } alt=""/>
                <div className={"nav-item"}>Level 1 - {level}</div>
                <img className={"connection"} src={ getSrc('setout/connection.png') } alt=""/>
                <div className={step === 1 ? "nav-item-active" : 'nav-item-active no-active'}>{step === 1 ? 'Choose Life' : `TokenId: ${userLifeList[activeIndex].tokenId}`}</div>
                <img className={"connection"} src={ getSrc('setout/connection.png') } alt=""/>
                { step === 1 ? <img className={"pie"} src={ getSrc('setout/pie.png') } alt=""/> : <div className={"nav-item-active"}>Strategy & Skill</div>
                }
            </div>
            {userLifeList.length ?
                <div className={"setout-main"}>
                    {step === 1 ? <SelectionLife userLifeList={userLifeList} activeIndex={activeIndex} nextStep={switchStatus} setActiveIndexFun={setActiveIndexFun} /> : <SelectionStrategy lifeDetail={userLifeList[activeIndex]} />}
                </div>
                :
                ''
            }
        </div>
    )
}