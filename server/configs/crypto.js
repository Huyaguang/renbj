'use strict';

var crypto = require('crypto');
var ursa = require('ursa');

// 加密盐
var CRYPTO_SALT = 's2dfjl+343ls8-7-';
// 加密算法
var CRYPTO_ALGORITHM = 'aes-256-cbc';
// 签名算法
var SIGN_ALGORITHM = 'md5';
// 私钥/公钥头尾格式
var PRIVATE_KEY_HEAD = '-----BEGIN RSA PRIVATE KEY-----\n';
var PRIVATE_KEY_TAIL = '\n-----END RSA PRIVATE KEY-----';
var PUBLIC_KEY_HEAD = '-----BEGIN PUBLIC KEY-----\n';
var PUBLIC_KEY_TAIL = '\n-----END PUBLIC KEY-----';

/**
 * 格式化私钥/公钥字符串
 */
function formatRsaKeyStr(keyStr, isPrivate) {
    var head, tail;
    if (keyStr.substr(0, 10) !== '-----BEGIN') {
        head = isPrivate
            ? PRIVATE_KEY_HEAD
            : PUBLIC_KEY_HEAD;
        keyStr = head + keyStr;
    }
    if (keyStr.substr(-8, 8) !== 'KEY-----') {
        tail = isPrivate
            ? PRIVATE_KEY_TAIL
            : PUBLIC_KEY_TAIL;
        keyStr = keyStr + tail;
    }
    return keyStr;
}

/**
 * 随机一个加密用的32字节(256位)的 key
 */
exports.randomKey32Byte = function randomKey32Byte() {
    var password, cryptoKey;
    password = crypto.randomBytes(16).toString('hex');
    cryptoKey = crypto.pbkdf2Sync(password, CRYPTO_SALT, 10000, 32);
    return cryptoKey.toString('hex');
};
/**
 * 随机一对 RSA 私钥/公钥对
 */
exports.randomRsaKeyPairs = function randomRsaKeyPairs() {
    var privateKey = ursa.generatePrivateKey();
    return {
        privateKeyStr: privateKey.toPrivatePem('utf8'),
        publicKeyStr: privateKey.toPublicPem('utf8')
    };
};
/**
 * 使用 AES 加密指定字符串
 * @param {String} utf8Text  待加密字符串
 * @param {String} cryptoKey 加密 KEY
 * @param {String} cryptoIv  加密 IV
 */
exports.encrypt = function encrypt(utf8Text, cryptoKey, cryptoIv) {
    var cipher, encrypted;
    try {
        cipher = crypto.createCipheriv(CRYPTO_ALGORITHM, cryptoKey, cryptoIv);
        encrypted = cipher.update(utf8Text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
    } catch (exception) {
        console.log(exception);
    }
    return encrypted;
};
/**
 * 使用 AES 解密指定字符串
 * @param {String} base64Text 待解密字符串
 * @param {String} cryptoKey  解密 KEY
 * @param {String} cryptoIv   解密 IV
 */
exports.decrypt = function decrypt(base64Text, cryptoKey, cryptoIv) {
    var decipher, decrypted;
    try {
        decipher = crypto.createDecipheriv(CRYPTO_ALGORITHM, cryptoKey, cryptoIv);
        decrypted = decipher.update(base64Text, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
    } catch (exception) {
        console.log(exception);
    }
    return decrypted;
};
/**
 * 对发送的数据进行签名
 */
exports.sign = function sign(utf8Text, privateKeyStr) {
    var privateKey, signer, signature;
    // 通过私钥字符串制作私钥
    try {
        privateKeyStr = formatRsaKeyStr(privateKeyStr, true);
        privateKey = ursa.createPrivateKey(privateKeyStr);
    } catch (exception1) {
        console.log(exception1);
        return;
    }
    // 使用私钥对数据进行签名
    try {
        signer = ursa.createSigner(SIGN_ALGORITHM);
        signer.update(utf8Text);
        signature = signer.sign(privateKey, 'base64');
    } catch (exception2) {
        console.log(exception2);
        return;
    }
    return signature;
};
/**
 * 对收到的数据进行验证
 */
exports.verify = function verify(utf8Text, signature, publicKeyStr) {
    var publicKey, verifier, result;
    // 通过公钥字符串制作公钥
    try {
        publicKeyStr = formatRsaKeyStr(publicKeyStr, false);
        publicKey = ursa.createPublicKey(publicKeyStr);
    } catch (exception1) {
        console.log(exception1);
        return;
    }
    // 使用公钥对数据进行验证
    try {
        verifier = ursa.createVerifier(SIGN_ALGORITHM);
        verifier.update(utf8Text);
        result = verifier.verify(publicKey, signature, 'base64');
    } catch (exception2) {
        console.log(exception2);
    }
    return result;
};
