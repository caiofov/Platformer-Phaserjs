class Scene01 extends Phaser.Scene{
    constructor(){
        super('Scene01') //nome que vamos nos referir a essa cena
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

        this.player.body.setSize(16,25)

        

        this.control = this.input.keyboard.createCursorKeys() //cria um objeto que vai controlar os eventos disparados pelos botoes do teclado
        
        this.platforms = this.physics.add.staticGroup() //grupo de objetos (estáticos) que será aplicado a física
        this.platforms.create(0,game.config.height,'platform')
        .setScale(10,1)
        .setOrigin(0,1) //embaixo esquerda
        .refreshBody() //atualiza o corpo (recalcula as dimensões etc - útil para essses casos de objeto estático que sofreu alteração)
        
        this.movingPlatforms = this.physics.add.group({
            allowGravity: false, //disable gravity
            immovable: true, //imovel
        })

        let mPlatform = this.movingPlatforms.create(140, 475, 'platform')

        //declarando variaveis para auxiliar na movimentaçao
        mPlatform.speed = 2
        mPlatform.minX = 100
        mPlatform.maxX = 300
        
        this.platforms.create(200,200, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(600,400, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(500,100, 'platform').setScale(2,1).refreshBody()
        this.platforms.create(800,300, 'platform').setScale(2,1).refreshBody()

        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 14, //quantidade de moedas
            setXY: { //configuração de posição da primeira moeda
                x: 12,
                y: -50,
                stepX: 70 //distanciamento entre as moedas
            }
        })

        this.coins.children.iterate((coin)=>{
            coin.setBounceY(
                Phaser.Math.FloatBetween(.5,.8) //valores aleatorios dentro de um intervalo
            )
            coin.anims.play('spin')
        })

        this.enemies = this.physics.add.group()
        let enemy = this.enemies.create(
            Phaser.Math.Between(50,950), 0 , 'enemy'
        ).setBounce(1)
        .setCollideWorldBounds(true)
        .setVelocity((Math.random() < .5 ? -200 : 200), 50)
        .setScale(.2)


        this.physics.add.collider(this.player, this.platforms) //calcula as colisoes
        this.physics.add.collider(this.player, this.movingPlatforms, this.platformMovingThings) //ultimo parametro -> ação a ser executada quando houver a colisão
        this.physics.add.collider(this.coins, this.platforms)
        this.physics.add.collider(this.coins, this.movingPlatforms, this.platformMovingThings)
        this.physics.add.collider(this.enemies, this.platforms)
        this.physics.add.collider(this.enemies, this.movingPlatforms, this.platformMovingThings)
        this.physics.add.collider(this.player,this.enemies, this.enemyHit, null, this)



        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this) //null -> função que retorna true or false para saber se collectCoin é pra ser executada

        //reset game world bounds
        this.physics.world.setBounds(0,0,1000,600)

        
        this.cameras.main.startFollow(this.player) //adicionar um camera para seguir o jogador
        this.cameras.main.setBounds(0,0,1000,600) //a camera deve respeitar os limites do jogo
    
    
        //calcular e mostrar o score
        this.score = 0
        this.scoreText = this.add.text(15, 15,`SCORE: ${this.score}`, {fontSize: '32px'})
        .setShadow(0,0,'#000', 3) //valor de deslocamento em x e y , cor da sombra, dispersão da sombra
        .setScrollFactor(0) //fixa o placar na tela (percentural de movimentação)
        this.setScore()

        this.gameOver = false
    } 
    update(){ //onde será criada a dinamica e regras do jogo
        if(!this.gameOver){    
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

            this.movingPlatforms.children.iterate((platform) =>{//move todas as plataformas do grupo
                this.movePlatform(platform)
            }) }
        
    }

    movePlatform(p){
        if(p.x < p.minX || p.x > p.maxX){ //se chegou nas extremidades do movimento, deve inverter a velocidade
            p.speed *= -1
        }
        p.x += p.speed //move a plataforma
    }

    platformMovingThings(sprite, platform){
        sprite.x += platform.speed
    }
    
    collectCoin(player, coin){
        coin.destroy() //apaga a moeda
        this.score++
        this.setScore()
    }

    setScore(){
        this.scoreText.setText(this.score > 9 ? `SCORE: ${this.score}` : `SCORE: 0${this.score}`)
    }

    enemyHit(player, enemy){
        this.physics.pause() //congela os eventos físicos

        player.setTint(0xff0000) //coloração vermelha por cima da imagem da player
        player.anims.stop() //para a animação do player
        this.gameOver = true

        setTimeout(()=>{
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER :(', {fontSize: '50px'})
            .setOrigin(.5)
            .setShadow(0,0, '#000', 3)
            .setScrollFactor(0)

            setTimeout(()=>{
            
                this.add.text(game.config.width/2, game.config.height/2 + 100, 'PRESS ENTER', {fontSize: '32px'})
                .setOrigin(.5)
                .setShadow(0,0, '#000', 3)
                .setScrollFactor(0)
    
                this.input.keyboard.addKey('enter')
                .on('down', ()=>{
                    this.scene.start('Scene01')
                })
            },1000)
        },1000)
    }
}