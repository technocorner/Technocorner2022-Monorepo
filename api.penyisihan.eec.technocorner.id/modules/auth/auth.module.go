package auth

func Module(a *Auth) {
	checkSignIn(a)
	signIn(a)
	signOut(a)
}
