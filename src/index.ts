// // const name = "Hailey",
// //     age = 30,
// //     gender = "female";
// // interface Human {
// //     name: string;
// //     age: number;
// //     gender: string;
// // }
// //js에 인터페이스 컴파일 되지 않아서 class로 컨트롤 가능함 (단, ts에서는 클래스가 어떤 속성+권한들을 가지는지 선언해줘야함)
// class Human {
//     public name: string;
//     private age: number;
//     public gender: string;
//     constructor(name: string, age: number, gender?: string) { // 클래스가 시작될때 호출되는 method
//         this.name = name;
//         this.age = age;
//         this.gender = gender;
//     }
// }
// // const person = {
// //     name: "Hey",
// //     age: 20,
// //     gender: "male"
// // }
// const lynn = new Human("Lynn", 18);
//
// // 각 파라미터에 type을 지정해줄 수 있음, return 형태도 지정해줌
// const sayHi = (name:string, age:number, gender?:string): void => {
//     console.log(`Hi ${name}, you are ${age}, you are a ${gender}`);
// }
// // return 형태를 string으로 지
// const sayHello = (person: Human): string => {
//     return `Hello ${person.name}, you are ${person.age}, you are a ${person.gender}!`;
// }
// // arguments를 2개만 적으면 에러를 내서, 컴파일도 안되기 때문에 실수 막아줌
// // 그러나 파라미터에 ?를 붙여주면 optional로 인식해서 에러나지 않음 wow!
// sayHi("Hailey", 30, "female");
// // console.log(sayHello(person));
// console.log(sayHello(lynn));

import * as CryptoJS from "crypto-js";

class Block {
    // Static method > method가 Block안에 있고, 클래스가 생성되지 않아도 호출할수 있는 Method다
    static calculateBlockHash = (index: number, previousHash: string, timestamp: number, data: string): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block): boolean => typeof aBlock.index === "number" && typeof aBlock.hash === "string" && typeof aBlock.previousHash === "string" && typeof aBlock.timestamp === "number" && typeof aBlock.data === "string";

    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(index: number,
                hash: string,
                previousHash: string,
                data: string,
                timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

// Block.calculateBlockHash(); //static 함수이기 때문에 여기서 사용가능함

const genesisBlock: Block = new Block(0, "2020202020202", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock];//Block의 array! Block이 아니면 에러!!
console.log(blockchain);

const getBlockchain = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimestamp, data);
    const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
}

const getHashforBlock = (aBlock: Block): string =>
    Block.calculateBlockHash(
        aBlock.index,
        aBlock.previousHash,
        aBlock.timestamp,
        aBlock.data
    );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash) {
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    } else {
        return true;
    }
};

const addBlock = (candidateBlock: Block): void => {
    if(isBlockValid(candidateBlock, getLatestBlock())){
        blockchain.push(candidateBlock);
    }
}
createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");
console.log(blockchain);
// 모듈이 된다고 선언해줘야함 (bug인듯?)
export {};