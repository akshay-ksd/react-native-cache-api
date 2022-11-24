import {AsyncStorage } from 'react-native';
import axios from 'axios';



export async function getData(key: string, url: string, resetCache: boolean){
  if(key !== null && url !== null){
      const timeKey = `${key}time`;

      if(resetCache){
        AsyncStorage.removeItem(timeKey)
        AsyncStorage.removeItem(key)
      }

      const cacheIntervaInHours = 24
      const cacheExpiryTime = new Date()
      cacheExpiryTime.setHours(cacheExpiryTime.getHours() + cacheIntervaInHours);

      const lastRequest: string|null = await AsyncStorage.getItem(timeKey);
      if(lastRequest !== null){
        const time = new Date(JSON.parse(lastRequest));
        if(time > cacheExpiryTime){
         const res = await apiCall(url,key,timeKey);
         return res;
        }else{
          const data: string|null = await AsyncStorage.getItem(key);
          return JSON.parse(data);
        }
      }else{
        const res = await apiCall(url,key,timeKey);
        return res;
      }
  }else{
    return false
  }
}

const apiCall =async(url: string, key: string, timeKey: string)=>{
  const res = await axios.get(`${url}`);
  const value: string = JSON.stringify(res.data)
  AsyncStorage.setItem(key,value);
  const newDate = JSON.stringify(new Date())
  AsyncStorage.setItem(timeKey,newDate);
  return res.data;
}
