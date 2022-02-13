import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core"
import { Token } from "../Main"
import { formatUnits } from "@ethersproject/units"
import { Button, Input, CircularProgress, Snackbar } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import React, { useState, useEffect } from "react"
import { useStakeTokens } from "../../hooks/useStakeTokens"
import { utils } from "ethers"


export interface StakeFormProps {
    token: Token
}

export const StakeForm = ({ token }: StakeFormProps) => {
    const { address: tokenAddress, name } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const { notifications } = useNotifications()
    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : Number(event.target.value)
        setAmount(newAmount)
        console.log(newAmount)
    }

    const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddress)
    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeErc20State.status === "Mining"
    const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] = useState(false)
    const [showStakeTokensSuccess, setShowStakeTokensSuccess] = useState(false)

    const handleCloseSnack = () => {
        setShowErc20ApprovalSuccess(false)
        setShowStakeTokensSuccess(false)
    }

    useEffect(() => {
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve ERC20 transfer").length > 0) {
            setShowErc20ApprovalSuccess(true)
            setShowStakeTokensSuccess(false)

        }
        if (notifications.filter(
            (notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "stake tokens").length > 0) {
            setShowErc20ApprovalSuccess(false)
            setShowStakeTokensSuccess(true)
        }
    }, [notifications, showErc20ApprovalSuccess, showStakeTokensSuccess])

    return (
        <>
            <div>
                <Input onChange={handleInputChange}></Input>
                <Button color="primary" size="large" onClick={handleStakeSubmit} disabled={isMining}>{isMining ? <CircularProgress size={26} /> : "Stake"}</Button>
            </div>
            <Snackbar open={showErc20ApprovalSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success"></Alert>
            </Snackbar>
            <Snackbar open={showStakeTokensSuccess} autoHideDuration={5000} onClose={handleCloseSnack}>
                <Alert onClose={handleCloseSnack} severity="success"></Alert>
            </Snackbar>
        </>
    )
}