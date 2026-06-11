const test = require("node:test");
const assert = require("node:assert/strict");
const demoService = require("../src/services/demo.service");
const recommendationService = require("../src/services/recommendation.service");

test("demo Revival Queue returns ranked inactive games", () => {
  const user = demoService.getOrCreateDemoUser();
  const recommendations = recommendationService.getRevivalQueue(user);

  assert.equal(recommendations.length, 8);

  for (const recommendation of recommendations) {
    assert.ok(recommendation.playtimeMinutes > 0);
    assert.ok(recommendation.days_since_played >= 60);
    assert.ok(recommendation.revivalScore >= 0);
    assert.ok(recommendation.revivalScore <= 100);
    assert.equal(recommendation.revival_score, recommendation.revivalScore);
    assert.ok(recommendation.reason.length > 0);
  }

  for (let index = 1; index < recommendations.length; index += 1) {
    assert.ok(
      recommendations[index - 1].revivalScore >=
        recommendations[index].revivalScore,
    );
  }
});

test("Revival Queue never returns more than ten games", () => {
  const user = demoService.getOrCreateDemoUser();
  const recommendations = recommendationService.getRevivalQueue(user, 100);

  assert.ok(recommendations.length <= 10);
});
