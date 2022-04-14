window.onload = function(){
    const config = {
        type: Phaser.Canvas, //tipo de tecnologia para renderizar a imagem na tela do navegador
        //AUTO -> proprio sistema escolhe a tecnologia
        //Canvas / WebGL
        width: 800,
        height: 600,
        scene: [Scene01] //pode passar várias cenas e carregá-las dinamicamente durante o jogo
    }
    let game = new Phaser.Game()
}