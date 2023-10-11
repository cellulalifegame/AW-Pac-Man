import "./selectionLife.scss"
import { LifeItem } from "./lifeItem";
import {getSrc} from "../../utils/utils";
import Button from "../../components/Button";
import { useEffect, useState } from 'react';
// import { wagmigotchiContract } from '../../utils/contract'
import { useContractRead } from 'wagmi';
import {User} from "../../api"
interface SelectionLifeProps {
    userLifeList: any[];
    activeIndex: number;
    nextStep: () => void;
    setActiveIndexFun: (newIndex: number) => void
}
interface LifeInfo {
    viewRange?: number;
    attack?: number;
    moveRule?: string;
}
export function SelectionLife({userLifeList, activeIndex, nextStep, setActiveIndexFun}: SelectionLifeProps) {
    const [lifeInfo, setLifeInfo] = useState<LifeInfo>({})
    const handleIndexChange = (newIndex: number) => {
        setActiveIndexFun(newIndex)
    }

    // const { data: readData } = useContractRead({
    //     ...wagmigotchiContract,
    //     functionName: 'lifeInfo',
    //     args: [parseInt(userLifeList[activeIndex]?.tokenId)]
    // })
    const [skillPoints, setSkillPoints] = useState(0)
    // useEffect(() => {
    //     const data: any = readData
    //     setLifeInfo(data)
    //     User.getExchangePower(userLifeList[activeIndex]?.tokenId).then((res: any) => {
    //         if (res.code === 200) {
    //             setSkillPoints(res.data)
    //         }
    //     })
    // }, [readData]);
    return (
        <div className={"selection-life"}>
            <div className="left-container">
                <div className="life-container">
                    { userLifeList.map((item, index) => (
                        <LifeItem activeIndex={activeIndex} index={index} lifeDetail={item} onIndexChange={handleIndexChange} key={index}></LifeItem>
                    )) }
                </div>
            </div>
            <div className="right-container">
                <div className="token-id">
                    TokenID: <span>{userLifeList[activeIndex]?.tokenId}</span>
                </div>
                <div className="cover-container">
                    <img src={userLifeList[activeIndex]?.image} alt=""/>
                </div>
                <div className="boold-container">
                    <img className={"fire-icon"} src={getSrc('setout/fire.png')} alt=""/>
                    <div className="boold-data-container">
                        <div className={"health-block"}>{userLifeList[activeIndex]?.health}</div>
                        <div className="progress-box">
                            <div className="progress-rate" style={{width: userLifeList[activeIndex]?.health+'%'}}></div>
                        </div>
                    </div>
                </div>
                <div className={"button-box"}>
                    <Button>
                        <div onClick={() => nextStep()}>
                            Confirm
                            <img src={getSrc('components/button-arrow.png')} alt=""/>
                        </div>
                    </Button>
                </div>
                <div className={"light-block block-detail"}>{userLifeList[activeIndex]?.gameLifeEntityInfo.coinPower}</div>
                <div className={"view-block block-detail"}>{userLifeList[activeIndex]?.gameLifeEntityInfo.viewRange/2}</div>
                <div className={"attack-block block-detail"}>{userLifeList[activeIndex]?.gameLifeEntityInfo.attack}</div>
            </div>
        </div>
    )
}