function splitStringIntoThree(str) {
    let len = str.length;
    let partLen = Math.ceil(len / 3);
    let parts = [];
    
    for(let i = 0; i < len; i += partLen) {
        parts.push(str.substr(i, partLen));
    }
    
    return parts;
}

let str = "这是一个需要被分割的字符串";
let result = splitStringIntoThree(str);

console.log(result);  // 输出结果
