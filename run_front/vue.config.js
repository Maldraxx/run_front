module.exports = {

  devServer: {
        proxy: {
      
      '/blue': {
        target: 'https://destiny-back-63f6h32ypq-de.a.run.app',
        changeOrigin: true,
        secure: false, // HTTPS 프록시 요청에 대해 SSL 검증을 무시합니다.
        logLevel: 'debug' // 프록시 과정의 디버그 로그를 활성화합니다.
      }
    }
  }
}
