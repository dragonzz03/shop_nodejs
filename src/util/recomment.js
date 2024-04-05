class ProductRecommendation {
  constructor(infoCustomers, infoProducts, evaluates) {
    this.infoCustomers = infoCustomers;
    this.infoProducts = infoProducts;
    this.evaluates = evaluates;
  }
  recommendProducts(userId, numberOfRecommendations = 5) {
    const user = this.infoCustomers.find(customer => customer._id === userId);
    if (!user) {
      console.log('User not found.');
      return [];
    }
    const userAge = user.age;
    const userGender = user.gender;
    // Lọc sản phẩm theo nhiều tiêu chí
    const filteredProducts = this.infoProducts.filter(product => {
      return (
        product.targetAge >= userAge - 5 && // Tuổi trong khoảng 5 năm
        product.targetAge <= userAge + 5 && // Tuổi trong khoảng 5 năm
        product.targetGender === userGender
      );
    });
    // Lấy danh sách sản phẩm đã được đánh giá bởi người dùng
    const userRatings = this.evaluates
      .filter(evaluate => evaluate.idUser === userId)
      .map(evaluate => evaluate.idProduct);
    // Lọc sản phẩm đã đánh giá khác
    const recommendedProducts = filteredProducts.filter(product => {
      return !userRatings.includes(product._id.toString());
    });
    // Sắp xếp sản phẩm theo đánh giá giảm dần
    recommendedProducts.sort((a, b) => {
      const evaluateA = this.getAverageRating(a._id);
      const evaluateB = this.getAverageRating(b._id);
      return evaluateB - evaluateA;
    });
    // Chọn tối đa numberOfRecommendations sản phẩm
    const finalRecommendations = recommendedProducts.slice(0, numberOfRecommendations);
    return finalRecommendations;
  }
  getAverageRating(productId) {
    const productEvaluates = this.evaluates.filter(evaluate => evaluate.idProduct === productId);
    if (productEvaluates.length === 0) {
      return 0;
    }
    const totalRating = productEvaluates.reduce((sum, evaluate) => sum + evaluate.evaluate, 0);
    return totalRating / productEvaluates.length;
  }
}

module.exports = ProductRecommendation;