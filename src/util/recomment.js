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


// Example usage:

// const infoCustomers = [
//   { _id: 1, age: 25, gender: 'male' },
//   { _id: 2, age: 30, gender: 'female' },
//   { _id: 3, age: 33, gender: 'female' },
//   { _id: 4, age: 31, gender: 'male' },
//   { _id: 5, age: 19, gender: 'female' },
//   // ... other customers
// ];

// const infoProducts = [
//   { _id: 101, targetAge: 30, targetGender: 'male' },
//   { _id: 102, targetAge: 30, targetGender: 'female' },
//   { _id: 103, targetAge: 30, targetGender: 'male' },
//   { _id: 104, targetAge: 33, targetGender: 'female' },
//   { _id: 105, targetAge: 31, targetGender: 'female' },
//   // ... other products
// ];

// const evaluates = [
//   { idUser: 1, idProduct: 102, evaluate: 0 },
//   { idUser: 2, idProduct: 102, evaluate: 5 },
//   { idUser: 3, idProduct: 103, evaluate: 2 },
//   { idUser: 4, idProduct: 104, evaluate: 4 },
//   { idUser: 5, idProduct: 105, evaluate: 0 },
//   // ... other evaluations
// ];

// const recommendationSystem = new ProductRecommendation(infoCustomers, infoProducts, evaluates);
// const userId = 1;
// const numberOfRecommendations = 5;
// const recommendedProducts = recommendationSystem.recommendProducts(userId, numberOfRecommendations);
// console.log('Recommended Products:', recommendedProducts);


module.exports = ProductRecommendation;