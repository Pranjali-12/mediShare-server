
let QRCode=require('qrcode')

const message = {
  name: 'Ibuprofen',
  description:'Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID). It reduces inflammation, hence helps to decrease swelling, pain, or fever.',
  quantity:20,
  mfd:'2023-12-10',
  exp:'2024-12-20'
};

QRCode.toFile(`./qr/${Date.now()}_qr.png`, JSON.stringify(message), {
    color: {
      dark: '#00F',  
      light: '#0000' 
    }
  }, function (err) {
    if (err) throw err
    console.log('done')
  })