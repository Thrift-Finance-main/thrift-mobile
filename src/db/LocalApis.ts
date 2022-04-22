import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key:string, value:string) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        // saving error
        return true;
    }
}

export const storeObj = async (key:string, obj:Object) => {
    try {
        const jsonValue = JSON.stringify(obj)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        // saving error
    }
}

export const getData = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            // value previously stored
        }
    } catch(e) {
        // error reading value
    }
}


export const getObj = async (key:string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        // error reading value
    }
}

export const getAllKeys = async () => {

    try {
        return await AsyncStorage.getAllKeys()
    } catch (e) {
        // read key error
    }
}

export const removeData = async (key:string) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch(e) {
        // remove error
    }
}

export const removeMultiple = async (keys:string[]) => {
    try {
        await AsyncStorage.multiRemove(keys)
    } catch(e) {
        // remove error
    }
}

export const setMultipleData = async (data: [string,string][]) => {
    try {
        await AsyncStorage.multiSet(data)
    } catch(e) {
        // read error
    }
}
export const getMultipleData = async (keys:string[]) => {
    try {
        return await AsyncStorage.multiGet(keys)
    } catch(e) {
        return {
            error: e
        }
    }
}
export const clearAll = async () => {
    try {
        await AsyncStorage.clear()
    } catch(e) {
        // clear error
    }

    console.log('Done.')
}




export const mergeObj = async (key:string, newObj:Object) => {
    try {
        if (AsyncStorage.mergeItem) {
            await AsyncStorage.mergeItem(key, JSON.stringify(newObj));
        }
    } catch(e) {
        // error reading value
    }
}


