package pkg

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"log"
)

func generateRandomKey() []byte {
	randomKey := make([]byte, 32)
	if _, err := rand.Read(randomKey); err != nil {
		log.Fatalln(err)
	}
	return randomKey
}

func generateNonceKey() []byte {
	nonce := make([]byte, 12)
	if _, err := rand.Read(nonce); err != nil {
		log.Fatalln(err)
	}
	return nonce
}

func Encrypt(plain string) (string, error) {
	// If you want to convert a passphrase to a key, use a suitable
	// package like bcrypt or scrypt.
	// When decoded the key should be 16 bytes (AES-128) or 32 (AES-256).
	key := generateRandomKey()
	plainText := []byte(plain)

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Never use more than 2^32 random nonces with a given key because of the risk of a repeat.
	nonce := generateNonceKey()

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	cipherText := aesgcm.Seal(nil, nonce, plainText, nil)

	return base64.RawURLEncoding.EncodeToString(key) + base64.RawURLEncoding.EncodeToString(cipherText[:len(cipherText)-16]) + base64.RawURLEncoding.EncodeToString(cipherText[len(cipherText)-16:]) + base64.RawURLEncoding.EncodeToString(nonce), nil
}

func Decrypt(encrypted string) (string, error) {
	// If you want to convert a passphrase to a key, use a suitable
	// package like bcrypt or scrypt.
	// When decoded the key should be 16 bytes (AES-128) or 32 (AES-256).
	if len(encrypted) <= 81 {
		return "", errors.New("Encrypted code not valid")
	}

	key, err := base64.RawURLEncoding.DecodeString(encrypted[:43])
	if err != nil {
		return "", err
	}
	cipherText, err := base64.RawURLEncoding.DecodeString(encrypted[43 : len(encrypted)-(22+16)])
	if err != nil {
		return "", err
	}
	authTag, err := base64.RawURLEncoding.DecodeString(encrypted[len(encrypted)-(22+16) : len(encrypted)-16])
	if err != nil {
		return "", err
	}
	nonce, err := base64.RawURLEncoding.DecodeString(encrypted[len(encrypted)-16:])
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	plainText, err := aesgcm.Open(nil, nonce, append(cipherText, authTag...), nil)
	if err != nil {
		return "", err
	}

	return string(plainText), nil
}
