package pkg

func GenerateWsCode(userId string) (string, error) {
	encrypted, err := Encrypt(userId)

	return encrypted, err
}
