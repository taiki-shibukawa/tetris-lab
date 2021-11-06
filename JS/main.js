document.getElementById("hello_text").textContent = "はじめてのJavaScript"
document.addEventListener("keydown", onKeyDown);//キーイベントの監視
const transpose = a => a[0].map((_, c) => a.map(r => r[c]));

var count = 0;
var cells;
var blockFlag;
//ブロックのパターン
var blocks = {
    i: {
        class: "i",
        pattern: [
            [1, 1, 1, 1]
        ]
      },
    o: {
        class: "o",
        pattern: [
            [1, 1], 
            [1, 1]
        ]
    },
    t: {
        class: "t",
        pattern: [
            [0, 1, 0], 
            [1, 1, 1]
        ]
    },
    s: {
        class: "s",
        pattern: [
            [0, 1, 1], 
            [1, 1, 0]
        ]
    },
    z: {
        class: "z",
        pattern: [
            [1, 1, 0], 
            [0, 1, 1]
        ]
    },
    j: {
        class: "j",
        pattern: [
            [1, 0, 0], 
            [1, 1, 1]
        ]
    },
    l: {
        class: "l",
        pattern: [
            [0, 0, 1], 
            [1, 1, 1]
        ]
    }
}
loadTable();
setInterval(()=>{
    count++;
    document.getElementById("hello_text").textContent = "はじめてのJavaScript(" + count + ")";

    if (hasFallingBlock()) { // 落下中のブロックがあるか確認する
        fallBlocks();//あればブロックを落とす
    } else { //なければ
        //そろっている行を消す
        deleteRow();
        //ブロックが積み上がり切っていないかチェック
        for (var row=0; row<1; row++) {
            for (var col=0; col<10; col++) {
                if (cells[row][col].className !== "") {
                    alert("Game Over");
                }
            }
        }
        //ランダムにブロックを作成する
        generateBlock();
    }
    
}, 500);

function loadTable() {
    cells = [];
    var td_array = document.getElementsByTagName("td");
    var index = 0;
    for (var row=0; row<20; row++){
        cells[row] = [];
        for (var col=0; col<10; col++){
            cells[row][col] = td_array[index];
            index++;
        }
    }
}

function fallBlocks() {
    //1. 底についていないか？
    for (var i=0; i<10; i++){//最下段にブロックがあれば落下中のフラッグをfalseにする
        if (cells[19][i].blockNum === fallingBlockNum) {
            isFalling = false;
            return;
        }
    }
    //2. 1マス下に別のブロックがないか？
    for (var row=18; row>=0; row--){
        for (var col=0; col<10; col++){
            if (cells[row][col].blockNum === fallingBlockNum){
                if (cells[row+1][col].className !== "" && cells[row+1][col].blockNum !== fallingBlockNum) {
                    isFalling = false;
                    return;
                }
            }
        }
    }
    for (var row = 18; row >= 0; row--) { //下から二番目の行から繰り返しクラスを下げていく
        for (var col = 0; col < 10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row + 1][col].className = cells[row][col].className;
                cells[row + 1][col].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

var isFalling = false;
function hasFallingBlock() {//落下中のブロックがあるか確認する
  return isFalling;
}

function deleteRow() {//そろっている行を消す
    for (var row=19; row>=0; row--) {
        var canDelete = true;
        for (var col=0; col<10; col++) {
            if (cells[row][col].className === "") {
                canDelete = false;
            }
        }
        if (canDelete) {
                //1行消す
            for (var col=0; col<10; col++) {
                //console.log(row, col)
                cells[row][col].className = "";
            }
            //上の行のブロックをすべて1マス落とす
            for (var downRow=row-1; downRow>=0; downRow--) {
                for (var col=0; col<10; col++) {
                    cells[downRow+1][col].className = cells[downRow][col].className;
                    cells[downRow+1][col].blockNum = cells[downRow][col].blockNum;
                    cells[downRow][col].className = "";
                    cells[downRow][col].blockNum = null;
                }
            }
        }
    }
}

var fallingBlockNum = 0;
function generateBlock() {//ランダムにブロックを生成する
    //ランダムにブロックを生成する
    //1. ブロックパターンからランダムに一つパターンを選ぶ
    var keys = Object.keys(blocks);
    var nextBlockKey = keys[Math.floor(Math.random() * keys.length)];
    var nextBlock = blocks[nextBlockKey];
    var nextFallingBlockNum = fallingBlockNum + 1;
    //2. 選んだパターンをもとにブロックを配置する
    var pattern = nextBlock.pattern;
    for (var row=0; row<pattern.length; row++) {
        for (var col=0; col<pattern[row].length; col++) {
            if (pattern[row][col]) {
                cells[row][col+3].className = nextBlock.class;
                cells[row][col+3].blockNum = nextFallingBlockNum;
                console.log(cells[row][col+3].blockNum);
            }
        }
    }
    //3. 落下中のブロックがあるとき
    isFalling = true;
    fallingBlockNum = nextFallingBlockNum;
    //回転判定
    blockFlag = 0;
}

function moveRight() {//ブロックを右に移動させる
    //1. 右についてないか
    for (var i=0; i<20; i++){
        if (cells[i][9].blockNum === fallingBlockNum) {
            return;
        }
    }
    //右にブロックがないか
    for (var row=0; row<20; row++){
        for (var col=0; col<10; col++){
            if (cells[row][col].blockNum === fallingBlockNum){
                if (cells[row][col+1].className !== "" && cells[row][col+1].blockNum !== fallingBlockNum) {
                    return;
                }
            }
        }
    }
    for (var row=0; row<20; row++) {
        for (var col=9; col>=0; col--) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row][col+1].className = cells[row][col].className;
                cells[row][col+1].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

function moveLeft() {//ブロックを左に移動させる
    //左についてないか
    for (var i=0; i<20; i++){
        if (cells[i][0].blockNum === fallingBlockNum) {
            return;
        }
    }
    //左にブロックがないか
    for (var row=0; row<20; row++){
        for (var col=9; col>=1; col--){
            if (cells[row][col].blockNum === fallingBlockNum){
                if (cells[row][col-1].className !== "" && cells[row][col-1].blockNum !== fallingBlockNum) {
                    return;
                }
            }
        }
    }
    for (var row=0; row<20; row++) {
        for (var col=0; col<10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                cells[row][col-1].className = cells[row][col].className;
                cells[row][col-1].blockNum = cells[row][col].blockNum;
                cells[row][col].className = "";
                cells[row][col].blockNum = null;
            }
        }
    }
}

function rotation90() {
    for (var row=0; row<20; row++) {
        for (var col=0; col<10; col++) {
            if (cells[row][col].blockNum === fallingBlockNum) {
                if (cells[row][col].className === "i") {
                    //[                   
                    //    ['0, '0, '0, '0],     ['0, '0, '1, '0],
                    //    ['1, "1, '1, '1],  => ['0, '0, "1, '0], 
                    //    ['0, '0, '0, '0],     ['0, '0, '1, '0],
                    //    ['0, '0, '0, '0]      ['0, '0, '1, '0]
                    //]
                    if (cells[row][col-1].className === "i" && cells[row][col+1].className === "i" && cells[row][col+2].className === "i" && blockFlag === 0) {
                        //一番目
                        cells[row-1][col+1].className = cells[row][col-1].className;
                        cells[row-1][col+1].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //三番目
                        cells[row+1][col+1].className = cells[row][col+1].className;
                        cells[row+1][col+1].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //二番目
                        cells[row][col+1].className = cells[row][col].className;
                        cells[row][col+1].blockNum = cells[row][col].blockNum;
                        cells[row][col].className = "";
                        cells[row][col].blockNum = null;
                        //四番目
                        cells[row+2][col+1].className = cells[row][col+2].className;
                        cells[row+2][col+1].blockNum = cells[row][col+2].blockNum;
                        cells[row][col+2].className = "";
                        cells[row][col+2].blockNum = null;
                        blockFlag = 1;
                        return;
                    }
                    //[                   
                    //    ['0, '0, '1, '0],     ['0, '0, '0, '0],
                    //    ['0, '0, "1, '0],  => ['0, '0, '0, '0], 
                    //    ['0, '0, '1, '0],     ['1, '1, "1, '1],
                    //    ['0, '0, '1, '0]      ['0, '0, '0, '0]
                    //]
                    else if (cells[row-1][col].className === "i" && cells[row+1][col].className === "i" && cells[row+2][col].className === "i" && blockFlag === 1) {
                        //一番目
                        cells[row+1][col+1].className = cells[row-1][col].className;
                        cells[row+1][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //三番目
                        cells[row+1][col-1].className = cells[row+1][col].className;
                        cells[row+1][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //二番目
                        cells[row+1][col].className = cells[row][col].className;
                        cells[row+1][col].blockNum = cells[row][col].blockNum;
                        cells[row][col].className = "";
                        cells[row][col].blockNum = null;
                        //四番目
                        cells[row+1][col-2].className = cells[row+2][col].className;
                        cells[row+1][col-2].blockNum = cells[row+2][col].blockNum;
                        cells[row+2][col].className = "";
                        cells[row+2][col].blockNum = null;
                        blockFlag = 2
                        return;
                        
                    }
                    //[                   
                    //    ['0, '0, '0, '0],     ['0, '1, '0, '0],
                    //    ['0, '0, '0, '0],  => ['0, '1, '0, '0], 
                    //    ['1, '1, "1, '1],     ['0, "1, '0, '0],
                    //    ['0, '0, '0, '0]      ['0, '1, '0, '0]
                    //]
                    else if (cells[row][col+1].className === "i" && cells[row][col-1].className === "i" && cells[row][col-2].className === "i" && blockFlag === 2) {
                        //一番目
                        cells[row+1][col-1].className = cells[row][col+1].className;
                        cells[row+1][col-1].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //三番目
                        cells[row-1][col-1].className = cells[row][col-1].className;
                        cells[row-1][col-1].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //二番目
                        cells[row][col-1].className = cells[row][col].className;
                        cells[row][col-1].blockNum = cells[row][col].blockNum;
                        cells[row][col].className = "";
                        cells[row][col].blockNum = null;
                        //四番目
                        cells[row-2][col-1].className = cells[row][col-2].className;
                        cells[row-2][col-1].blockNum = cells[row][col-2].blockNum;
                        cells[row][col-2].className = "";
                        cells[row][col-2].blockNum = null;
                        blockFlag = 3;
                        return;
                        
                    }
                    //[                   
                    //    ['0, '1, '0, '0],     ['0, '0, '0, '0],
                    //    ['0, '1, '0, '0],  => ['1, "1, '1, '1], 
                    //    ['0, "1, '0, '0],     ['0, '0, '0, '0],
                    //    ['0, '1, '0, '0]      ['0, '0, '0, '0]
                    //]
                    else if (cells[row+1][col].className === "i" && cells[row-1][col].className === "i" && cells[row-2][col].className === "i" && blockFlag === 3) {
                        //一番目
                        cells[row-1][col-1].className = cells[row+1][col].className;
                        cells[row-1][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //三番目
                        cells[row-1][col+1].className = cells[row-1][col].className;
                        cells[row-1][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //二番目
                        cells[row-1][col].className = cells[row][col].className;
                        cells[row-1][col].blockNum = cells[row][col].blockNum;
                        cells[row][col].className = "";
                        cells[row][col].blockNum = null;
                        //四番目
                        cells[row-1][col+2].className = cells[row-2][col].className;
                        cells[row-1][col+2].blockNum = cells[row-2][col].blockNum;
                        cells[row-2][col].className = "";
                        cells[row-2][col].blockNum = null;
                        blockFlag = 0;
                        return;
                    }
                } else if (cells[row][col].className === "t") {
                    //[                   
                    //    ['0, '1, '0],     ['0, '1, '0],
                    //    ['1, "1, '1],  => ['0, "1, '1], 
                    //    ['0, '0, '0]      ['0, '1, '0]
                    //]
                    if (cells[row-1][col].className === "t" && cells[row][col-1].className === "t" && cells[row][col+1].className === "t" && blockFlag === 0) {
                        cells[row+1][col].className = cells[row][col-1].className;
                        cells[row+1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        blockFlag = 1;
                        return;
                    }
                    //[                   
                    //    ['0, '1, '0],     ['0, '0, '0],
                    //    ['0, "1, '1],  => ['1, "1, '1], 
                    //    ['0, '1, '0]      ['0, '1, '0]
                    //]
                    else if (cells[row-1][col].className === "t" && cells[row][col+1].className === "t" && cells[row+1][col].className === "t" && blockFlag === 1) {
                        cells[row][col-1].className = cells[row-1][col].className;
                        cells[row][col-1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        blockFlag = 2;
                        return;
                    } 
                    //[                   
                    //    ['0, '0, '0],     ['0, '1, '0],
                    //    ['1, "1, '1],  => ['1, "1, '0], 
                    //    ['0, '1, '0]      ['0, '1, '0]
                    //]
                    else if (cells[row][col+1].className === "t" && cells[row+1][col].className === "t" && cells[row][col-1].className === "t" && blockFlag === 2) {
                        cells[row-1][col].className = cells[row][col+1].className;
                        cells[row-1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        blockFlag = 3;
                        return;
                    } 
                    //[                   
                    //    ['0, '1, '0],     ['0, '1, '0],
                    //    ['1, "1, '0],  => ['1, "1, '1], 
                    //    ['0, '1, '0]      ['0, '0, '0]
                    //]
                    else if (cells[row-1][col].className === "t" && cells[row+1][col].className === "t" && cells[row][col-1].className === "t" && blockFlag === 3) {
                        cells[row][col+1].className = cells[row+1][col].className;
                        cells[row][col+1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        blockFlag = 0;
                        return;
                    } 
                } else if (cells[row][col].className === "s") {
                    //[                   
                    //    ['0, '1, '1],     ['0, '1, '0],
                    //    ['1, "1, '0],  => ['0, "1, '1], 
                    //    ['0, '0, '0]      ['0, '0, '1]
                    //]
                    if (cells[row-1][col].className === "s" && cells[row-1][col+1].className === "s" && cells[row][col-1].className === "s" && blockFlag === 0) {
                        //二番目
                        cells[row+1][col+1].className = cells[row-1][col+1].className;
                        cells[row+1][col+1].blockNum = cells[row-1][col+1].blockNum;
                        cells[row-1][col+1].className = "";
                        cells[row-1][col+1].blockNum = null;
                        //一番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //三番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //四番目
                        
                        blockFlag = 1;
                        return;
                    }
                    //[                   
                    //    ['0, '1, '0],     ['0, '0, '0],
                    //    ['0, "1, '1],  => ['0, "1, '1], 
                    //    ['0, '0, '1]      ['1, '1, '0]
                    //]
                    else if (cells[row-1][col].className === "s" && cells[row][col+1].className === "s" && cells[row+1][col+1].className === "s" && blockFlag === 1) {
                        //二番目
                        cells[row+1][col-1].className = cells[row+1][col+1].className;
                        cells[row+1][col-1].blockNum = cells[row+1][col+1].blockNum;
                        cells[row+1][col+1].className = "";
                        cells[row+1][col+1].blockNum = null;
                        //一番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //三番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //四番目

                        blockFlag = 2;
                        return;
                    } 
                    //[                   
                    //    ['0, '0, '0],     ['1, '0, '0],
                    //    ['0, "1, '1],  => ['1, "1, '0], 
                    //    ['1, '1, '0]      ['0, '1, '0]
                    //]
                    else if (cells[row][col+1].className === "s" && cells[row+1][col].className === "s" && cells[row+1][col-1].className === "s" && blockFlag === 2) {
                        //二番目
                        cells[row-1][col-1].className = cells[row+1][col-1].className;
                        cells[row-1][col-1].blockNum = cells[row+1][col-1].blockNum;
                        cells[row+1][col-1].className = "";
                        cells[row+1][col-1].blockNum = null;
                        //一番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //三番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //四番目

                        blockFlag = 3;
                        return;
                    } 
                    //[                   
                    //    ['1, '0, '0],     ['0, '1, '1],
                    //    ['1, "1, '0],  => ['1, "1, '0], 
                    //    ['0, '1, '0]      ['0, '0, '0]
                    //]
                    else if (cells[row-1][col-1].className === "s" && cells[row][col-1].className === "s" && cells[row+1][col].className === "s" && blockFlag === 3) {
                        //二番目
                        cells[row-1][col+1].className = cells[row-1][col-1].className;
                        cells[row-1][col+1].blockNum = cells[row-1][col-1].blockNum;
                        cells[row-1][col-1].className = "";
                        cells[row-1][col-1].blockNum = null;
                        //一番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //三番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //四番目

                        blockFlag = 0;
                        return;
                    } 
                } else if (cells[row][col].className === "z") {
                    //[                   
                    //    ['1, '1, '0],     ['0, '0, '1],
                    //    ['0, "1, '1],  => ['0, "1, '1], 
                    //    ['0, '0, '0]      ['0, '1, '0]
                    //]
                    if (cells[row-1][col-1].className === "z" && cells[row-1][col].className === "z" && cells[row][col+1].className === "z" && blockFlag === 0) {
                        //四番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //二番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //一番目
                        cells[row-1][col+1].className = cells[row-1][col-1].className;
                        cells[row-1][col+1].blockNum = cells[row-1][col-1].blockNum;
                        cells[row-1][col-1].className = "";
                        cells[row-1][col-1].blockNum = null;
                        //三番目
                        
                        blockFlag = 1;
                        return;
                    }
                    //[                   
                    //    ['0, '0, '1],     ['0, '0, '0],
                    //    ['0, "1, '1],  => ['1, "1, '0], 
                    //    ['0, '1, '0]      ['0, '1, '1]
                    //]
                    else if (cells[row-1][col+1].className === "z" && cells[row][col+1].className === "z" && cells[row+1][col].className === "z" && blockFlag === 1) {
                        //四番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //二番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //一番目
                        cells[row+1][col+1].className = cells[row-1][col+1].className;
                        cells[row+1][col+1].blockNum = cells[row-1][col+1].blockNum;
                        cells[row-1][col+1].className = "";
                        cells[row-1][col+1].blockNum = null;
                        //三番目

                        blockFlag = 2;
                        return;
                    } 
                    //[                   
                    //    ['0, '0, '0],     ['0, '1, '0],
                    //    ['1, "1, '0],  => ['1, "1, '0], 
                    //    ['0, '1, '1]      ['1, '0, '0]
                    //]
                    else if (cells[row][col-1].className === "z" && cells[row+1][col].className === "z" && cells[row+1][col+1].className === "z" && blockFlag === 2) {
                        //四番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //二番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //一番目
                        cells[row+1][col-1].className = cells[row+1][col+1].className;
                        cells[row+1][col-1].blockNum = cells[row+1][col+1].blockNum;
                        cells[row+1][col+1].className = "";
                        cells[row+1][col+1].blockNum = null;
                        //三番目

                        blockFlag = 3;
                        return;
                    } 
                    //[                   
                    //    ['0, '1, '0],     ['1, '1, '0],
                    //    ['1, "1, '0],  => ['0, "1, '1], 
                    //    ['1, '0, '0]      ['0, '0, '0]
                    //]
                    else if (cells[row-1][col].className === "z" && cells[row][col-1].className === "z" && cells[row+1][col-1].className === "z" && blockFlag === 3) {
                        //四番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //二番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //一番目
                        cells[row-1][col-1].className = cells[row+1][col-1].className;
                        cells[row-1][col-1].blockNum = cells[row+1][col-1].blockNum;
                        cells[row+1][col-1].className = "";
                        cells[row+1][col-1].blockNum = null;
                        //三番目

                        blockFlag = 0;
                        return;
                    } 
                } else if (cells[row][col].className === "j") {
                    //[                   
                    //    ['1, '0, '0],     ['0, '1, '1],
                    //    ['1, "1, '1],  => ['0, "1, '0], 
                    //    ['0, '0, '0]      ['0, '1, '0]
                    //]
                    if (cells[row-1][col-1].className === "j" && blockFlag === 0) {
                        //四番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row-1][col+1].className = cells[row-1][col-1].className;
                        cells[row-1][col+1].blockNum = cells[row-1][col-1].blockNum;
                        cells[row-1][col-1].className = "";
                        cells[row-1][col-1].blockNum = null;
                        //二番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //三番目
                        
                        blockFlag = 1;
                        return;
                    }
                    //[                   
                    //    ['0, '1, '1],     ['0, '0, '0],
                    //    ['0, "1, '0],  => ['1, "1, '1], 
                    //    ['0, '1, '0]      ['0, '0, '1]
                    //]
                    else if (cells[row-1][col+1].className === "j" && blockFlag === 1) {
                        //四番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row+1][col+1].className = cells[row-1][col+1].className;
                        cells[row+1][col+1].blockNum = cells[row-1][col+1].blockNum;
                        cells[row-1][col+1].className = "";
                        cells[row-1][col+1].blockNum = null;
                        //二番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //三番目

                        blockFlag = 2;
                        return;
                    } 
                    //[                   
                    //    ['0, '0, '0],     ['0, '1, '0],
                    //    ['1, "1, '1],  => ['0, "1, '0], 
                    //    ['0, '0, '1]      ['1, '1, '0]
                    //]
                    else if (cells[row+1][col+1].className === "j" && blockFlag === 2) {
                        //四番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row+1][col-1].className = cells[row+1][col+1].className;
                        cells[row+1][col-1].blockNum = cells[row+1][col+1].blockNum;
                        cells[row+1][col+1].className = "";
                        cells[row+1][col+1].blockNum = null;
                        //二番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //三番目

                        blockFlag = 3;
                        return;
                    } 
                    //[                   
                    //    ['0, '1, '0],     ['1, '0, '0],
                    //    ['0, "1, '0],  => ['1, "1, '1], 
                    //    ['1, '1, '0]      ['0, '0, '0]
                    //]
                    else if (cells[row+1][col-1].className === "j" && blockFlag === 3) {
                        //四番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row-1][col-1].className = cells[row+1][col-1].className;
                        cells[row-1][col-1].blockNum = cells[row+1][col-1].blockNum;
                        cells[row+1][col-1].className = "";
                        cells[row+1][col-1].blockNum = null;
                        //二番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //三番目

                        blockFlag = 0;
                        return;
                    } 
                } else if (cells[row][col].className === "l") {
                    //[                   
                    //    ['0, '0, '1],     ['0, '1, '0],
                    //    ['1, "1, '1],  => ['0, "1, '0], 
                    //    ['0, '0, '0]      ['0, '1, '1]
                    //]
                    if (cells[row-1][col+1].className === "l" && blockFlag === 0) {
                        //四番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row+1][col+1].className = cells[row-1][col+1].className;
                        cells[row+1][col+1].blockNum = cells[row-1][col+1].blockNum;
                        cells[row-1][col+1].className = "";
                        cells[row-1][col+1].blockNum = null;
                        //二番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        //三番目
                        
                        blockFlag = 1;
                        return;
                    }
                    //[                   
                    //    ['0, '1, '0],     ['0, '0, '0],
                    //    ['0, "1, '0],  => ['1, "1, '1], 
                    //    ['0, '1, '1]      ['1, '0, '0]
                    //]
                    else if (cells[row+1][col+1].className === "l" && blockFlag === 1) {
                        //四番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row+1][col-1].className = cells[row+1][col+1].className;
                        cells[row+1][col-1].blockNum = cells[row+1][col+1].blockNum;
                        cells[row+1][col+1].className = "";
                        cells[row+1][col+1].blockNum = null;
                        //二番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        //三番目

                        blockFlag = 2;
                        return;
                    } 
                    //[                   
                    //    ['0, '0, '0],     ['1, '1, '0],
                    //    ['1, "1, '1],  => ['0, "1, '0], 
                    //    ['1, '0, '0]      ['0, '1, '0]
                    //]
                    else if (cells[row+1][col-1].className === "l" && blockFlag === 2) {
                        //四番目
                        cells[row-1][col].className = cells[row][col-1].className;
                        cells[row-1][col].blockNum = cells[row][col-1].blockNum;
                        cells[row][col-1].className = "";
                        cells[row][col-1].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row-1][col-1].className = cells[row+1][col-1].className;
                        cells[row-1][col-1].blockNum = cells[row+1][col-1].blockNum;
                        cells[row+1][col-1].className = "";
                        cells[row+1][col-1].blockNum = null;
                        //二番目
                        cells[row+1][col].className = cells[row][col+1].className;
                        cells[row+1][col].blockNum = cells[row][col+1].blockNum;
                        cells[row][col+1].className = "";
                        cells[row][col+1].blockNum = null;
                        //三番目

                        blockFlag = 3;
                        return;
                    } 
                    //[                   
                    //    ['1, '1, '0],     ['0, '0, '1],
                    //    ['0, "1, '0],  => ['1, "1, '1], 
                    //    ['0, '1, '0]      ['0, '0, '0]
                    //]
                    else if (cells[row-1][col-1].className === "l" && blockFlag === 3) {
                        //四番目
                        cells[row][col+1].className = cells[row-1][col].className;
                        cells[row][col+1].blockNum = cells[row-1][col].blockNum;
                        cells[row-1][col].className = "";
                        cells[row-1][col].blockNum = null;
                        blockFlag = 1;
                        //一番目
                        cells[row-1][col+1].className = cells[row-1][col-1].className;
                        cells[row-1][col+1].blockNum = cells[row-1][col-1].blockNum;
                        cells[row-1][col-1].className = "";
                        cells[row-1][col-1].blockNum = null;
                        //二番目
                        cells[row][col-1].className = cells[row+1][col].className;
                        cells[row][col-1].blockNum = cells[row+1][col].blockNum;
                        cells[row+1][col].className = "";
                        cells[row+1][col].blockNum = null;
                        //三番目

                        blockFlag = 0;
                        return;
                    } 
                }
            }
        }
    }
}


function onKeyDown(event) {
    if (event.keyCode === 37) {
        moveLeft();
    } else if (event.keyCode === 39) {
        moveRight();
    } else if (event.keyCode === 40) {
        rotation90();
    } 
}
/*vueの勉強用
var app =  new Vue({
    el: "#app",
    data: {
        message: "たいき"
    }
});

var app2 = new Vue({
    el: "#app2",
    data: {
        error: true
    }
});

var app3 = new Vue({
    el: "#app3",
    data: {
        error_class: "error",
        img_src: "img01.png"
    }
});

var app4 = new Vue({
    el: "#app4",
    data: {
        now: "00:00:00"
    },
    methods: {
        time: function(e) {
            var date = new Date();
            this.now = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        }
    }
});

var app5 = new Vue({
    el: "#app5",
    data: {
        prefs: [
            {name: '北海道'},
            {name: '青森県'},
            {name: '岩手県'},
            {name: '宮城県'},
            {name: '秋田県'},
            {name: '山形県'},
            {name: '福島県'}
        ]
    },
    methods: {
        shuffle: function() {
            this.prefs = _.shuffle(this.prefs);
        }
    }
});

Vue.component('alert-box', {
    template: `
    <div class="alert" v-on:click="caution">
        <strong>Error!</strong>
        <slot></slot>
    </div>
    `,
    methods: {
        caution: function() {
            alert('クリックされました');
        }
    }
});

var app = new Vue({
    el: "#app6"
});
*/