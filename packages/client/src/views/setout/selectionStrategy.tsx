import "./selectionStrategy.scss"
import { getSrc, useCountdownSeconds } from "../../utils/utils";
import { Select, Modal, Popover } from "antd"
import Button from "../../components/Button";
import { SetStateAction, useEffect, useState } from "react";
import { User } from '../../api';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { wagmigotchiContract } from "../../utils/contract"
import { useAccount, useContractWrite } from 'wagmi';
import useDebounce from "../../utils/debounce"
import useThrottle from '../../utils/throttle';
interface SelectionStrategyProps {
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
    }
}

export function SelectionStrategy({lifeDetail}: SelectionStrategyProps) {
    const navigator = useNavigate()
    const { address } = useAccount()
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(lifeDetail)
    const [recommendValue, setRecommendValue] = useState(0)
    const [options, setOptions] = useState(lifeDetail.gameLifeEntityInfo.moveRule.split(','))
    const setRecommend = ((val: SetStateAction<number>) => {
        setRecommendValue(val)
    })
    const { count, countdown } = useCountdownSeconds()
    const { level } = useParams()

    const actionsValues = [['A&3','C&2','B&1'],['A&1','A&2','B&1'],['A&1','C&2','D&2']]
    const recommendLists = [
        {
            attributes: [4,8],
            title: 'Offensive',
            condition: ['My Health ≥ 50% & meet a ghost','Score Gap > 20 & meet a ghost','My Health < 50% & meet a ghost'],
            action: ['Attack','Move towards coins','Runaway']
        },
        {
            attributes: [4,8],
            title: 'Evasive',
            condition: ['My Health ≥ 50% & meet a ghost','My Health ≥ 50% & meet a ghost','My Health < 50% & meet a ghost'],
            action: ['Runaway','Move towards coins','Runaway']
        },
        {
            attributes: [4,8],
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
    function checkArray(strings: any) {
        return strings.every((str: any) => str.length === 3 && !str.includes(' '));
    }
    const { isSuccess, write, isLoading } = useContractWrite({
        ...wagmigotchiContract,
        functionName: 'saveLifeInfo'
    })
    const saveAttributePolicy = () => {
        if (checkArray(options)) {
            write({args: [parseInt(detail.tokenId),detail.gameLifeEntityInfo.viewRange,detail.gameLifeEntityInfo.attack,options.join(',')]})
        }
    }
    useEffect(() => {
        if (isLoading) {
            countdown(60)
        } else {
            countdown(0)
        }
    }, [isLoading]);
    useEffect(() => {
        if (isSuccess) {
            startGame()
        }
    }, [isSuccess]);
    const startGame = () => {
        const formData = {
            ethAddress: address,
            attack: detail.gameLifeEntityInfo.attack,
            viewRange: detail.gameLifeEntityInfo.viewRange,
            tokenId: detail.tokenId,
            moveRule: options.join(','),
            type: 1
        }
        const gameFormData = {
            ethAddress: address,
            tokenId: detail.tokenId,
            gameLevel: level
        }
        User.updateAttributePolicy(formData).then((res: any) => {
            if (res.code === 200) {
                User.startGame(gameFormData).then((res: any) => {
                    if (res.code === 200) {
                        navigator(`/loading/${detail.tokenId}`)
                    }
                })
            }
        })
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
    const chooseRecommend = () => {
        setDetail(prevState => {
            const newGameLifeEntityInfo = {
                ...prevState.gameLifeEntityInfo,
                viewRange: (recommendLists[recommendValue].attributes[0]) * 2,
                attack: (recommendLists[recommendValue].attributes[1]),
                moveRule: actionsValues[recommendValue].join(','),
                coinPower: (lifeDetail.gameLifeEntityInfo.coinPower + lifeDetail.gameLifeEntityInfo.attack + lifeDetail.gameLifeEntityInfo.viewRange) - ((recommendLists[recommendValue].attributes[0]) * 2 + (recommendLists[recommendValue].attributes[1])),
            };
            return { ...prevState, gameLifeEntityInfo: newGameLifeEntityInfo };
        });
        setOptions(actionsValues[recommendValue])
        handleCancel()
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
    useEffect(() => {
        setDetail(lifeDetail)
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
        <div className={"selection-strategy"}>
            <div className={"strategy-left-container"}>
                <Popover title={"You can increase the number of disposable skill points by spending gold coins."}>
                    <div className={"light-block block-detail"}>{detail.gameLifeEntityInfo.coinPower}</div>
                </Popover>
                {
                    detail.gameLifeEntityInfo.coinPower >= lifeDetail.gameLifeEntityInfo.coinPower+(lifeDetail.gameLifeEntityInfo.attack-5)+((lifeDetail.gameLifeEntityInfo.viewRange-6)) ? '' : <div onClick={resetPoint} className="reset"></div>
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
                    <div className="book" onClick={showModal}></div>
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

                    {/*{options.map((item, index) => (*/}
                    {/*    <div key={index} className="option-item">*/}
                    {/*        <img src={getSrc('setout/move-img.png')} alt=""/>*/}
                    {/*        <div className="label-index">{index + 1}</div>*/}
                    {/*        <div className={"select-container"}>*/}
                    {/*            <div className="select-item">*/}
                    {/*                <Select*/}
                    {/*                    value={item[0]}*/}
                    {/*                    onChange={(value) => optionChange('condition', index, value)}*/}
                    {/*                    placeholder={"Make your selection"}*/}
                    {/*                    options={[*/}
                    {/*                        {value: 'A', label: 'My Health ≥ 50% & meet a ghost'},*/}
                    {/*                        {value: 'B', label: 'My Health < 50% & meet a ghost'},*/}
                    {/*                        {value: 'C', label: 'Score Gap > 20 & meet a ghost'},*/}
                    {/*                        {value: 'D', label: 'Score Gap < 20 & meet a ghost'},*/}
                    {/*                    ]}*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*            <div className="select-item">*/}
                    {/*                <Select*/}
                    {/*                    value={item[2]}*/}
                    {/*                    onChange={(value) => optionChange('action', index, value)}*/}
                    {/*                    placeholder={"Make your selection"}*/}
                    {/*                    options={[*/}
                    {/*                        {value: '1', label: 'Runaway'},*/}
                    {/*                        {value: '2', label: 'Move towards coins'},*/}
                    {/*                        {value: '3', label: 'Attack'},*/}
                    {/*                    ]}*/}
                    {/*                />*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
                <div className="button-container">
                    <Button disabled={!checkArray(options)} isLoading={count !== 0}>
                        <div onClick={saveAttributePolicy}>Start Game</div>
                    </Button>
                </div>
            </div>
            <Modal
                open={open}
                title="To recommend"
                onCancel={handleCancel}
                width={1272}
                footer={[
                    <Button key="back">
                        <div className={"back"} onClick={handleCancel}>
                            Back
                        </div>
                    </Button>,
                    <Button key="Confirm">
                        <div onClick={chooseRecommend}>
                            Confirm
                            <img src={getSrc('components/button-arrow.png')} alt=""/>
                        </div>
                    </Button>
                ]}
            >
                <div className="recommend-container">
                    {
                        recommendLists.map((item, index) => (
                            <div className="recommend-item" key={index}>
                                <div className={"title"}>
                                    {item.title}
                                </div>
                                <div className={recommendValue === index ? "recommend-list-active recommend-list" : "recommend-list"}>
                                    <div className="list-item">
                                        <div className="icon">
                                            {item.attributes.map((attribute, index) => (
                                                <div key={index} className="icon-cover">
                                                    {attribute}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="description">
                                            {item.condition.map((description, index) => (
                                                <div key={index} className="description-item">
                                                    {description}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="type">
                                            {item.action.map((type, index) => (
                                                <div key={index} className="type-item">
                                                    {type}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <img onClick={() => setRecommend(index)} className="check-box"
                                         src={getSrc(`setout/check-${recommendValue === index ? 'active' : 'no'}.png`)}
                                         alt=""/>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Modal>
        </div>
    )
}