package pkg

import (
	"log"
	"strconv"
	"time"

	"api.semifinal.eec.technocorner.id/config"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func Session() gin.HandlerFunc {
	time0 := time.Now()
	time1 := time.Now().AddDate(0, 1, 0)
	key0 := ""
	key1 := ""
	for i := 0; i < 8 && (len(key0) < 32 || len(key1) < 32); i++ {
		if len(key0) < 32 {
			key0 += (time0.Month().String() + strconv.Itoa(time0.Year()))
		}
		if len(key1) < 32 {
			key1 += (time1.Month().String() + strconv.Itoa(time1.Year()))
		}
	}

	key := []([]byte){[]byte(key0[:32]), []byte(key1[:32])}

	store := cookie.NewStore(key...)
	store.Options(sessions.Options{Path: "/", Domain: config.GetDomain(), MaxAge: config.GetMaxAge()})

	return sessions.Sessions("semifinal.eec.session", store)
}

func GetSession(ctx *gin.Context, key interface{}) interface{} {
	session := sessions.Default(ctx)
	val := session.Get(key)
	return val
}

func SetSession(ctx *gin.Context, key interface{}, val interface{}) {
	session := sessions.Default(ctx)
	session.Set(key, val)
}

func SaveSession(ctx *gin.Context) {
	session := sessions.Default(ctx)
	session.Options(sessions.Options{Path: "/", MaxAge: config.GetMaxAge()})
	if err := session.Save(); err != nil {
		log.Fatalln(err)
	}
}

func ClearSession(ctx *gin.Context) {
	session := sessions.Default(ctx)
	session.Clear()
	session.Options(sessions.Options{Path: "/", MaxAge: -1})
	if err := session.Save(); err != nil {
		log.Fatalln(err)
	}
}
