class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  // This class is used to implement the query features like filtering, sorting, limiting fields, and pagination

  //filter
  filter() {
    //1A filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    //1B Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|ne)\b/g,
      (match) => `$${match}`,
    );
    this.query.find(JSON.parse(queryStr));
    return this;
  }

  //sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  //3 fields limit
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // Exclude __v field
    }
    return this;
  }
  //4 pagination
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // if (this.queryString.page) {
    //   const numTours = Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default APIFeatures;