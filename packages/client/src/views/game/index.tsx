import './index.scss'
import {getSrc, useCountdownSeconds} from "../../utils/utils";
import { findDisappear, detectMovement } from "../../utils/game"
import Button from '../../components/Button';
import { useState, useEffect, useRef } from 'react';
import { User } from "../../api"
import { useParams, useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import { Modal, Select } from 'antd';
import { wagmigotchiContract } from "../../utils/contract"
import { useAccount, useContractWrite } from 'wagmi';
import { DragDropContext, Draggable as DraggableRBdnd, Droppable } from 'react-beautiful-dnd';
import useDebounce from "../../utils/debounce"
import GameBackground from "../../assets/musics/game-background.mp3"
import GameBackground2 from "../../assets/musics/game-background2.mp3"
import Gold from "../../assets/musics/gold.wav"
import Attack from "../../assets/musics/attack.wav"
interface GameInfo {
    attack: number
    moveRule: string
    tokenId: string
    toward: string
    viewRange: number
    mapInfo: [string]
    gameInfo: any
    lifeFaceToward: string
}
export function Game() {
    const navigate = useNavigate()
    const [editStatus, setEditStatus] = useState(false)
    const [endVisible, setEndVisible] = useState(false)
    const [quitVisible, setQuitVisible] = useState(false)
    const [endStatus, setEndStatus] = useState(0)
    const [submitVisible, setSubmitVisible] = useState(false)
    const { tokenId } = useParams()
    const [gameInfo, setGameInfo] = useState<GameInfo | any>({})
    const valueLabelMap: any = {
        'A': 'My Health ≥ 50% & meet a ghost',
        'B': 'My Health < 50% & meet a ghost',
        'C': 'Score Gap > 20 & meet a ghost',
        'D': 'Score Gap < 20 & meet a ghost',
        '1': 'Runaway',
        '2': 'Move towards coins',
        '3': 'Attack',
    };
    const { isSuccess, write, isLoading } = useContractWrite({
        ...wagmigotchiContract,
        functionName: 'saveLifeInfo'
    })
    const { count, countdown } = useCountdownSeconds()
    useEffect(() => {
        if (isLoading) {
            countdown(60)
        } else {
            setTimeout(() => {
                countdown(0)
            }, 5000)
        }
    }, [isLoading]);
    const submitContract = () => {
        if (tokenId) {
            write({args: [parseInt(tokenId),viewRange,attack,options.join(',')]})
        }
    }
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                // submit bill
                User.payBill(address).then((res: any) => {
                    if (res.code === 200) {
                        setSubmitVisible(false)
                        setEndVisible(true)
                    }
                })
            }, 5000)
        }
    }, [isSuccess]);
    function getLabel(value: string) {
        return valueLabelMap[value];
    }
    const getPosition = async ()  => {
        const elements = document.querySelectorAll(`.game-mains .block-9`)
        elements.forEach((element: any) => {
            if (element) {
                const elementBlock: any = document.querySelector('.block');
                const rect = elementBlock.getBoundingClientRect();
                const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                const remValue = rect.width / rootFontSize;
                if (nextStep.lifeFaceToward) {
                    if (nextStep.lifeFaceToward === 'UP') {
                        element.style.backgroundImage = 'url("#")'
                    } else if (nextStep.lifeFaceToward === 'DOWN') {
                        element.style.backgroundImage = 'url("#")'
                    } else if (nextStep.lifeFaceToward === 'LEFT') {
                        element.style.backgroundImage = 'url("#")'
                    } else if (nextStep.lifeFaceToward === 'RIGHT') {
                        element.style.backgroundImage = 'url("#")'
                    }
                }
                if (nextStep.toward === 'UP') {
                    element.style.top = parseFloat(element.style.top) ? parseFloat(element.style.top) - remValue + 'rem' : - remValue + 'rem'
                } else if (nextStep.toward === 'DOWN') {
                    element.style.top = parseFloat(element.style.top) ? parseFloat(element.style.top) + remValue + 'rem' : + remValue + 'rem'
                } else if (nextStep.toward === 'LEFT') {
                    element.style.left = parseFloat(element.style.left) ? parseFloat(element.style.left) - remValue + 'rem' : - remValue + 'rem'
                } else if (nextStep.toward === 'RIGHT') {
                    element.style.left = parseFloat(element.style.left) ? parseFloat(element.style.left) + remValue + 'rem' : + remValue + 'rem'
                }
            }
        });
        return true
    }

    const [ghostInfo, setGhostInfo] = useState([] as any)
    const [oldGhostInfo, setOldGhostInfo] = useState([] as any)

    const getCurrentMap = () => {
        if (tokenId) {
            User.getCurrentMap(tokenId).then((res: any) => {
                if (res.code === 200) {
                    setGameInfo(res.data)
                }
            })
        }
    }
    function checkString(str: string) {
        if (str.includes('3')) return 3;
        if (str.includes('4')) return 4;
        if (str.includes('5')) return 5;
        if (str.includes('6')) return 6;
        return 'No match found';
    }
    useEffect(() => {
        if (ghostInfo.length && oldGhostInfo.length && nextStep.tokenId) {
            ghostInfo.forEach((item: any, index: number) => {
                const newArr: any = [item.ghostArrange,item.ghostLine]
                const oldArr: any = [oldGhostInfo[index].ghostArrange,oldGhostInfo[index].ghostLine]
                const move = detectMovement(oldArr, newArr)
                const element: any = document.getElementsByClassName(`block-0-${item.ghostType}`)
                if (element) {
                    const typeName = item.ghostType
                    const indexGhost = nextStep.ghostFaceToward.findIndex((item: any) => item.type === typeName);
                    if (indexGhost !== -1) {
                        element[0].style.backgroundImage = `url("#")`
                    }
                    const elementBlock: any = document.querySelector('.block');
                    const rect = elementBlock.getBoundingClientRect();
                    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                    const remValue = rect.width / rootFontSize;
                    if (move === 'UP') {
                        element[0].style.top = parseFloat(element[0].style.top) ? parseFloat(element[0].style.top) - remValue + 'rem' : - remValue + 'rem'
                    } else if (move === 'DOWN') {
                        element[0].style.top = parseFloat(element[0].style.top) ? parseFloat(element[0].style.top) + remValue + 'rem' : + remValue + 'rem'
                    } else if (move === 'LEFT') {
                        element[0].style.left = parseFloat(element[0].style.left) ? parseFloat(element[0].style.left) - remValue + 'rem' : - remValue + 'rem'
                    } else if (move === 'RIGHT') {
                        element[0].style.left = parseFloat(element[0].style.left) ? parseFloat(element[0].style.left) + remValue + 'rem' : + remValue + 'rem'
                    }
                }
            })
            setOldGhostInfo(ghostInfo)
        }
    }, [ghostInfo]);
    const [scale, setScale] = useState(1);

    const handleWheel = (e: any) => {
        e.preventDefault();
        setScale(prevScale => {
            let nextScale = prevScale + Math.sign(e.deltaY) * (-0.1);
            if (nextScale < 0.3) {
                nextScale = 0.3;
            } else if (nextScale > 2) {
                nextScale = 2;
            }
            return nextScale;
        });
    };
    const [nextStep, setNextStep] = useState<any>({})
    const [options, setOptions] = useState([])
    const [isClearance, setIsClearance] = useState(false)
    const getNextStep = async () => {
        if (tokenId) {
            await User.getNextStep(tokenId).then(async (res: any) => {
                if (res.code === 200) {
                    const coinsIndex = findDisappear(nextStep.mapInfo ? nextStep.mapInfo : gameInfo.mapInfo, res.data.mapInfo)
                    coinsIndex.forEach((item: any) => {
                        setTimeout(() => {
                            gameInfo.mapInfo[item.i][item.j] = '0'
                            const audioGold = new Audio(Gold);
                            audioGold.play()
                        }, 50)
                    })
                    setGhostHealths(res.data.ghostInfos.map((ghostInfo: any) => ghostInfo.ghostHealth));
                    setGhostInfo(res.data.ghostInfos)
                    if (!previousGhostHealths.length) {
                        setPreviousGhostHealths(res.data.ghostInfos.map((ghostInfo: any) => ghostInfo.ghostHealth))
                    }
                    setNextStep(res.data)
                    setActions(res.data.moveRule.split(','))
                    if (!options.length) {
                        setOptions(res.data.moveRule.split(','))
                    }
                    if (!attack) {
                        setAttack(res.data.attack)
                        setCoinPower(res.data.coinPower)
                        setViewRange(res.data.viewRange)
                    }
                    setHealth(res.data.gameInfo.health)
                } else if (res.code === 307 || res.code === 308) {
                    setSubmitVisible(true)
                    if (!res.data.firstComplete) {
                        setIsClearance(true)
                    }
                    if (res.code === 308) {
                        setEndStatus(1)
                    }
                }
            })
        }
    }
    const [timer, setTimer] = useState('0000')
    function countdownFun(timestamp: any, setTimer: any) {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            let distance = timestamp - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimer('0000');
                return
            }
            let minutes: any = Math.floor(distance / (1000 * 60));
            distance -= minutes * (1000 * 60);

            let seconds: any = Math.floor(distance / 1000);

            minutes = String(minutes).padStart(2, '0');
            seconds = String(seconds).padStart(2, '0');

            const countdown = (minutes + seconds).toString();
            setTimer(countdown);
        }, 1000);

        return () => clearInterval(interval);
    }
    const [actions, setActions] = useState([])
    const [attack, setAttack] = useState(0)
    const [viewRange, setViewRange] = useState(0)
    const [coinPower, setCoinPower] = useState(0)
    const [health, setHealth] = useState(0)
    const [totalHealth, setTotalHealth] = useState(0)
    const [ghostHealths, setGhostHealths] = useState([]);
    const [previousGhostHealths, setPreviousGhostHealths] = useState([]);
    useEffect(() => {
        ghostHealths.forEach((health, index) => {
            if (health === 0 && nextStep.ghostInfos) {
                const element: any = document.getElementsByClassName(`block-0-${nextStep.ghostInfos[index].ghostType}`);
                if (element && element[0]) {
                    element[0].style.display = 'none';
                }
            } else {
                if (previousGhostHealths[index] !== health) {
                    const typeName = ghostInfo[index].ghostType
                    const indexGhost = nextStep.ghostFaceToward.findIndex((item: any) => item.type === typeName);
                    if (indexGhost !== -1) {
                        const elements = document.querySelectorAll(`.game-mains .block-0-${nextStep.ghostFaceToward[indexGhost].type}`)
                        elements.forEach((element: any) => {
                            if (element) {
                                if (nextStep.ghostFaceToward[indexGhost].turn === 'UP') {
                                    element.classList.add('moveUpAnimation')
                                    element.addEventListener('animationend', function() {
                                        element.classList.remove('moveUpAnimation');
                                    });
                                } else if (nextStep.ghostFaceToward[indexGhost].turn === 'DOWN') {
                                    element.classList.add('moveDownAnimation')
                                    element.addEventListener('animationend', function() {
                                        element.classList.remove('moveDownAnimation');
                                    });
                                } else if (nextStep.ghostFaceToward[indexGhost].turn === 'LEFT') {
                                    element.classList.add('moveLeftAnimation')
                                    element.addEventListener('animationend', function() {
                                        element.classList.remove('moveLeftAnimation');
                                    });
                                } else if (nextStep.ghostFaceToward[indexGhost].turn === 'RIGHT') {
                                    element.classList.add('moveRightAnimation')
                                    element.addEventListener('animationend', function() {
                                        element.classList.remove('moveRightAnimation');
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
        setPreviousGhostHealths(ghostHealths);
    }, [ghostHealths]);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutId: any = useRef(null);
    useEffect(() => {
        if (nextStep && nextStep.mapInfo && !isPaused) {
            getPosition().then((res: any) => {
                timeoutId.current = setTimeout(async () => {
                    await getNextStep();
                }, 333);
            });
        }

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [nextStep, isPaused]);
    useEffect(() => {
        if (quitVisible) {
            setIsPaused(true)
        } else {
            setIsPaused(false)
        }
    }, [quitVisible]);
    useEffect(() => {
        if (health && health !== totalHealth && nextStep.gameInfo) {
            const elements = document.querySelectorAll(`.game-mains .block-9`)
            elements.forEach((element: any) => {
                if (element) {
                    const audioAttack = new Audio(Attack);
                    audioAttack.play()
                    if (nextStep.lifeFaceToward === 'UP') {
                        element.classList.add('moveUpAnimation')
                        element.classList.add('attack-animate-top')
                        element.addEventListener('animationend', function() {
                            element.classList.remove('moveUpAnimation');
                            element.classList.remove('attack-animate-top');
                        });
                    } else if (nextStep.lifeFaceToward === 'DOWN') {
                        element.classList.add('moveDownAnimation')
                        element.classList.add('attack-animate-bottom')
                        element.addEventListener('animationend', function() {
                            element.classList.remove('moveDownAnimation');
                            element.classList.remove('attack-animate-bottom');
                        });
                    } else if (nextStep.lifeFaceToward === 'LEFT') {
                        element.classList.add('moveLeftAnimation')
                        element.classList.add('attack-animate-left')
                        element.addEventListener('animationend', function() {
                            element.classList.remove('moveLeftAnimation');
                            element.classList.remove('attack-animate-left');
                        });
                    } else if (nextStep.lifeFaceToward === 'RIGHT') {
                        element.classList.add('moveRightAnimation')
                        element.classList.add('attack-animate-right')
                        element.addEventListener('animationend', function() {
                            element.classList.remove('moveRightAnimation');
                            element.classList.remove('attack-animate-right');
                        });
                    }
                }
            });
        }
    }, [health]);
    useEffect(() => {
        if (gameInfo.moveRule) {
            setActions(gameInfo.moveRule.split(','))
            if (!options.length) {
                setOptions(gameInfo.moveRule.split(','))
            }
            setAttack(gameInfo.attack)
            setCoinPower(gameInfo.coinPower)
            setViewRange(gameInfo.viewRange)
            setHealth(gameInfo.gameInfo.health)
            setTotalHealth(gameInfo.gameInfo.totalHealth)
            setGhostInfo(gameInfo.ghostInfos)
            gameInfo.ghostInfos.forEach((item: any) => {
                const mapBlocks = document.getElementsByClassName('map-block');
                if (mapBlocks.length > 0 && item.ghostArrange && item.ghostLine) {
                    const elementBlock: any = document.querySelector('.block');
                    const rect = elementBlock.getBoundingClientRect();
                    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                    const remValue = rect.width / rootFontSize;
                    const firstMapBlock = mapBlocks[0];
                    const newDiv = document.createElement('div');
                    newDiv.className = `block block-0-${item.ghostType}`;
                    newDiv.style.left = `${item.ghostArrange*remValue}rem`;
                    newDiv.style.top = `${item.ghostLine*remValue}rem`;
                    firstMapBlock.appendChild(newDiv);
                }
            })
            if (!oldGhostInfo.length) {
                setOldGhostInfo(gameInfo.ghostInfos)
            }
            getNextStep()
        }
    }, [gameInfo]);
    useEffect(() => {
        getCurrentMap()
        const timestamp = new Date().getTime() + 300000;
        const clearCountdown = countdownFun(timestamp, setTimer);
        return clearCountdown;
    }, []);
    const resetPoint = () => {
        setCoinPower(coinPower+(attack-5)+((viewRange-6)))
        setAttack(5)
        setViewRange(6)
    }
    const addAttribute = (type: string) => {
        if (type === 'attack' && coinPower > 0) {
            setCoinPower(coinPower - 1)
            setAttack(attack + 1)
        } else if (type === 'viewRange' && coinPower > 1) {
            setCoinPower(coinPower - 2)
            setViewRange(viewRange + 2)
        }
    }
    const subtractAttribute = (type: string) => {
        if (type === 'attack' && attack > 5) {
            setCoinPower(coinPower + 1)
            setAttack(attack - 1)
        } else if (type === 'viewRange' && viewRange > 6) {
            setCoinPower(coinPower + 2)
            setViewRange(viewRange - 2)
        }
    }
    const { address } = useAccount()

    const saveAttributePolicy = () => {
        const formData = {
            ethAddress: address,
            attack: attack,
            viewRange: viewRange,
            tokenId: tokenId,
            moveRule: options.join(','),
            type: 1
        }
        User.updateAttributePolicy(formData).then((res: any) => {
            if (res.code === 200) {
                setActions(options)
                setEditStatus(false)
            }
        })
    }
    const [newOption, setNewOption] = useState([])
    const optionChange= (type: string, index: number, value: string) => {
        if (type === 'condition') {
            const newOptions: any = [...options]
            newOptions[index] = value+'&'+newOptions[index][2]
            setOptions(newOptions)
        } else {
            const newOptions: any = [...options]
            newOptions[index] = newOptions[index][0]+'&'+value
            setOptions(newOptions)
        }
    }
    const enhance = () => {
        navigate('/edit')
    }
    const explore = () => {
        navigate('/home')
    }
    const cancelGame = () => {
        if (tokenId) {
            User.removeGame(tokenId).then((res: any) => {
                if (res.code === 200) {
                    User.payBill(address).then((res: any) => {
                        if (res.code === 200) {
                            explore()
                        }
                    })
                }
            })
        }
    }
    const handleOnDragEnd = ((result: any) => {
        if (!result.destination) return;

        const itemsCopy = Array.from(options);
        const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
        itemsCopy.splice(result.destination.index, 0, reorderedItem);
        setOptions(itemsCopy);
    })
    const audioRef = useRef(null as any);

    const startPlaying = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };
    useEffect(() => {
        setTimeout(() => {
            startPlaying()
        }, 3000)
    }, []);
    return (
        <div className="game-container">
            <audio ref={audioRef} autoPlay loop>
                <source src={GameBackground2} type="audio/mpeg" />
            </audio>
            <div className="game-header">
                <div onClick={() => setQuitVisible(true)} className={"return"}>
                    <img src={getSrc('game/return.png')} alt=""/>
                    Return
                </div>
                {/*<button onClick={() => setIsPaused(!isPaused)}>*/}
                {/*    {isPaused ? 'Resume' : 'Pause'}*/}
                {/*</button>*/}
                {/*<button onClick={startPlaying}>Start Playing</button>*/}
                {/*<Button>*/}
                {/*    <div onClick={getNextStep}>Next Step</div>*/}
                {/*</Button>*/}
            </div>
            <div className="game-main">
                <div className="game-left">
                    <div className="timer-container">
                        <div className="time-item">{timer[0]}</div>
                        <div className="time-item">{timer[1]}</div>:
                        <div className="time-item">{timer[2]}</div>
                        <div className="time-item">{timer[3]}</div>
                    </div>
                    <div className="game-box">
                        <div className="game-containers"
                        >
                            <Draggable>
                                <div className="game-mains" >
                                    <div style={{
                                        transform: `scale(${scale})`,
                                    }}>
                                        { gameInfo.mapInfo ? gameInfo.mapInfo.map((item: any, index: number) => (
                                            <div key={index} className="map-block">
                                                {
                                                    item.map((items: any, indexs: number) => (
                                                        <div key={indexs} className={`block block-${['0', '1', '2', '9'].includes(items) ? items : '0'} ${items === '1' ? `wall-${gameInfo.gameInfo.gameLevel}` : ''}`}></div>                                                    ))
                                                }
                                            </div>
                                        )) : '' }
                                    </div>
                                </div>
                            </Draggable>
                        </div>
                    </div>
                    <div className="coins-container">
                        {/*<div className="coins-box">*/}
                        {/*    <img src={getSrc('game/coin.png')} alt=""/>*/}
                        {/*</div>*/}
                        {
                            gameInfo.gameInfo ? <div className="coins-count">
                                {nextStep?.nowCoins ? nextStep?.nowCoins : gameInfo.gameInfo.coins}/ <span>{gameInfo.gameInfo.gameLevel < 5 ?  40 + (gameInfo.gameInfo.gameLevel*40) : 240}</span>
                            </div>
                                : ''
                        }
                    </div>
                </div>
                {
                    gameInfo.gameInfo ?
                        <div className="game-right">
                            {
                                !editStatus ?
                                    <div className="game-detail">
                                        <div className="right-header">
                                            <div className="tokenId">
                                                TokenId: <span>{tokenId}</span>
                                            </div>
                                            <div className="life-detail">
                                                <div className="cover-left">
                                                    <div className="cover-box">
                                                        <img src={gameInfo.gameInfo.avatarUrl} alt=""/>
                                                    </div>
                                                    <div className="boold-container">
                                                        <div className="boold-data-container">
                                                            <div className="data">{health}/{totalHealth}</div>
                                                            <div className="progress-box">
                                                                <div className="progress-rate" style={{width: ((!nextStep.gameInfo ? gameInfo.gameInfo.health : nextStep.gameInfo.health) / (!nextStep.gameInfo ? gameInfo.gameInfo.totalHealth : nextStep.gameInfo.totalHealth)) * 100 + '%'}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="cover-right">
                                                    <div className="icon">
                                                        <div className="icon-cover">
                                                            { !nextStep.gameInfo ? gameInfo.viewRange/2 : nextStep.viewRange/2 }
                                                        </div>
                                                    </div>
                                                    <div className="icon">
                                                        <div className="icon-cover">
                                                            { !nextStep.gameInfo ? gameInfo.attack : nextStep.attack }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="game-action">
                                            <div className="title">
                                                Action Strategy
                                            </div>
                                            <div className="action-container">
                                                {
                                                    actions.length ?
                                                        actions.map((item: any, index: number) => (
                                                            <div key={index} className="action-item">
                                                                <div className="action-active"></div>
                                                                <div className="action-label">{index+1}.</div>
                                                                <div className="action-description">{getLabel(item[2])}</div>
                                                            </div>
                                                        ))
                                                        : ''
                                                }
                                            </div>
                                            <div className="title">
                                                Enemy Situation
                                            </div>
                                            <div className="table-img">
                                                <img className={"img-cover"} src={getSrc('game/label-img.png')} alt=""/>
                                            </div>
                                            <div className="pc-container">
                                                {   ghostInfo.length ?
                                                    ghostInfo.map((item: any, index: number) => (
                                                        <div key={index} className="pc-item">
                                                            <div className={`block block-0-${item.ghostType}-label`}></div>
                                                            <div className="data-container">
                                                                <span>{item.ghostHealth}/{item.ghostTotalHealth}</span>
                                                                <span>{item.ghostViewRange}</span>
                                                                <span>{item.ghostAttack}</span>
                                                            </div>
                                                        </div>
                                                    ))
                                                    : ''
                                                }

                                            </div>
                                        </div>
                                        <div className="button-container">
                                            <Button>
                                                <div onClick={() => setEditStatus(true)}>Change Strategy</div>
                                            </Button>
                                        </div>
                                    </div> :
                                    <div className="edit-container-right">
                                        <div className={"edit-back"}>
                                            <svg onClick={() => setEditStatus(false)} xmlns="http://www.w3.org/2000/svg" width="32" height="20" viewBox="0 0 32 20" fill="none">
                                                <path d="M31.1252 19.139C31.1259 19.0645 31.09 19.0041 31.0604 18.9639C31.032 18.9255 30.9958 18.8885 30.9668 18.8587L30.9603 18.8521L30.9597 18.8515L26.0428 13.8758C23.9201 11.7277 23.9201 8.27196 26.0428 6.12394L30.9597 1.14821C31.1261 0.979748 31.1261 0.802838 31.1261 0.669666V0.664195C31.1261 0.526141 31.0235 0.443477 30.9426 0.402626C30.8578 0.359799 30.7566 0.339871 30.6743 0.339871H23.5285C23.4091 0.339871 23.303 0.386605 23.216 0.443106C23.1289 0.49969 23.0522 0.571793 22.9899 0.634836L14.0832 9.64804C13.9046 9.82878 13.9046 10.1057 14.0832 10.2865L23.1779 19.4899C23.2285 19.5411 23.2836 19.5697 23.3483 19.5829C23.4017 19.5938 23.4617 19.5938 23.5194 19.5937L23.5276 19.5937H30.6734C30.8002 19.5937 30.9155 19.5505 30.9993 19.4657C31.0827 19.3812 31.125 19.2656 31.1252 19.139ZM31.1252 19.139C31.1252 19.1392 31.1252 19.1395 31.1251 19.1398L30.9982 19.1381H31.1252C31.1252 19.1384 31.1252 19.1387 31.1252 19.139Z" fill="#F8F0D8" stroke="black" strokeWidth="0.253853"/>
                                                <path d="M18.049 19.139C18.0497 19.0645 18.0139 19.0041 17.9842 18.9639C17.9558 18.9255 17.9196 18.8885 17.8906 18.8587L17.8841 18.8521L17.8835 18.8515L12.9666 13.8758C10.844 11.7277 10.844 8.27196 12.9666 6.12394L17.8835 1.14821C18.05 0.979748 18.0499 0.802838 18.0499 0.669666V0.664195C18.0499 0.526141 17.9473 0.443477 17.8664 0.402626C17.7816 0.359799 17.6805 0.339871 17.5981 0.339871H10.4523C10.3329 0.339871 10.2269 0.386605 10.1399 0.443106C10.0527 0.49969 9.97598 0.571793 9.91368 0.634836L1.00703 9.64804C0.828423 9.82878 0.828423 10.1057 1.00703 10.2865L10.1017 19.4899C10.1523 19.5411 10.2074 19.5697 10.2722 19.5829C10.3255 19.5938 10.3855 19.5938 10.4432 19.5937L10.4515 19.5937H17.5973C17.724 19.5937 17.8393 19.5505 17.9231 19.4657C18.0065 19.3812 18.0488 19.2656 18.049 19.139ZM18.049 19.139C18.049 19.1392 18.049 19.1395 18.049 19.1398L17.9221 19.1381H18.049C18.049 19.1384 18.049 19.1387 18.049 19.139Z" fill="#F8F0D8" stroke="black" strokeWidth="0.253853"/>
                                            </svg>
                                        </div>
                                        <div className={"edit-box"}>
                                            <div className="right-header">
                                                <div className="tokenId">
                                                    TokenId: <span>{tokenId}</span>
                                                </div>
                                                <div className="life-detail">
                                                    <div className="cover-left">
                                                        <div className="cover-box">
                                                            <img src={gameInfo.gameInfo.avatarUrl} alt=""/>
                                                            <div className={"light-block block-detail"}>{coinPower}</div>
                                                            {coinPower >= coinPower+(attack-5)+((viewRange-6)) ? '' : <div onClick={resetPoint} className={"refresh"}></div>}
                                                        </div>
                                                        <div className="boold-container">
                                                            <div className="boold-data-container">
                                                                <div className="data">{!nextStep.gameInfo ? gameInfo.gameInfo.health : nextStep.gameInfo.health}/{!nextStep.gameInfo ? gameInfo.gameInfo.totalHealth : nextStep.gameInfo.totalHealth}</div>
                                                                <div className="progress-box">
                                                                    <div className="progress-rate" style={{width: ((!nextStep.gameInfo ? gameInfo.gameInfo.health : nextStep.gameInfo.health) / (!nextStep.gameInfo ? gameInfo.gameInfo.totalHealth : nextStep.gameInfo.totalHealth)) * 100 + '%'}}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="cover-right">
                                                        <div className="block-back">
                                                            <div className="block-header">
                                                                2 <img src={getSrc('setout/smail-light.png')} alt=""/>
                                                                / + 1</div>
                                                            <div className={"view-block block-detail block-function"}>
                                                                <span>{viewRange/2}</span>
                                                                <div className={"add-block"} onClick={() => addAttribute('viewRange')}></div>
                                                                <div className={"add-block subtract-block"} onClick={() => subtractAttribute('viewRange')}></div>
                                                            </div>
                                                        </div>
                                                        <div className="block-back">
                                                            <div className="block-header">
                                                                1 <img src={getSrc('setout/smail-light.png')} alt=""/>
                                                                / + 1</div>
                                                            <div className={"attack-block block-detail block-function"}>
                                                                <span>{attack}</span>
                                                                <div className={"add-block"} onClick={() => addAttribute('attack')}></div>
                                                                <div className={"add-block subtract-block"} onClick={() => subtractAttribute('attack')}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="edit-strategy-box">
                                                <div className={"title-edit"}>
                                                    Action Strategy
                                                </div>
                                                <div className={"table-container"}>
                                                    <div className="label">Order</div>
                                                    <div className="label">Condition</div>
                                                    <div className="label">Action</div>
                                                </div>
                                                <div className={"option-container"}>
                                                    <DragDropContext onDragEnd={handleOnDragEnd}>
                                                        <Droppable droppableId="list">
                                                            {(provided: any) => (
                                                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                    {options.map((item, index) => (
                                                                        <DraggableRBdnd key={index} draggableId={`${item}+${index}`} index={index}>
                                                                            {(provided: any) => (
                                                                                <div
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    key={index}
                                                                                    className="option-item"
                                                                                >
                                                                                    <img src={getSrc('setout/move-img.png')} alt=""/>
                                                                                    <div className="label-index">{index + 1}</div>
                                                                                    <div className={"select-container"}>
                                                                                        <div className="select-item">
                                                                                            <Select
                                                                                                value={item[0]}
                                                                                                onChange={(value) => optionChange('condition', index, value)}
                                                                                                placeholder={"Make your selection"}
                                                                                                options={[
                                                                                                    {value: 'A', label: 'My Health ≥ 50% & meet a ghost'},
                                                                                                    {value: 'B', label: 'My Health < 50% & meet a ghost'},
                                                                                                    {value: 'C', label: 'Score Gap > 20 & meet a ghost'},
                                                                                                    {value: 'D', label: 'Score Gap < 20 & meet a ghost'},
                                                                                                ]}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="select-item">
                                                                                            <Select
                                                                                                value={item[2]}
                                                                                                onChange={(value) => optionChange('action', index, value)}
                                                                                                placeholder={"Make your selection"}
                                                                                                options={[
                                                                                                    {value: '1', label: 'Runaway'},
                                                                                                    {value: '2', label: 'Move towards coins'},
                                                                                                    {value: '3', label: 'Attack'},
                                                                                                ]}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </DraggableRBdnd>
                                                                    ))}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </DragDropContext>

                                                    <div className="edit-button-container">
                                                        <Button>
                                                            <div onClick={() => setEditStatus(false)}>
                                                                Back
                                                            </div>
                                                        </Button>
                                                        <Button>
                                                            <div onClick={saveAttributePolicy}>
                                                                Confirm
                                                                <img src={getSrc('components/button-arrow.png')} alt=""/>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                        : ''
                }
            </div>
            <Modal
                open={endVisible}
                className={"end-modal"}
                width={740}
                getContainer={false}
                footer={[
                    <Button key="back">
                        <div className={"back"} onClick={enhance}>
                            Enhance Life
                        </div>
                    </Button>,
                    <Button key="Confirm">
                        <div onClick={explore}>
                            Explore
                            <img src={getSrc('components/button-arrow.png')} alt=""/>
                        </div>
                    </Button>
                ]}
            >
                <div className="end-modal">
                    {
                        endStatus ? <div className={"end-top"}>
                            <div className={"logo-end"}></div>
                            <div className={"detail-data"}>
                                <div className="detail-tiem">
                                    <img src={getSrc('game/coin.png')} alt=""/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <path d="M20.999 6.99805L6.99902 20.998" stroke="#FFE500" strokeWidth="4.48" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M21.001 20.998L7.00098 6.99805" stroke="#FFE500" strokeWidth="4.48" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    { nextStep?.nowCoins > (gameInfo.gameInfo.gameLevel < 5 ?  40 + (gameInfo.gameInfo.gameLevel*40) : 240) ? gameInfo.gameInfo.gameLevel < 5 ?  40 + (gameInfo.gameInfo.gameLevel*40) : 240 : nextStep?.nowCoins }
                                </div>
                                {
                                    isClearance ? '' : <div className="detail-tiem">
                                        <img src={getSrc('game/lock.png')} alt=""/>
                                        <span>:</span>1-{nextStep?.gameInfo?.gameLevel+1}
                                    </div>
                                }
                            </div>
                        </div>
                            : <div className={"end-top end-failed"}>
                                <div className={"logo-failed"}></div>
                                <div className={"failed-description"}>
                                    Your life with Token ID: <span>{tokenId}</span>  has died, the game is over!
                                </div>
                            </div>
                    }
                </div>
            </Modal>
            <Modal
                open={submitVisible}
                className={"end-modal"}
                width={1000}
                getContainer={false}
                footer={null}
            >
                <div className="submit-modal">
                    The battle has ended. Please submit the game results to proceed with the settlement.
                    <Button isLoading={count !== 0} key="Confirm">
                        <div onClick={submitContract}>
                            Submit
                        </div>
                    </Button>
                </div>
            </Modal>
            <Modal
                open={quitVisible}
                className={"end-modal"}
                width={1000}
                getContainer={false}
                footer={null}
            >
                <div className="submit-modal">
                    Quitting the game prematurely may lead to failure of the current game. Are you sure you want to quit?
                    <div className={"button-container"}>
                        <Button key="Confirm">
                            <div onClick={cancelGame}>
                                Quit
                            </div>
                        </Button>
                        <Button key="Confirm">
                            <div onClick={() => setQuitVisible(false)}>
                                Back
                            </div>
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}