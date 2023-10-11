import request from '../utils/request'

const URL = {
    GET_MY_LIFE: 'getMyLifes',
    GET_USER_COINS: 'getUserCoins',
    GET_PASS_LEVELS: 'getPassLevels',
    GET_NEXT_STEP: 'nextStep',
    START_GAME: 'startGame',
    UPDATE_ATTRIBUTE_POLICY: 'updateAttributePolicy',
    GET_EXCHANGE_POWER: 'getExchangePower',
    EXCHANGE_POWER: 'exchangePower',
    GET_CURRENT_MAP: 'currentMap',
    REMOVE_GAME: 'removeTestGame',
    PAY_BILL: 'payBill',
    CHECK_NOT_BILL: '/checkNotPayBill'
}

export interface UserInfo {
    username: string
    password: string
}

export default {
    getMyLifes(address: any) {
        return request.get(URL.GET_MY_LIFE, {
            params: {
                ethAddress: address
            }
        })
    },
    getPassLevels(address: any) {
        return request.get(URL.GET_PASS_LEVELS, {
            params: {
                ethAddress: address
            }
        })
    },
    getNextStep(tokenId: string) {
        return request.get(URL.GET_NEXT_STEP, {
            params: {
                tokenId: tokenId
            }
        })
    },
    updateAttributePolicy(formData: any) {
        return request.post(URL.UPDATE_ATTRIBUTE_POLICY, formData)
    },
    startGame(formData: any) {
        return request.post(URL.START_GAME, formData)
    },

    getUserCoins(address: any) {
        return request.get(URL.GET_USER_COINS, {
            params: {
                ethAddress: address
            }
        })
    },
    getExchangePower(tokenId: string) {
        return request.get(URL.GET_EXCHANGE_POWER, {
            params: {
                tokenId: tokenId
            }
        })
    },
    exchangePower(formData: any) {
        return request.post(URL.EXCHANGE_POWER, formData)
    },
    getCurrentMap(tokenId: string) {
        return request.get(URL.GET_CURRENT_MAP, {
            params: {
                tokenId: tokenId
            }
        })
    },
    removeGame(tokenId: string) {
        return request.get(URL.REMOVE_GAME, {
            params: {
                tokenId: tokenId
            }
        })
    },
    payBill(address: any) {
        return request.get(URL.PAY_BILL, {
            params: {
                ethAddress: address
            }
        })
    },
    checkNotPayBill(address: any) {
        return request.get(URL.CHECK_NOT_BILL, {
            params: {
                ethAddress: address
            }
        })
    }
}