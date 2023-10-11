import "./selectionStrategy.scss"
import { getSrc, useCountdownSeconds } from "../../utils/utils";
import { Select, Modal, message, Popover } from "antd"
import Button from "../../components/Button";
import { SetStateAction, useEffect, useState } from "react";
import { useAccount, useContractWrite } from 'wagmi';
import { User } from '../../api';
import { useParams } from 'react-router-dom';
import { wagmigotchiContract } from "../../utils/contract"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import useDebounce from "../../utils/debounce"

interface SelectionStrategyProps {
    nextStep: () => void
    lifeDetail: {
        gameLifeEntityInfo: {
            attack: number
            coinPower: number
            moveRule: string
            tokenId: string
            viewRange: number
        },
        health: number,
        image: string,
        status: number,
        tokenId: string
    },
    refreshCoins: () => void
}

export function EditSelectionStrategy({nextStep, lifeDetail, refreshCoins}: SelectionStrategyProps) {
    const pointList = [200,300,450,675,1000,1500,2250,3375,5000,7500]
    const coins = [1000,2000,4000]
    const { address } = useAccount()
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(lifeDetail)
    const [gameLifeEntityInfo, setGameLifeEntityInfo] = useState(lifeDetail.gameLifeEntityInfo)
    const [recommendValue, setRecommendValue] = useState(0)
    const [options, setOptions] = useState(lifeDetail.gameLifeEntityInfo.moveRule.split(','))
    const setRecommend = ((val: SetStateAction<number>) => {
        setRecommendValue(val)
    })
    const [modalType, setModalType] = useState(0)
    const [modalVisible, setModalVisible] = useState(false)
    const { level } = useParams()

    const actionsValues = [['A&3','C&2','B&1'],['A&1','A&2','B&1'],['A&1','C&2','D&2']]
    const recommendLists = [
        {
            attributes: [2,4],
            title: 'Offensive',
            condition: ['My Health ≥ 50% & meet a ghost','Score Gap > 20 & meet a ghost','My Health < 50% & meet a ghost'],
            action: ['Attack','Move towards coins','Runaway']
        },
        {
            attributes: [3,2],
            title: 'Evasive',
            condition: ['My Health ≥ 50% & meet a ghost','My Health ≥ 50% & meet a ghost','My Health < 50% & meet a ghost'],
            action: ['Runaway','Move towards coins','Runaway']
        },
        {
            attributes: [3,2],
            title: 'Collecting',
            condition: ['My Health ≥ 50% & meet a ghost','Score Gap > 20 & meet a ghost','Score Gap < 20 & meet a ghost'],
            action: ['Runaway','Move towards coins','Move towards coins']
        }
    ]
    const showModal = () => {
        setOpen(true);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const buyModalCancel = () => {
        setModalVisible(false);
    };
    const addAttribute = (type: string) => {
        if (type === 'attack' && detail.gameLifeEntityInfo.coinPower > 0) {
            setDetail(prevState => {
                const newGameLifeEntityInfo = {
                    ...prevState.gameLifeEntityInfo,
                    attack: prevState.gameLifeEntityInfo.attack + 1,
                    coinPower: prevState.gameLifeEntityInfo.coinPower - 1
                };
                return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
            });
        } else if (type === 'viewRange' && detail.gameLifeEntityInfo.coinPower > 1) {
            setDetail(prevState => {
                const newGameLifeEntityInfo = {
                    ...prevState.gameLifeEntityInfo,
                    viewRange: prevState.gameLifeEntityInfo.viewRange + 2,
                    coinPower: prevState.gameLifeEntityInfo.coinPower - 2
                };
                return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
            });
        }
    }
    const subtractAttribute = (type: string) => {
        if (type === 'attack' && detail.gameLifeEntityInfo.attack > 5) {
            setDetail(prevState => {
                const newGameLifeEntityInfo = {
                    ...prevState.gameLifeEntityInfo,
                    attack: prevState.gameLifeEntityInfo.attack - 1,
                    coinPower: prevState.gameLifeEntityInfo.coinPower + 1
                };
                return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
            });
        } else if (type === 'viewRange' && detail.gameLifeEntityInfo.viewRange > 6) {
            setDetail(prevState => {
                const newGameLifeEntityInfo = {
                    ...prevState.gameLifeEntityInfo,
                    viewRange: prevState.gameLifeEntityInfo.viewRange - 2,
                    coinPower: prevState.gameLifeEntityInfo.coinPower + 2
                };
                return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
            });
        }
    }

    const saveAttributePolicy = (moveRule?: string) => {
        const formData = {
            ethAddress: address,
            attack: detail.gameLifeEntityInfo.attack,
            viewRange: detail.gameLifeEntityInfo.viewRange,
            tokenId: detail.tokenId,
            moveRule: moveRule ? moveRule : options.join(','),
            type: 0
        }
        const gameFormData = {
            ethAddress: address,
            tokenId: detail.tokenId,
            gameLevel: level
        }
        User.updateAttributePolicy(formData).then((res: any) => {
            if (res.code === 200) {
                refreshCoins()
                // nextStep()
            }
        })
    }
    function checkArray(strings: any) {
        return strings.every((str: any) => str.length === 3 && !str.includes(' '));
    }
    const saveAttributePolicyBack = () => {
        if (checkArray(options)) {
            const formData = {
                ethAddress: address,
                attack: detail.gameLifeEntityInfo.attack,
                viewRange: detail.gameLifeEntityInfo.viewRange,
                tokenId: detail.tokenId,
                moveRule: options.join(','),
                type: 0
            }
            User.updateAttributePolicy(formData).then((res: any) => {
                if (res.code === 200) {
                    refreshCoins()
                    nextStep()
                }
            })
        }
    }
    const optionChange= (type: string, index: number, value: string) => {
        if (type === 'condition') {
            const newOptions = [...options]
            if (newOptions[index]) {
                newOptions[index] = value+'&'+newOptions[index][2]
            } else {
                newOptions[index] = value+'&'+ ' '
            }
            setOptions(newOptions)
        } else {
            const newOptions = [...options]
            if (newOptions[index]) {
                newOptions[index] = newOptions[index][0]+'&'+value
            } else {
                newOptions[index] = ' '+'&'+value
            }
            setOptions(newOptions)
        }
    }
    const resetPoint = () => {
        setDetail(prevState => {
            const newGameLifeEntityInfo = {
                ...prevState.gameLifeEntityInfo,
                viewRange: 6,
                attack: 5,
                coinPower: lifeDetail.gameLifeEntityInfo.coinPower+(lifeDetail.gameLifeEntityInfo.attack-5)+((lifeDetail.gameLifeEntityInfo.viewRange-6)),
            };
            return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
        });
    }
    const { isSuccess: pointSuccess, write: pointWrite, isLoading: pointLoading } = useContractWrite({
        ...wagmigotchiContract,
        functionName: 'saveLifeInfo'
    })
    const { isSuccess: actionSuccess, write: actionWrite, isLoading: actionLoading } = useContractWrite({
        ...wagmigotchiContract,
        functionName: 'saveLifeInfo'
    })
    useEffect(() => {
        if (actionLoading) {
            countdown(60)
        } else {
            countdown(0)
        }
    }, [actionLoading]);
    useEffect(() => {
        if (pointLoading) {
            countdown(60)
        } else {
            countdown(0)
        }
    }, [pointLoading]);
    const { count, countdown } = useCountdownSeconds()
    const buyCoins = () => {
        console.log([parseInt(detail.tokenId), detail.gameLifeEntityInfo.viewRange, detail.gameLifeEntityInfo.attack, detail.gameLifeEntityInfo.moveRule]);
        pointWrite({args: [parseInt(detail.tokenId),detail.gameLifeEntityInfo.viewRange,detail.gameLifeEntityInfo.attack,detail.gameLifeEntityInfo.moveRule]})
    }
    const buyAction = () => {
        actionWrite({args: [parseInt(detail.tokenId),detail.gameLifeEntityInfo.viewRange,detail.gameLifeEntityInfo.attack,detail.gameLifeEntityInfo.moveRule+',']})
    }
    const switchButton = () => {
        if (modalType) {
            buyAction()
        } else {
            buyCoins()
        }
    }
    const openBuyModal = (type: number) => {
        setModalType(type)
        setModalVisible(true)
    }
    useEffect(() => {
        if (pointSuccess) {
            const formData = {
                ethAddress: address,
                tokenId: detail.tokenId
            }
            User.exchangePower(formData).then((res: any) => {
                if (res.code === 200) {
                    setDetail(prevState => {
                        const newGameLifeEntityInfo = {
                            ...prevState.gameLifeEntityInfo,
                            coinPower: detail.gameLifeEntityInfo.coinPower+1,
                        };
                        return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
                    });
                    setModalVisible(false)
                    refreshCoins()
                }
            })
        }
    }, [pointSuccess]);
    useEffect(() => {
        if (actionSuccess) {
            setDetail(prevState => {
                const newGameLifeEntityInfo = {
                    ...prevState.gameLifeEntityInfo,
                    moveRule: detail.gameLifeEntityInfo.moveRule+',',
                };
                return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
            });
            const moveRule = detail.gameLifeEntityInfo.moveRule+','
            setOptions(moveRule.split(','))
            saveAttributePolicy(moveRule)
            setModalVisible(false)
        }
    }, [actionSuccess]);
    useEffect(() => {
        setDetail(lifeDetail)
        setGameLifeEntityInfo(lifeDetail.gameLifeEntityInfo)
    }, [lifeDetail])
    useEffect(() => {
        if (!lifeDetail.gameLifeEntityInfo.moveRule) {
            // setOptions(['','',''])
        }
    }, []);
    const handleOnDragEnd = ((result: any) => {
        console.log(result);
        if (!result.destination) return;

        const itemsCopy = Array.from(options);
        const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
        itemsCopy.splice(result.destination.index, 0, reorderedItem);
        setOptions(itemsCopy);
    })
    return (
        <div className={"edit-strategy"}>
            <div className={"strategy-left-container"}>
                <Popover title={"You can increase the number of disposable skill points by spending gold coins."}>
                    <div className={"light-block block-detail"}>{detail.gameLifeEntityInfo.coinPower}</div>
                </Popover>
                {
                    detail.gameLifeEntityInfo.coinPower >= lifeDetail.gameLifeEntityInfo.coinPower+(lifeDetail.gameLifeEntityInfo.attack-5)+((lifeDetail.gameLifeEntityInfo.viewRange-6)) ? '' : <div onClick={resetPoint} className={(gameLifeEntityInfo.viewRange + gameLifeEntityInfo.attack + gameLifeEntityInfo.coinPower ) >= 26 ? 'reset reset-active' : 'reset'}></div>
                }
                    <div className="block-back">
                        <div className="block-header">
                            2 <img src={getSrc('setout/smail-light.png')} alt=""/>
                            / + 1</div>
                        <div className={"view-block block-detail block-function"}>
                            <Popover title={'Each "Life" starts with 3 "Vision" tiles, and every 2 skill points increase the Vision by 1 tile.'}>
                                <div className="hot-point">
                                </div>
                            </Popover>
                            <span>{(detail.gameLifeEntityInfo.viewRange / 2)}</span>
                            <div className={"add-block"} onClick={() => addAttribute('viewRange')}></div>
                            <div className={"add-block subtract-block"} onClick={() => subtractAttribute('viewRange')}></div>
                        </div>
                    </div>
                    <div className="block-back attack-back">
                        <div className="block-header">
                            1 <img src={getSrc('setout/smail-light.png')} alt=""/>
                            / + 1</div>
                        <div className={"attack-block block-detail block-function"}>
                            <Popover title={'Each "Life" starts with 5 points of "Attack Power," and every 1 skill point can increase the Attack Power by 1 point.'}>
                                <div className="hot-point">
                                </div>
                            </Popover>
                            <span>
                                {detail.gameLifeEntityInfo.attack}
                            </span>
                            <div className={"add-block"} onClick={() => addAttribute('attack')}></div>
                            <div className={"add-block subtract-block"} onClick={() => subtractAttribute('attack')}></div>
                        </div>
                    </div>
                {
                    (gameLifeEntityInfo.viewRange + gameLifeEntityInfo.attack + gameLifeEntityInfo.coinPower ) >= 26 ? '' : <div onClick={() => openBuyModal(0)} className="add-point">{pointList[((gameLifeEntityInfo.viewRange) + gameLifeEntityInfo.attack + gameLifeEntityInfo.coinPower - 16)]}
                        <img src={getSrc('game/gold.png')} alt=""/> / +1</div>
                }
                <img className={"cover-img"} src={detail.image} alt=""/>
                <div className={"light-box"}></div>
                <div className="boold-container">
                    <div className="boold-data-container">
                        <div className="data">{detail.health}</div>
                        <div className="progress-box">
                            <div className="progress-rate"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"strategy-right-container"}>
                <div className={"title-container"}>
                    <Popover title={'Action strategies are pre-set plans for your "life" in the map.'}>
                        <div className="label">
                            *Action Strategy
                        </div>
                    </Popover>
                    {/*<img onClick={showModal} src={getSrc('setout/book.png')} alt=""/>*/}
                </div>
                <div className={"table-container"}>
                    <Popover title={'The system will execute the strategies in the order you have arranged them.'}>
                        <div className="label">Order</div>
                    </Popover>
                    <div className="label">Condition</div>
                    <div className="label">Action</div>
                </div>
                <div className={"option-container"}>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="list">
                            {(provided: any) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {options.map((item, index) => (
                                        <Draggable key={index} draggableId={item+index} index={index}>
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
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {
                        options.length < 6 ? <div onClick={() => openBuyModal(1)} className="add-select">Unlock for {coins[options.length-3]}
                            <img src={getSrc('game/gold.png')} alt=""/> +1</div> : ''
                    }
                </div>
                <div className="button-container">
                    <Button disabled={!checkArray(options)}>
                        <div onClick={() => saveAttributePolicyBack()}>Save Strategy</div>
                    </Button>
                </div>
            </div>
            <Modal
                open={modalVisible}
                className={"buy-modal"}
                onCancel={buyModalCancel}
                width={1000}
                getContainer={false}
                footer={[
                    <Button key="back">
                        <div className={"back"} onClick={buyModalCancel}>
                            Back
                        </div>
                    </Button>,
                    <Button isLoading={count !== 0} key="Confirm">
                        <div onClick={switchButton}>
                            Confirm
                            <img src={getSrc('components/button-arrow.png')} alt=""/>
                        </div>
                    </Button>
                ]}
            >
                <div className="buy-modal">
                    <div className={"title"}>
                        {modalType ? `Are you sure you want to spend ${coins[options.length-3]} gold coins to unlock the next action strategy for the life with Token ID: ${detail.tokenId}?` : `Are you sure you want to spend ${pointList[((gameLifeEntityInfo.viewRange/2) + gameLifeEntityInfo.attack + gameLifeEntityInfo.coinPower - 13)]} gold coins to add a skill point for the life with Token ID: ${detail.tokenId}?`}
                    </div>
                    <div className="cover-box">
                        <img src={detail.image} alt=""/>
                    </div>
                </div>
            </Modal>
        </div>
    )
}