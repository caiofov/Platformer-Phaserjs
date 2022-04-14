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
        this.sky.displayWidth = 1000
        this.sky.displayHeight = game.config.height

        this.player = this.physics.add.sprite(50, 50, 'player')
        this.player.setCollideWorldBounds(true) //colide com as bordas do mundo
        this.player.setScale(2)
        .setBounce(.4) //quicar -> 1:a mesma velocidade que cai, volta | .4 -> volta com 40% da velocidade

        this.player.canJump = true //diz se o player pode ou não pular

        this.anims.create({
            key:'walk', //nome que tenha a ver com a animação
            frames: this.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),//identificar os frames da spritesheet
            frameRate: 8,
            repeat: -1 //infinito
        })

        this.control = this.input.keyboard.createCursorKeys() //cria um objeto que vai controlar os eventos disparados pelos botoes do teclado
        
        this.platforms = this.physics.add.staticGroup() //grupo de objetos (estáticos) que será aplicado a física
        this.platforms.create(0,game.config.height,'platform')
        .setScale(10,1)
        .setOrigin(0,1) //embaixo esquerda
        .refreshBody() //atualiza o corpo (recalcula as dimensões etc - útil para essses casos de objeto estático que sofreu alteração)
        this.platforms.create(200,200, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(600,400, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(500,100, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(800,300, 'platform').setScale(2,1).refreshBody()

        this.physics.add.collider(this.player, this.platforms) //calcula as colisoes
        
        //reset game world bounds
        this.physics.world.setBounds(0,0,1000,600)

        
        this.cameras.main.startFollow(this.player) //adicionar um camera para seguir o jogador
        this.cameras.main.setBounds(0,0,1000,600) //a camera deve respeitar os limites do jogo
    } 
    update(){ //onde será criada a dinamica e regras do jogo
        if(this.control.left.isDown){
            this.player.flipX = true //reverte horizontalmente a imagem
            this.player.anims.play('walk', true) //true -> animaçao deve ser executada mesmo se outro evento estiver acontecendo com esse objeto
            this.player.setVelocityX(-450)
        }
        else if(this.control.right.isDown){
            this.player.flipX = false
            this.player.anims.play('walk',true)
            this.player.setVelocityX(450)
        }
        else{
            this.player.setVelocityX(0)
            this.player.setFrame(0) //deixa parado
        }

        if(this.control.up.isDown && this.player.canJump && this.player.body.touching.down){
            this.player.setVelocityY(-500)
            this.player.canJump = false
        }
        else if(!this.control.up.isDown && !this.player.canJump && this.player.body.touching.down){
            this.player.canJump = true
        }

        if(!this.player.body.touching.down){//ou está pulando ou está caindo
            this.player.setFrame(
                this.player.body.velocity.y < 0 ? 1 : 3
            )
        }
        
    }
}