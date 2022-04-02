import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key:string, value:string) => {
    try {
        await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
        // saving error
    }
}

const storeObj = async (key:string, obj:Object) => {
    try {
        const jsonValue = JSON.stringify(obj)
        await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
        // saving error
    }
}

const getData = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            // value previously stored
        }
    } catch(e) {
        // error reading value
    }
}


const getObj = async (key:string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        // error reading value
    }
}

const getAllKeys = async () => {

    try {
        return await AsyncStorage.getAllKeys()
    } catch (e) {
        // read key error
    }
}

const removeData = async (key:string) => {
    try {
        await AsyncStorage.removeItem(key)
    } catch(e) {
        // remove error
    }
}

const removeMultiple = async (keys:string[]) => {
    try {
        await AsyncStorage.multiRemove(keys)
    } catch(e) {
        // remove error
    }
}

const setMultipleData = async (data: [string,string][]) => {
    try {
        await AsyncStorage.multiSet(data)
    } catch(e) {
        // read error
    }
}
const getMultipleData = async (keys:string[]) => {
    try {
        return await AsyncStorage.multiGet(keys)
    } catch(e) {
        // read error
    }
}




const mergeObj = async (key:string, newObj:Object) => {
    try {
        if (AsyncStorage.mergeItem) {
            await AsyncStorage.mergeItem('@MyApp_user', JSON.stringify(newObj));
        }
    } catch(e) {
        // error reading value
    }
}

const clearAll = async () => {
    try {
        await AsyncStorage.clear()
    } catch(e) {
        // clear error
    }

    console.log('Done.')
}

