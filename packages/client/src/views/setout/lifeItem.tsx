import "./lifeItem.scss"

interface LifeItemProps {
    activeIndex: number,
    index: number,
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
    onIndexChange: (newIndex: number) => void;
}

export function LifeItem({activeIndex, index, lifeDetail, onIndexChange}: LifeItemProps) {
    const handleClick = () => {
        onIndexChange(index);
    }
    return (
        <div onClick={handleClick} className={activeIndex === index ? "nft-item nft-item-active" : "nft-item"}>
            <div className={"blood-volume"}>{lifeDetail.health}</div>
            <div className={"cover-container"}>
                <img className={!lifeDetail.status ? '' : 'death-img'} src={!lifeDetail.status ? lifeDetail.image : '#'} alt=""/>
            </div>
            <div className={"token-id"}>{lifeDetail.tokenId}</div>
        </div>
    )
}