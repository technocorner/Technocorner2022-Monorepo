package session

import (
	"log"
	"strconv"
	"time"

	"api.penyisihan.eec.technocorner.id/config"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func Init() gin.HandlerFunc {
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

	domain := config.GetEnv(config.EnvEnum.SessionDomain).(string)

	maxAge := 0
	maxAgeString := config.GetEnv(config.EnvEnum.SessionMaxAge).(string)
	maxAge, err := strconv.Atoi(maxAgeString)
	if err != nil {
		log.Println(err)
	}

	store.Options(sessions.Options{Path: "/", Domain: domain, MaxAge: maxAge})

	return sessions.Sessions("final.eec.session", store)
}

func Get(ctx *gin.Context, key interface{}) interface{} {
	session := sessions.Default(ctx)
	val := session.Get(key)
	return val
}

func Set(ctx *gin.Context, key interface{}, val interface{}) {
	session := sessions.Default(ctx)
	session.Set(key, val)
}

func Save(ctx *gin.Context) {
	session := sessions.Default(ctx)

	maxAge := 0
	maxAgeString := config.GetEnv(config.EnvEnum.SessionMaxAge).(string)
	maxAge, err := strconv.Atoi(maxAgeString)
	if err != nil {
		log.Println(err)

	}

	session.Options(sessions.Options{Path: "/", MaxAge: maxAge})
	if err := session.Save(); err != nil {
		log.Fatalln(err)
	}
}

func Clear(ctx *gin.Context) {
	session := sessions.Default(ctx)
	session.Clear()
	session.Options(sessions.Options{Path: "/", MaxAge: -1})
	if err := session.Save(); err != nil {
		log.Fatalln(err)
	}
}
