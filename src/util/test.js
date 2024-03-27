// Dãy chứa nhiều object với key idProduct và evaluate
const evaluations = [
  { idProduct: 101, evaluate: 4 },
  { idProduct: 101, evaluate: 5 },
  { idProduct: 101, evaluate: 1 },
  { idProduct: 101, evaluate: 4 },
  { idProduct: 102, evaluate: 5 },
  { idProduct: 103, evaluate: 2 },
  // ... other evaluations
];

// Hàm tính trung bình số sao của sản phẩm
function calculateAverageRating(productId, evaluations) {
  const productEvaluations = evaluations.filter(evaluation => evaluation.idProduct === productId);
  
  if (productEvaluations.length === 0) {
    return 0; // Trả về 0 nếu không có đánh giá nào cho sản phẩm
  }

  const totalRating = productEvaluations.reduce((sum, evaluation) => sum + evaluation.evaluate, 0);
  return totalRating / productEvaluations.length;
}

// Ví dụ sử dụng
const productId = 101;
const averageRating = calculateAverageRating(productId, evaluations);

console.log(`Average rating for product ${productId}: ${averageRating}`);