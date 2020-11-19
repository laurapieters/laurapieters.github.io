function playGame(){
    let board = new Board();
    // document.body.appendChild(board.makeBoard());
    document.getElementById("message").innerHTML = 'Turn first card';
    document.getElementById("nrOfTurns").innerHTML = 'Number of turns: '+0;
}

class Board{
    constructor(){
        this.cards = this.makeBoard();
        this.turnedCards = [];
        this.nrOfTurns = 0;
        this.firstClick = false;
        this.secondClick = false;
        this.foundPairs = 0;
        this.remainingCards = this.cards;
        this.frozenCards = [];
    }

    onTurnCallback = (card) => {
        if(this.firstClick){
            this.secondClick = true;
            setTimeout(() => {
                this.freezeAllCards();
            },1);
            this.firstClick = false;
        }else{
            this.firstClick = true;
            document.getElementById("message").innerHTML = 'Turn second card';
        }

        this.turnedCards.push(card);
        if (this.turnedCards.length === 2) {
            // check for match
            if (this.turnedCards[0].getId() === this.turnedCards[1].getId()) {
                // updating
                this.frozenCards.push(this.turnedCards[0]);
                this.frozenCards.push(this.turnedCards[1]);
                this.turnedCards = [];
                this.nrOfTurns++;
                this.foundPairs++;

                // messages
                document.getElementById("message").innerHTML = 'Match!';
                    setTimeout(() => {
                        this.unfreezeRemainingCards();
                        if(this.foundPairs === 10){
                            document.getElementById("message").innerHTML = 'You have finished the game in '+this.nrOfTurns+' turns!';
                        }else{
                            document.getElementById("message").innerHTML = 'Turn first card';
                        }

                    },1000);
                document.getElementById("nrOfTurns").innerHTML = 'Number of turns: '+this.nrOfTurns;

            } else {
                document.getElementById("message").innerHTML = 'No match :(';
                setTimeout(() => {
                    document.getElementById("message").innerHTML = 'Remember your cards';
                },1000);
                setTimeout(() => {
                    this.turnedCards[0].turnBack();
                    this.turnedCards[1].turnBack();
                    this.turnedCards = [];
                    document.getElementById("message").innerHTML = 'Turn first card';
                    this.unfreezeRemainingCards();
                },4000);
                this.nrOfTurns++;
                document.getElementById("nrOfTurns").innerHTML = 'Number of turns: '+this.nrOfTurns;
            }
        }
    }

    freezeAllCards(){
        for(let i = 0; i < this.cards.length; i++){
            this.cards[i].freezeCard();
        }
    }

    freezeFrozenCards(){
        for(let i = 0; i < this.frozenCards.length; i++){
            this.frozenCards[i].freezeCard();
        }
    }

    unfreezeRemainingCards(){
        for(let i = 0; i < this.remainingCards.length; i++){
            this.remainingCards[i].unfreezeCard();
        }
        this.freezeFrozenCards();
    }

    makeBoard(){
        const cards = [];
        let board = document.createElement('div');
        board.setAttribute('id', 'board');
        let ids = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
        ids = shuffle(ids);
        for(let i = 0; i < ids.length; i++){
            const card = new Card(ids[i],this.onTurnCallback);
            cards.push(card);
            board.appendChild(card.createCard());
            if((i+1) % 5 == 0){
                const br = document.createElement('br');
                board.appendChild(br);
            }
        }
        document.body.appendChild(board);
        return cards;
    }

}

class Card{
    constructor(id, onTurnCallback) {
        this.id = id;
        this.src = this.getImageSrc();
        this.image = document.createElement('img');
        this.onTurnCallback = onTurnCallback;
    }

    createCard(){
        this.image.setAttribute('data-id', this.id);
        this.image.setAttribute('src', 'Images/backgroundCard.png');
        this.image.onclick = this.turnCard;
        return this.image;
    }

    turnCard = () => {
        this.image.setAttribute('src', this.src);
        this.freezeCard()
        this.onTurnCallback(this);
    }

    getId(){
        return this.id;
    }

    freezeCard(){
        this.image.onclick = null;
    }

    unfreezeCard(){
        this.image.onclick = this.turnCard;
    }

    turnBack(){
        this.image.setAttribute('src', 'Images/backgroundCard.png');
        this.unfreezeCard()
    }

    getImageSrc(){
        let src = '';
        switch(this.id) {
            case 1:
                src = 'Images/hut-gloves512+.png';
                break;
            case 2:
                src = 'Images/cookies512+.png';
                break;
            case 3:
                src = 'Images/candles512+.png';
                break;
            case 4:
                src = 'Images/socks512+.png';
                break;
            case 5:
                src = 'Images/santa-chimney512+.png';
                break;
            case 6:
                src = 'Images/gift512+.png';
                break;
            case 7:
                src = 'Images/fireplace512+.png';
                break;
            case 8:
                src = 'Images/santa512+.png';
                break;
            case 9:
                src = 'Images/christmas-hut512+.png';
                break;
            case 10:
                src = 'Images/snowman512+.png';
                break;
        }
        return src;
    }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}