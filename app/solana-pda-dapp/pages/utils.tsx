import { BN } from '@project-serum/anchor';

interface User {
    name: string;
    phone: string;
    birthDay: string;
    address1: string;
    address2: string;
    address3: string;
    subPhone: string;
};

export interface Contract {
    sellerPhone: string;
    buyerPhone: string;
    item: string;
    kind: string;
    formalDay: string;
    areaFlatUnit: string;
    address1: string;
    address2: string;
    address3: string;
    option: BN;
    flatPrice: BN;
    contractPrice: BN;
    firstYn: boolean;
    firstPrice: BN;
    firstEndCount: BN;
    secondYn: boolean;
    secondPrice: BN;
    secondEndCount: BN;
    thirdYn: boolean;
    thirdPrice: BN;
    thirdEndCount: BN;
    returnDate: string;
}

let seller_phone_ls = ["01064820799", "01012345678", "01098765432", "01011112222"];
let seller_name_ls = ["주얼범범..", "zzz_hahaha", "솔라나 chain", "배추왕 주주주"];
let seller_birthDay_ls = ["19950101", "19960202", "19970303", "19980404"];
let seller_subPhone_ls = ["01064820799", "01012345678", "01098765432", "01011112222"];
let seller_address_ls = [
    "서울 서초구 강남대로 27 1302호 06774", 
    "서울 강남구 가로수길 5 어쩌라고 06035", 
    "서울 강남구 가로수길 27 마스터집 06035",
    "서울 강남구 가로수길 5 준호의 집 06035"
]

let buyer_phone_ls = ["01064820321", "01087654321", "01012344321", "01033332222"];
let buyer_name_ls = ["선물받는사람", "왕중왕 돼지", "맛있는 배추", "맛있는 계란"]; 
let buyer_birthDay_ls = ["19940101", "19950202", "19960303", "19970404"];
let buyer_subPhone_ls = ["01064820321", "01087654321", "01012344321", "01033332222"];
let buyer_address_ls = [
    "서울 서초구 강남대로 27 우리집 06774",
    "서울 강남구 가로수길 9 408호 06035",
    "서울 강남구 가로수길 5 준호의 회사 06035",
    "부산 해운대구 APEC로 17 afsdf 48060"
]

export function getAllUsers(): Array<User> {
    let users: Array<User> = [];
    for(let i = 0; i < seller_name_ls.length; i++) {
        let [seller_address1, seller_address2, seller_address3] = splitStringIntoThree(seller_address_ls[i]);
        
        let seller: User = {
            name: seller_name_ls[i],
            phone: seller_phone_ls[i],
            birthDay: seller_birthDay_ls[i],
            address1: seller_address1,
            address2: seller_address2,
            address3: seller_address3,
            subPhone: seller_subPhone_ls[i]
        };
        users.push(seller);

    }

    for(let i = 0; i < buyer_name_ls.length; i++) {
        let [buyer_address1, buyer_address2, buyer_address3] = splitStringIntoThree(buyer_address_ls[i]);
        
        let buyer: User = {
            name: buyer_name_ls[i],
            phone: buyer_phone_ls[i],
            birthDay: buyer_birthDay_ls[i],
            address1: buyer_address1,
            address2: buyer_address2,
            address3: buyer_address3,
            subPhone: buyer_subPhone_ls[i]
        };
        users.push(buyer);
    }

    console.log(users);

    return users;
}

function splitStringIntoThree(str: string) {
    let len = str.length;
    let partLen = Math.ceil(len / 3);
    let parts: string[] = [];
    
    for(let i = 0; i < len; i += partLen) {
        parts.push(str.substr(i, partLen));
    }
    
    return parts;
}

function randomString(length:number, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let random_number = new BN(Math.floor(Math.random() * (max - min + 1)) + min);
    return random_number;
}

export function randomEvent(): [User, User, Contract] {
    let seller_random_index = Math.floor(Math.random() * seller_name_ls.length);
    let buyer_random_index = Math.floor(Math.random() * buyer_name_ls.length);

    let [seller_address1, seller_address2, seller_address3] = splitStringIntoThree(seller_address_ls[seller_random_index]);
    let [buyer_address1, buyer_address2, buyer_address3] = splitStringIntoThree(buyer_address_ls[buyer_random_index]);
    
    let seller: User = {
        name: seller_name_ls[seller_random_index],
        phone: seller_phone_ls[seller_random_index],
        birthDay: seller_birthDay_ls[seller_random_index],
        address1: seller_address1,
        address2: seller_address2,
        address3: seller_address3,
        subPhone: seller_subPhone_ls[seller_random_index]
    };

    let buyer: User = {
        name: buyer_name_ls[buyer_random_index],
        phone: buyer_phone_ls[buyer_random_index],
        birthDay: buyer_birthDay_ls[buyer_random_index],
        address1: buyer_address1,
        address2: buyer_address2,
        address3: buyer_address3,
        subPhone: buyer_subPhone_ls[buyer_random_index]
    };

    let contract: Contract = {
        sellerPhone: seller.phone,
        buyerPhone: buyer.phone,
        item: randomString(20),
        kind: randomString(20),
        formalDay: randomString(8),
        areaFlatUnit: randomString(20),
        address1: randomString(30),
        address2: randomString(30),
        address3: randomString(30),
        option: getRandomInt(0, 100000),
        flatPrice: getRandomInt(0, 100000),
        contractPrice: getRandomInt(0, 100000),
        firstYn: Math.random() >= 0.5,
        firstPrice: getRandomInt(0, 100000),
        firstEndCount: getRandomInt(0, 1000),
        secondYn: Math.random() >= 0.5,
        secondPrice: getRandomInt(0, 100000),
        secondEndCount: getRandomInt(0, 1000),
        thirdYn: Math.random() >= 0.5,
        thirdPrice: getRandomInt(0, 100000),
        thirdEndCount: getRandomInt(0, 1000),
        returnDate: randomString(8)
    }

    return [seller, buyer, contract];

}

function generateRandomObjectV2(): Array<object> {
    return [
        {
          name: randomString(20),
          phone: randomString(11),
          birthDay: randomString(8),
          address1: randomString(30),
          address2: randomString(30),
          address3: randomString(30),
          subPhone: randomString(11),
        },
        {
          name: randomString(20),
          phone: randomString(11),
          birthDay: randomString(8),
          address1: randomString(30),
          address2: randomString(30),
          address3: randomString(30),
          subPhone: randomString(11),
        },
        {
          item: randomString(20),
          kind: randomString(20),
          formalDay: randomString(8),
          areaFlatUnit: randomString(20),
          address1: randomString(30),
          address2: randomString(30),
          address3: randomString(30),
          option: getRandomInt(0, 100000),
          flatPrice: getRandomInt(0, 100000),
          contractPrice: getRandomInt(0, 100000),
          firstYn: Math.random() >= 0.5,
          firstPrice: getRandomInt(0, 100000),
          firstEndCount: getRandomInt(0, 1000),
          secondYn: Math.random() >= 0.5,
          secondPrice: getRandomInt(0, 100000),
          secondEndCount: getRandomInt(0, 1000),
          thirdYn: Math.random() >= 0.5,
          thirdPrice: getRandomInt(0, 100000),
          thirdEndCount: getRandomInt(0, 1000),
          returnDate: randomString(8)
        }
      ];
}