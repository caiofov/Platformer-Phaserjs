class Scene01 extends Phaser.Scene{
    constructor(){
        super('Scene01') //nome que vamos nos referir a essa cena
    }

    preload(){ //carregamento dos assets
        this.load.image('sky', '../assets/img/sky.png')
        this.load.image('platform', '../assets/img/platform.png')
        this.load.spritesheet('player', '../assets/img/player.png', {frameWidth:32, frameHeight:32}) //ultimos parametros: dimensoes de cada sprite
    } 
    create(){ //criação e configuraçao das variaveis e recursos básicos
        this.sky = this.add.image(0,0,'sky').setOrigin(0,0) //posição e nome da imagem
        this.sky.displayWidth = game.config.width
        this.sky.displayHeight = game.config.height

        this.player = this.physics.add.sprite(50, 50, 'player')
        this.player.setCollideWorldBounds(true) //colide com as bordas do mundo
        this.player.setScale(2)

        this.player.canJump = true //diz se o player pode ou não pular

        this.control = this.input.keyboard.createCursorKeys() //cria um objeto que vai controlar os eventos disparados pelos botoes do teclado
        
        this.platforms = this.physics.add.staticGroup() //grupo de objetos (estáticos) que será aplicado a física
        this.platforms.create(0,game.config.height,'platform')
        .setScale(6.6,1)
        .setOrigin(0,1) //embaixo esquerda
        .refreshBody() //atualiza o corpo (recalcula as dimensões etc - útil para essses casos de objeto estático que sofreu alteração)
        this.platforms.create(200,200, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(600,400, 'platform').setScale(2,1).refreshBody()

        this.physics.add.collider(this.player, this.platforms) //calcula as colisoes
    
    } 
    update(){ //onde será criada a dinamica e regras do jogo
        if(this.control.left.isDown){
            this.player.setVelocityX(-150)
        }
        else if(this.control.right.isDown){
            this.player.setVelocityX(150)
        }
        else{
            this.player.setVelocityX(0)
        }

        if(this.control.up.isDown && this.player.canJump){
            this.player.setVelocityY(-500)
            this.player.canJump = false
        }
        else if(!this.control.up.isDown && !this.player.canJump){
            this.player.canJump = true
        }
        
    }
}