const { test, expect } = require('@playwright/test');

test.describe('Deck of Cards API', () => {

test('Deck of Cards game flow', async ({ page, request }) => {
    // 1. Navigating to website and confirming the site is up as 2. step
    await page.goto('https://deckofcardsapi.com/');
    const title = await page.title();
    expect(title).toBe('Deck of Cards API');

    // 3. Getting a new deck
    const response = await request.get('https://deckofcardsapi.com/api/deck/new/');
    const data = await response.json();
    expect(response.ok()).toBe(true);
    expect(data.success).toBe(true);
    let deckId = data.deck_id;

    // 4. Shuffle the deck
    const shuffleResponse = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    const shuffleData = await shuffleResponse.json();
    expect(shuffleData.success).toBe(true);

    // 5. I deal three cards to each of two players by specifying a count of 6
    const dealResponse = await request.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`);
    const dealData = await dealResponse.json();
    // console.log(dealData)
    // console.log(dealData.cards)
    expect(dealData.success).toBe(true);
    expect(dealData.cards.length).toBe(6);

    // Dividing the cards into two arrays of 3 cards to each player
    const player1Cards = dealData.cards.slice(0, 3);
    console.log(player1Cards)
    const player2Cards = dealData.cards.slice(3);
    console.log(player2Cards)

    // 6. Defined a function to check whether either has blackjack
    const hasBlackjack = (cards) => {
        const cardValues = cards.map(card => card.value);
        console.log(cardValues)

        return (cardValues.includes('ACE') && 
                (cardValues.includes('10') || cardValues.includes('JACK') || 
                cardValues.includes('QUEEN') || cardValues.includes('KING')));
    };

    // If player 1 or player 2 has blackjack, I log the result
    if (hasBlackjack(player1Cards)) {
        console.log("Player 1 has blackjack!");
    }
    if (hasBlackjack(player2Cards)) {
        console.log("Player 2 has blackjack!");
    }
    });

    /**
     * I'm not very familiar with Blackjack game so I googled a bit to understand it better, so I'm not sure if I'm doing this correctly.
     * What I understood is game starts with each player getting two cards, and the goal is to get as close to 21 as possible.
     * But this task requires to deal 3 cards to each player at the beginning, so I'm assuming that the game is already in progress.
     * That's why assuming that if any of 2 cards of those 3 cards is an Ace and the other one is a face card, then the player has blackjack.
     */
 });