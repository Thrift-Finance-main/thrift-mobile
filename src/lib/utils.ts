import {BigNum, Value} from "@emurgo/react-native-haskell-shelley";

// BigNum: +int, max. digits -> 5 000 000 222 222 222 ,(16)
export const subBigNum = async (a:string, b:string) => {
    console.log('subStrNum');
    const aBig =  await BigNum.from_str(a)
    const bBig = await BigNum.from_str(b)
    const r = await aBig.checked_sub(bBig);
    console.log(await r.to_str());
    return await r.to_str();
}

export const addBigNum = async (a:string, b:string) => {
    console.log('addBigNum');
    const aBig =  await BigNum.from_str(a)
    const bBig = await BigNum.from_str(b)
    const r = await aBig.checked_add(bBig);
    console.log(await r.to_str());
    return await r.to_str();
}

export const divBigNum = async (a:string, b:string) => {
    console.log('divBigNum');
    const aBig =  await BigNum.from_str(a)
    const bBig = await BigNum.from_str(b)
    const r = await aBig.clamped_sub(bBig);
    console.log(await r.to_str());
    return await r.to_str();
}
