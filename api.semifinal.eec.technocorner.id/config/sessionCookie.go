package config

import "os"

func GetDomain() string {
	domain := "localhost"
	if os.Getenv("GIN_MODE") == "release" {
		domain = "technocorner.id"
	}
	return domain
}

func GetMaxAge() int {
	maxAge := 60 * 60
	if os.Getenv("GIN_MODE") == "release" {
		maxAge = 24 * 60 * 60
	}
	return maxAge
}
