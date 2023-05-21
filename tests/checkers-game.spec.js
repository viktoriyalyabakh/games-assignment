const { test, expect } = require("@playwright/test");

test.describe("Checkers game", () => {
  /**
   * 1. Navigate to https://www.gamesforthebrain.com/game/checkers/
   * 2. Confirm that the site is up
   * 3. Make five legal moves as orange:
   *  a) Include taking a blue piece
   *  b) Use “Make a move” as confirmation that you can take the next step
   *  c) Restart the game after five moves
   *  d) Confirm that the restarting had been successful
   */

  test.skip("Checkers game automation", async ({ page }) => {
    const response = await page.goto("https://www.gamesforthebrain.com/game/checkers/");

    // Confirming here site is up
    expect(response.status()).toBe(200);

    let bluePieces = page.locator('img[src^="me"]');
    let initialBluePiecesCount = await page.locator('img[src="me1.gif"]').count();

    // Since task requires to make 5 moves, I created an array of 5 legal moves so I can loop through them
    const moves = [
      { from: { x: 6, y: 2 }, to: { x: 5, y: 3 } },
      { from: { x: 2, y: 2 }, to: { x: 3, y: 3 } },
      { from: { x: 1, y: 1 }, to: { x: 2, y: 2 } },
      { from: { x: 2, y: 2 }, to: { x: 0, y: 4 } },
      { from: { x: 0, y: 2 }, to: { x: 2, y: 4 } },
    ];

    let capturedBluePiecesCount = 0; // Created counter here so I can dynamically count how many blue pieces were captured

    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      const from = page.locator(`[name="space${move.from.x}${move.from.y}"]`);
      const to = page.locator(`[name="space${move.to.x}${move.to.y}"]`);

      await from.click();
      await to.click();

      await page.waitForTimeout(3000);

      let currentBluePiecesCount = await page.locator('img[src="me1.gif"]').count();

       // Checking here if a blue piece was captured
      if (currentBluePiecesCount < initialBluePiecesCount) {
        capturedBluePiecesCount++;
        // Validating here if it was a valid diagonal capture move
        let diffX = Math.abs(move.from.x - move.to.x);
        let diffY = Math.abs(move.from.y - move.to.y);

        expect(diffX === 2 && diffY === 2).toBeTruthy();
      }

      initialBluePiecesCount = currentBluePiecesCount;

      await expect(page.locator("#message")).toHaveText("Make a move.");
    }

    await page.getByRole('link', { name: 'Restart...' }).click();

    // Confirming here that the restarting had been successful by validating 2 things
    // 1. That the blue pieces count is the same as the initial count by adding the capturedBluePiecesCount to it so it must be 12
    expect(bluePieces).toHaveCount(initialBluePiecesCount + capturedBluePiecesCount);
    // 2. That the message is "Select an orange piece to move."
    await expect(page.locator("#message")).toHaveText("Select an orange piece to move.");
  });
});