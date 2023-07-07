
const CryptoJS =require('crypto-js');

const key = CryptoJS.enc.Utf8.parse('OtoA81sslqdpdGZ6');
const iv = CryptoJS.enc.Utf8.parse('OtoA81sslqdpdGZ6');
const encryptCommon={
    encryptId: (str) => {
        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(str), key,
        {
            keySize: 128/8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    },

    decryptId: (str) => {
        // const decrypted = CryptoJS.AES.decrypt(str, key);
        // return decrypted?.toString(CryptoJS.enc.Utf8);

        try {
            const decrypted = CryptoJS.AES.decrypt(str, key, {
              keySize: 128 / 8,
              iv: iv,
              mode: CryptoJS.mode.CBC,
              padding: CryptoJS.pad.Pkcs7,
            });
            return decrypted?.toString(CryptoJS.enc.Utf8);
          } catch (ex) {
            return str;
          }
    }
}

module.exports = encryptCommon;