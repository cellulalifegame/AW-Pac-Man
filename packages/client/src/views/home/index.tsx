import "./index.scss"
import NavButton from "../../components/NavButton";
import { getSrc, useCountdownSeconds } from "../../utils/utils";
import { useAccount, useContractWrite } from 'wagmi';
import { User } from '../../api'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { Modal } from 'antd';
import useDebounce from '../../utils/debounce';
import { wagmigotchiContract } from '../../utils/contract';

function Home() {
    const navigate = useNavigate()
    const { address, isConnected } = useAccount()
    const levels = new Array(10).fill(null)
    const [roads, setRoads] = useState(new Array(9).fill(null))
    const [coins, setCoins] = useState(0)
    const scrollAmount = 600;
    const scrollDirection = ((direction: string) => {
        return function handleClick () {
            const levelContainer = document.querySelector('.container');
            if (levelContainer) {
                if (direction === 'right') {
                    levelContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                } else {
                    levelContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            } else {
                console.error('.level-container not found');
            }
        }
    })
    const goToSetOut = (level: number) => {
        if (level === 0) {
            navigate(`/setout/${level+1}`)
        } else {
            if (mapList[level-1].passed) {
                navigate(`/setout/${level+1}`)
            }
        }
    }
    const goToEdit = () => {
        navigate('/edit')
    }
    const [mapList, setMapList] = useState([] as any)
    const [activeLevel, setActiveLevel] = useState(0)
    const [lifeDetail, setLifeDetail] = useState(null as any)
    const [modalVisible, setModalVisible] = useState(false)
    const { isSuccess, write, isLoading } = useContractWrite({
        ...wagmigotchiContract,
        functionName: 'saveLifeInfo'
    })
    useEffect(() => {
        if (isLoading) {
            countdown(60)
        } else {
            countdown(0)
        }
    }, [isLoading]);
    const { count, countdown } = useCountdownSeconds()
    const submitContract = () => {
        if (lifeDetail) {
            write({args: [parseInt(lifeDetail.tokenId),lifeDetail.viewRange,lifeDetail.attack,lifeDetail.moveRule]})
        }
    }
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                // submit bill
                User.payBill(address).then((res: any) => {
                    if (res.code === 200) {
                       setModalVisible(false)
                    }
                })
            }, 5000)
        }
    }, [isSuccess]);
    useEffect(() => {
        if (address) {
            User.checkNotPayBill(address).then((res: any) => {
                if (res.data) {
                    setLifeDetail(res.data)
                    setModalVisible(true)
                }
            })
            User.getUserCoins(address).then((res: any) => {
                setCoins(res.data)
            })
            User.getPassLevels(address).then((res: any) => {
                setMapList(res.data)
                res.data.forEach((item: any, index: number) => {
                    if (item.passed) {
                        setActiveLevel(index+1)
                    }
                })
            })
        }
    }, [address])
    useEffect(() => {
        setRoads(new Array(activeLevel).fill(null))
    }, [activeLevel]);
    return (
        <div className={"container"}>
            <div className={"mountain-main"}></div>
            <div className={"button-container"}>
                <div className={"button-box"}>
                    <NavButton>Explore</NavButton>
                    <NavButton>
                        <div onClick={goToEdit}>Enhance Life</div>
                    </NavButton>
                </div>
                <div className={"point-box"}>
                    {coins}
                </div>
            </div>
            {
                mapList.length ? <div className={"level-container"}>
                    { mapList.map((item: any, index: any) => (
                        <div onClick={() => goToSetOut(index)} key={index} className={`level-item ${activeLevel > index ? 'unlock' : activeLevel === index ? 'about-unlock' : ''}`}>
                            <div className={"cover-box"}>
                                <div className={"cover-container"}>
                                    <img className={"cover"} src={getSrc(`home/map-${index+1}.png`)} alt=""/>
                                    <img className={"Lock"} src={getSrc('home/lock.png')} alt=""/>
                                </div>
                                <div className={"description"}>
                                    Level {index+1}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                    : ''

            }
            { address ? roads.map((item, index) => (
                <img className={"road-img"} key={index} src={getSrc(`home/road-${9 - index}.png`)} alt=""/>
            )) : '' }
            <div className={"arrow-container"}>
                <div className={"arrow-img"} onClick={scrollDirection('left')}></div>
                <div className={"arrow-img"} onClick={scrollDirection('right')}></div>
            </div>
            <Modal
                open={modalVisible}
                className={"end-modal"}
                width={1000}
                getContainer={false}
                footer={null}
            >
                <div className="submit-modal">
                    Please submit the results of your previous match. Once submitted, you may continue playing.
                    <Button isLoading={count !== 0} key="Confirm">
                        <div onClick={submitContract}>
                            Submit
                        </div>
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
export default Home