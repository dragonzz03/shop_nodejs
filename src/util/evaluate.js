
function calculateAverageRating(evaluations) {
  if (evaluations.length === 0) {
    return 0;
  }

  const totalRating = evaluations.reduce((sum, evaluation) => sum + evaluation.evaluate, 0);
  return totalRating / evaluations.length;
}

module.exports = { calculateAverageRating };
