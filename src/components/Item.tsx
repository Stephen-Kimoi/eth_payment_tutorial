import { useEffect } from "react"
import helperAbi from "service/abi.json"
import { useActorMethod } from "service/hello"
import { formatEther } from "viem"
import { useContractWrite } from "wagmi"
import Confirmation from "./Confirmation"

import styles from "styles/Item.module.css"

interface ItemProps {
  name: string
  price: bigint
}

const Item: React.FC<ItemProps> = ({ name, price }) => {
  const { data: canisterDepositAddress, call } = useActorMethod(
    "canister_deposit_principal"
  )

  useEffect(() => {
    call()
  }, [])

  const { data, isLoading, write } = useContractWrite({
    address: "0xb44B5e756A894775FC32EDdf3314Bb1B1944dC34",
    abi: helperAbi,
    functionName: "deposit",
    value: price,
    args: [canisterDepositAddress]
  })

  if (isLoading) {
    return <div>Buying {name}…</div>
  } else if (data?.hash) {
    return <Confirmation hash={data.hash} item={name} />
  } else {
    return (
      <div className={styles.item}>
        <h3>{name}</h3>
        <div>{formatEther(price).toString()} ETH</div>
        <button onClick={() => write()}>Buy {name}</button>
      </div>
    )
  }
}

export default Item
