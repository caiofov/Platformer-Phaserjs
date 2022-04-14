class Scene01 extends Phaser.Scene{
    constructor(){
        super('Scene01') //nome que vamos nos referir a essa cena
    }

    preload(){ //carregamento dos assets
        this.load.image('sky', '../assets/img/sky.png')
        this.load.spritesheet('player', '../assets/img/player.png', {frameWidth:32, frameHeight:32}) //ultimos parametros: dimensoes de cada sprite
    } 
    create(){ //criação e configuraçao das variaveis e recursos básicos
        this.sky = this.add.image(0,0,'sky').setOrigin(0,0) //posição e nome da imagem
        this.sky.displayWidth = game.config.width
        this.sky.displayHeight = game.config.height

        this.player = this.physics.add.sprite(50, 50, 'player')
        this.player.setCollideWorldBounds(true) //colide com as bordas do mundo
        this.player.setScale(2)
    } 
    update(){ //onde será criada a dinamica e regras do jogo
    }
}