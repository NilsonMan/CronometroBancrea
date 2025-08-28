const sample = 1;
const height = 4;
const width = 4;
const channel = 3;

// input: (s,h,w,c)

const tensor = [
  [
    [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ],
    [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ],
    [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ],
    [
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ],
  ],
];

console.log("sample (siempre es 1)", tensor.length);
console.log("height", tensor[0].length);
console.log("width", tensor[0][0].length);
console.log("channels (rgb)", tensor[0][0][0].length);

// selfie vs id (2, 6)
// photo y video (1,6)
const model_output = [
    [probabilidadDeNoSerRostro, probabilidadDeSerRostro, coordYTopLeft, coordXTopLeft, coordYBottomRight, coordXBottomRight], // rostro 1
    [0.4, 0.6, 0.2, 0.2, 0.6, 0.6]  // rostro 2
    [_, _, 0.2, 0.2, 0.6, 0.6]  // rostro 2
    //...
    [probabilidadDeNoSerRostro, probabilidadDeSerRostro, coordYTopLeft, coordXTopLeft, coordYBottomRight, coordXBottomRight]  // rostro n
]

// No utilizar probabilidadDeNoSerRostro y probabilidadDeSerRostro
// enviar recorte en jpg

