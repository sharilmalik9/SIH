import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export class File {
  created: string;
  modified: string;
  name: string;
  content: string;
  billType: number;

  constructor(
    created: string,
    modified: string,
    content: string,
    name: string,
    billType: number
  ) {
    this.created = created;
    this.modified = modified;
    this.content = content;
    this.name = name;
    this.billType = billType;
  }
}

export class Local {
  _saveFile = async (file: File) => {
    let data = {
      created: file.created,
      modified: file.modified,
      content: file.content,
      name: file.name,
      billType: file.billType,
    };
    await Storage.set({
      key: file.name,
      value: JSON.stringify(data),
    });
  };

  _saveFileFir = async (file: File) => {
    let data = {
      created: file.created,
      modified: file.modified,
      content: file.content,
      name: file.name,
      billType: file.billType,
    };
    const res = await fetch('https://sih-inter2023-default-rtdb.firebaseio.com/form.json',{
      method : 'POST',
      headers :{
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(data)
    })
  };

  _getFile = async (name: string) => {
    const rawData = await Storage.get({ key: name });
    return JSON.parse(rawData.value);
  };

  _getAllFiles = async () => {
    let arr = {};
    const { keys } = await Storage.keys();
    // console.log(keys);
    for (let i = 0; i < keys.length; i++) {
      let fname = keys[i];
      const data = await this._getFile(fname);
      // console.log(data)
      arr[fname] = (data as any).modified;
    }
    console.log(arr)
    return arr;
  };
  _getAllFilesFir = async () => {
    let arr = {};
    const res = await fetch('https://sih-inter2023-default-rtdb.firebaseio.com/form.json',{
      method : 'GET',
      headers :{
        'Content-Type' : 'application/json'
      }
    })
    const data = await res.json();
    // const { keys } = await Storage.keys();
    // console.log(keys);
    // for (let i = 0; i < keys.length; i++) {
    //   let fname = keys[i];
    //   const data = await this._getFile(fname);
    //   arr[fname] = (data as any).modified;
    // }
    // console.log(typeof(data))
    // console.log(Object.keys(data))
    // console.log(data)
    const keys1 = Object.keys(data);
    keys1.forEach(async (key)=>{
      
      const rawData = data[key];
      // console.log(rawData);
      // const parseddata = await JSON.parse(rawData);
      // console.log(parseddata)
      arr[rawData.name] = (rawData as any).modified;
    })
    console.log(arr)
    return arr;
  };

  _deleteFile = async (name: string) => {
    await Storage.remove({ key: name });
  };

  _checkKey = async (key) => {
    const { keys } = await Storage.keys();
    if (keys.includes(key, 0)) {
      return true;
    } else {
      return false;
    } 
  };
}
// firebase entry 

