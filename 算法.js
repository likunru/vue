// 约瑟夫问题

function Joseph(peoples, num) {
    let flag = 0;
    let arr = [];
    while(peoples.length > 1) {
       let length = peoples.length;
       let out = 0;
       
       for (let i = 0; i < length; i++) {
           flag++;
           if (flag === num) {
               flag = 0;
               peoples.splice( i + out, 0)
               arr.push(i)
           }
       }
    }
    return peoples[0]
}