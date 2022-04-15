class Preload extends Phaser.Scene{
    constructor(){
        super('Preload')
    }

    preload(){ //carregamento dos assets
        this.load.image('start', '../assets/img/start.png')
        this.load.image('sky', '../assets/img/sky.png')
        this.load.image('platform', '../assets/img/platform.png')
        this.load.image('enemy', '../assets/img/enemy.png')

        this.load.spritesheet('player', '../assets/img/player.png', {frameWidth:32, frameHeight:32}) //ultimos parametros: dimensoes de cada sprite
        this.load.spritesheet('coin', '../assets/img/coin.png', {frameWidth:36, frameHeight:40})

    } 

    create(){
        this.anims.create({
            key:'walk', //nome que tenha a ver com a animação
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 6
            }),//identificar os frames da spritesheet
            frameRate: 8,
            repeat: -1 //infinito
        })
        
        this.anims.create({
            key:'spin',
            frames: this.anims.generateFrameNumbers('coin', {
                start:0,
                end:6
            }),
            frameRate: 20,
            repeat: -1,
        })

        this.scene.start('StartScene') //"puxa" a próxima cena
    }
}