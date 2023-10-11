export const wagmigotchiContract: any = {
    address: '0xFAEa5cd610bD946cfDAf83d023280EcA35d4fED9',
    abi: [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getAttack","outputs":[{"internalType":"uint8","name":"attack","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getMoveRule","outputs":[{"internalType":"string","name":"moveRule","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getViewRange","outputs":[{"internalType":"uint8","name":"viewRange","type":"uint8"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"lifeInfo","outputs":[{"components":[{"internalType":"uint8","name":"viewRange","type":"uint8"},{"internalType":"uint8","name":"attack","type":"uint8"},{"internalType":"string","name":"moveRule","type":"string"}],"internalType":"struct CellulaLifeData","name":"dataInfo","type":"tuple"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint8","name":"viewRange","type":"uint8"},{"internalType":"uint8","name":"attack","type":"uint8"},{"internalType":"string","name":"moveRule","type":"string"}],"name":"saveLifeInfo","outputs":[],"stateMutability":"payable","type":"function"}]
}